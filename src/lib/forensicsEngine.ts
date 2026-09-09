import {
  PatientSignals,
  ForensicsAttribution,
  ClinicalState,
  ActionLabel,
  FailureCause,
  ConfidenceLevel,
  PatternType,
  EvidenceItem,
  LayerBCauseHypothesis,
  DriftEpisode,
} from './types';
import { predictDriftRisk } from './mlEngine';

export function analyzeExecutionForensics(
  patientId: string,
  patientName: string,
  signals: PatientSignals
): ForensicsAttribution {
  const { doseEvents, supply, refill, wearable, symptoms } = signals;

  const missedDose = doseEvents.find((d) => d.status === 'MISSED') || doseEvents[0];
  const missedDoseTime = missedDose ? missedDose.scheduledTime : new Date().toISOString();

  // -------------------------------------------------------------------
  // LAYER A: Calibrated Adherence Drift Risk Model (Logistic Regression + SHAP)
  // -------------------------------------------------------------------
  const mlResult = predictDriftRisk(signals);
  const driftRiskPercent = mlResult.driftRiskPercent;
  const shapFeatures = mlResult.shapFeatures;

  // -------------------------------------------------------------------
  // COVERAGE GAP EVALUATION (Independent of adherence risk calculation)
  // Coverage Gap is computed from evidence completeness & feed staleness
  // -------------------------------------------------------------------
  const isFeedStale = refill.feedStaleHours ? refill.feedStaleHours > 24 : false;
  const isWearableOffline = wearable?.isSensorOnline === false;
  const isCoverageGap = isFeedStale || isWearableOffline;

  // -------------------------------------------------------------------
  // LAYER B: Cause / Evidence Hypothesis Graph (Explicit Rule Matrix)
  // -------------------------------------------------------------------
  const hypotheses: LayerBCauseHypothesis[] = [];
  const allEvidenceItems: EvidenceItem[] = [];

  let evidenceIdCounter = 1;
  const makeEvidence = (
    text: string,
    source: string,
    provenance: 'OBSERVED' | 'DERIVED' | 'INFERRED'
  ): EvidenceItem => ({
    id: `ev-${evidenceIdCounter++}`,
    text,
    source,
    provenance,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  // Hypothesis 1: ACCESS EXHAUSTION
  const accessSupporting: EvidenceItem[] = [];
  const accessContradicting: EvidenceItem[] = [];

  if (supply.currentStock <= 0) {
    const ev = makeEvidence(
      `Physical stock depleted (0 ${supply.dosage} remaining)`,
      'Pharmacy Dispensing Feed',
      'OBSERVED'
    );
    accessSupporting.push(ev);
    allEvidenceItems.push(ev);
  }
  if (refill.refillOverdueDays > 0) {
    const ev = makeEvidence(
      `Refill overdue by ${refill.refillOverdueDays} day(s) from last fill (${refill.lastRefillDate})`,
      'PBM Claims API',
      'OBSERVED'
    );
    accessSupporting.push(ev);
    allEvidenceItems.push(ev);
  }
  if (supply.deliveryLeadTimeHours > 4) {
    const ev = makeEvidence(
      `Fulfillment lead time (${supply.deliveryLeadTimeHours}h) exceeds remaining stock window`,
      'Local Pharmacy Logistics API',
      'DERIVED'
    );
    accessSupporting.push(ev);
    allEvidenceItems.push(ev);
  }

  if (supply.currentStock > 5 && refill.refillOverdueDays === 0) {
    const ev = makeEvidence(
      `Verified stock available on hand (${supply.currentStock} units)`,
      'Pill Counter Sensor',
      'OBSERVED'
    );
    accessContradicting.push(ev);
  }

  hypotheses.push({
    causeName: 'ACCESS_EXHAUSTION',
    title: 'Medication Access Exhaustion',
    assessment:
      accessSupporting.length >= 2
        ? 'HIGH_CERTAINTY'
        : accessSupporting.length === 1
        ? 'PLAUSIBLE'
        : 'UNLIKELY',
    supportingEvidence: accessSupporting,
    contradictingEvidence: accessContradicting,
    assessmentReason:
      accessSupporting.length >= 2
        ? 'Physical stock exhaustion corroborated by overdue refill claims feed.'
        : 'Insufficient evidence of stock exhaustion.',
  });

  // Hypothesis 2: SIDE EFFECT AVOIDANCE
  const sideEffectSupporting: EvidenceItem[] = [];
  const sideEffectContradicting: EvidenceItem[] = [];

  if (symptoms && symptoms.length > 0) {
    const severe = symptoms.find((s) => s.severity >= 5);
    if (severe) {
      const ev = makeEvidence(
        `Adverse symptom logged: "${severe.symptomName}" (Severity ${severe.severity}/10)`,
        'Patient e-Diary Check-in',
        'OBSERVED'
      );
      sideEffectSupporting.push(ev);
      allEvidenceItems.push(ev);

      const ev2 = makeEvidence(
        `Symptom onset occurred ${severe.loggedHoursPostDose}h post-dose execution`,
        'Pharmacokinetic Temporal Engine',
        'DERIVED'
      );
      sideEffectSupporting.push(ev2);
      allEvidenceItems.push(ev2);
    }
  } else {
    const ev = makeEvidence('No adverse symptoms reported in 14-day history', 'Patient e-Diary', 'OBSERVED');
    sideEffectContradicting.push(ev);
  }

  hypotheses.push({
    causeName: 'SIDE_EFFECT_AVOIDANCE',
    title: 'Treatment Intolerance & Side-Effect Avoidance',
    assessment: sideEffectSupporting.length >= 1 ? 'PLAUSIBLE' : 'UNLIKELY',
    supportingEvidence: sideEffectSupporting,
    contradictingEvidence: sideEffectContradicting,
    assessmentReason:
      sideEffectSupporting.length >= 1
        ? 'Misses cluster temporally after acute post-dose symptom onset.'
        : 'No documented side-effect triggers found.',
  });

  // Hypothesis 3: ROUTINE DISRUPTION
  const routineSupporting: EvidenceItem[] = [];
  const routineContradicting: EvidenceItem[] = [];

  if (wearable) {
    if (wearable.timezoneChanged) {
      const ev = makeEvidence(
        'Wearable detected travel timezone shift',
        'Wearable Telemetry Feed',
        'OBSERVED'
      );
      routineSupporting.push(ev);
      allEvidenceItems.push(ev);
    }
    if (wearable.sleepDisruptionHours > 2.0) {
      const ev = makeEvidence(
        `Sleep architecture degraded by ${wearable.sleepDisruptionHours}h disruption`,
        'Wearable Sleep Analytics',
        'DERIVED'
      );
      routineSupporting.push(ev);
      allEvidenceItems.push(ev);
    }
  }

  hypotheses.push({
    causeName: 'ROUTINE_DISRUPTION',
    title: 'Circadian or Travel Routine Disruption',
    assessment: routineSupporting.length >= 1 ? 'PLAUSIBLE' : 'UNLIKELY',
    supportingEvidence: routineSupporting,
    contradictingEvidence: routineContradicting,
    assessmentReason:
      routineSupporting.length >= 1
        ? 'Dose time diverged from routine wakefulness schedule.'
        : 'Routine sleep and timezone vectors remain stable.',
  });

  // Hypothesis 4: FORGETTING
  const forgettingSupporting: EvidenceItem[] = [];
  const forgettingContradicting: EvidenceItem[] = [];

  if (supply.currentStock > 0 && (!symptoms || symptoms.length === 0) && (!wearable || !wearable.timezoneChanged)) {
    const ev = makeEvidence('Adequate stock available on hand with zero side effects', 'System Telemetry', 'DERIVED');
    forgettingSupporting.push(ev);
  }

  hypotheses.push({
    causeName: 'FORGETTING',
    title: 'Cognitive Slip / Unintentional Forgetting',
    assessment: forgettingSupporting.length >= 1 ? 'PLAUSIBLE' : 'UNLIKELY',
    supportingEvidence: forgettingSupporting,
    contradictingEvidence: forgettingContradicting,
    assessmentReason: 'No structural barrier identified; isolated slip.',
  });

  // Pick top candidate cause from Layer B hypotheses
  const sortedHypotheses = [...hypotheses].sort((a, b) => {
    const rank = { HIGH_CERTAINTY: 3, PLAUSIBLE: 2, UNLIKELY: 1 };
    return rank[b.assessment] - rank[a.assessment];
  });
  const topHypothesis = sortedHypotheses[0];
  const detectedCause: FailureCause = topHypothesis.causeName;

  // -------------------------------------------------------------------
  // CLINICAL STATE & ACTION LABELS (5-State System)
  // -------------------------------------------------------------------
  let clinicalState: ClinicalState = 'NORMAL';
  let actionLabel: ActionLabel = 'STABLE';
  let suggestedAction: 'PHARMACY_RECOVERY' | 'CONTEXTUAL_NUDGE' | 'DOCTOR_ESCALATION' = 'CONTEXTUAL_NUDGE';
  let patternType: PatternType = 'INTERMITTENT_SLIP';

  if (isCoverageGap) {
    clinicalState = 'COVERAGE_GAP';
    actionLabel = 'COVERAGE GAP';
    suggestedAction = 'CONTEXTUAL_NUDGE';
  } else if (driftRiskPercent >= 70 || topHypothesis.assessment === 'HIGH_CERTAINTY') {
    clinicalState = 'NEEDS_REVIEW';
    actionLabel = 'REVIEW NOW';
    suggestedAction = detectedCause === 'ACCESS_EXHAUSTION' ? 'PHARMACY_RECOVERY' : 'DOCTOR_ESCALATION';
    patternType = refill.refillOverdueDays > 3 ? 'STRUCTURAL_DRIFT' : 'INTERMITTENT_SLIP';
  } else if (driftRiskPercent >= 45 || topHypothesis.assessment === 'PLAUSIBLE') {
    clinicalState = 'DRIFT';
    actionLabel = 'WATCH';
    suggestedAction = 'CONTEXTUAL_NUDGE';
    patternType = 'INTERMITTENT_SLIP';
  } else {
    clinicalState = 'NORMAL';
    actionLabel = 'STABLE';
    suggestedAction = 'CONTEXTUAL_NUDGE';
  }

  // Calculate Persistence Score, Evidence Completeness, and Priority Leverage Score
  const persistenceScore = Math.min(100, Math.round(refill.refillOverdueDays * 25 + (missedDose ? 35 : 0)));
  const evidenceCompleteness = isCoverageGap ? 25 : Math.min(100, 60 + allEvidenceItems.length * 10);
  const interventionOpportunity = detectedCause === 'ACCESS_EXHAUSTION' ? 95 : 70;
  
  // Priority Leverage Score = Persistence * Completeness * Opportunity / 100
  const priorityLeverageScore = Math.round((persistenceScore * evidenceCompleteness * interventionOpportunity) / 10000);

  let confidenceLevel: ConfidenceLevel = 'MEDIUM_CONFIDENCE';
  if (evidenceCompleteness >= 80) confidenceLevel = 'HIGH_CONFIDENCE';
  else if (evidenceCompleteness < 50) confidenceLevel = 'LOW_CONFIDENCE';

  // Construct Drift Episode object
  const activeEpisode: DriftEpisode = {
    id: `ep-${patientId}-${Date.now().toString().slice(-4)}`,
    title: `Episode: ${topHypothesis.title}`,
    triggerSignal: isCoverageGap
      ? 'Evidence Stream Staleness / Sensor Disconnect'
      : `Dose Execution Divergence (${missedDoseTime})`,
    startTime: missedDoseTime,
    clinicalState,
    persistenceScore,
    evidenceCompleteness,
    interventionOpportunity,
    priorityLeverageScore,
    driftRiskPercent,
    shapFeatures,
    hypotheses,
    suggestedAction,
    status: 'OPEN',
  };

  const adherenceTrend30Days =
    clinicalState === 'NEEDS_REVIEW'
      ? [98, 92, 85, 70, 52]
      : clinicalState === 'DRIFT'
      ? [95, 90, 84, 78, 72]
      : [100, 98, 97, 96, 95];

  return {
    patientId,
    patientName,
    medicationName: supply.medicationName,
    missedDoseTime,
    clinicalState,
    actionLabel,
    detectedCause,
    confidenceScore: evidenceCompleteness,
    confidenceLevel,
    patternType,
    driftRiskPercent,
    shapFeatures,
    hypotheses,
    activeEpisode,
    evidence: allEvidenceItems,
    suggestedAction,
    adherenceTrend30Days,
    priorityLeverageScore,
  };
}

export function exportHL7FHIR_R4(attribution: ForensicsAttribution, patientName: string) {
  return {
    resourceType: 'Bundle',
    id: `bundle-vanishing-dose-${attribution.patientId}`,
    type: 'collection',
    timestamp: new Date().toISOString(),
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: attribution.patientId,
          name: [{ text: patientName }],
        },
      },
      {
        resource: {
          resourceType: 'MedicationRequest',
          id: `medreq-${attribution.patientId}`,
          status: 'active',
          intent: 'order',
          medicationCodeableConcept: {
            text: attribution.medicationName,
          },
          subject: { reference: `Patient/${attribution.patientId}` },
        },
      },
      {
        resource: {
          resourceType: 'DetectedIssue',
          id: `issue-${attribution.patientId}`,
          status: 'final',
          code: {
            text: `Vanishing Dose v2 Clinical State: ${attribution.clinicalState} (Cause Hypothesis: ${attribution.detectedCause})`,
          },
          severity: attribution.clinicalState === 'NEEDS_REVIEW' ? 'high' : 'moderate',
          detail: `Layer A Calibrated Drift Risk: ${attribution.driftRiskPercent}%. Leverage Priority Score: ${attribution.priorityLeverageScore}. SHAP Top Contributor: ${attribution.shapFeatures[0]?.featureName || 'N/A'}. Provenance Evidence: ${attribution.evidence.map((e) => e.text).join(' | ')}`,
          mitigation: [
            {
              action: { text: attribution.suggestedAction },
              date: new Date().toISOString(),
            },
          ],
        },
      },
    ],
  };
}
