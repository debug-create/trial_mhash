export type ClinicalState =
  | 'NORMAL'
  | 'DRIFT'
  | 'NEEDS_REVIEW'
  | 'COVERAGE_GAP'
  | 'RECOVERED';

export type ActionLabel =
  | 'STABLE'
  | 'WATCH'
  | 'REVIEW NOW'
  | 'COVERAGE GAP'
  | 'RECOVERED';

export type FailureCause =
  | 'ACCESS_EXHAUSTION'
  | 'FORGETTING'
  | 'SIDE_EFFECT_AVOIDANCE'
  | 'ROUTINE_DISRUPTION'
  | 'CLINICAL_CONCERN'
  | 'UNKNOWN';

export type ConfidenceLevel = 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';

export type PatternType = 'INTERMITTENT_SLIP' | 'STRUCTURAL_DRIFT' | 'ACUTE_ABANDONMENT';

export type VerificationStatus =
  | 'PENDING'
  | 'INTERVENTION_SENT'
  | 'STOCK_RESERVED'
  | 'MEDICATION_ACQUIRED'
  | 'DOSE_RESTORED'
  | 'VERIFIED_SUCCESS';

export type SubstitutionSafetyStatus =
  | 'SAFE_EQUIVALENT'
  | 'REQUIRES_PHARMACIST_CONSULT'
  | 'CONTRAINDICATED_SUBSTITUTE';

export interface AlternativeMedication {
  id: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  priceINR: number;
  activeIngredients: string[];
  excipients: string[]; // Binders, colorings, lactose, preservatives
  safetyStatus?: SubstitutionSafetyStatus;
  safetyScore?: number; // 0 to 100
  interactionWarnings?: string[];
}

export interface DoseEvent {
  id: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string; // ISO string or human string
  status: 'TAKEN' | 'MISSED' | 'PENDING' | 'RECOVERED';
  takenAt?: string;
}

export interface MedicationSupply {
  medicationName: string;
  dosage: string;
  currentStock: number;
  dailyConsumption: number;
  lastRefillDate: string;
  expectedDepletionDate: string;
  deliveryLeadTimeHours: number;
  brandName: string;
  genericName: string;
}

export interface RefillSignal {
  lastRefillDate: string;
  refillOverdueDays: number;
  expectedRunoutDate: string;
  feedStaleHours?: number;
}

export interface WearableSignal {
  sleepDisruptionHours: number;
  activityLevelPercentile: number;
  timezoneChanged: boolean;
  restingHeartRateDelta: number;
  isSensorOnline?: boolean;
}

export interface SymptomSignal {
  symptomName: string;
  severity: number; // 1-10
  loggedHoursPostDose: number;
}

export interface PatientSignals {
  doseEvents: DoseEvent[];
  supply: MedicationSupply;
  refill: RefillSignal;
  wearable?: WearableSignal;
  symptoms?: SymptomSignal[];
  labHistory?: {
    eGFR?: number; // mL/min/1.73m2
    serumCreatinine?: number; // mg/dL
    lastTestedDate?: string;
  };
}

export interface EvidenceItem {
  id: string;
  text: string;
  source: string;
  provenance: 'OBSERVED' | 'DERIVED' | 'INFERRED';
  timestamp: string;
}

export interface LayerAShapFeature {
  featureName: string;
  description: string;
  impactPercent: number; // e.g. +31% or -12%
  direction: 'INCREASE_RISK' | 'DECREASE_RISK';
}

export interface LayerBCauseHypothesis {
  causeName: FailureCause;
  title: string;
  assessment: 'PLAUSIBLE' | 'UNLIKELY' | 'HIGH_CERTAINTY';
  supportingEvidence: EvidenceItem[];
  contradictingEvidence: EvidenceItem[];
  assessmentReason: string;
}

export interface DriftEpisode {
  id: string;
  title: string;
  triggerSignal: string;
  startTime: string;
  clinicalState: ClinicalState;
  persistenceScore: number; // 0 to 100
  evidenceCompleteness: number; // 0 to 100
  interventionOpportunity: number; // 0 to 100
  priorityLeverageScore: number; // (persistence * completeness * opportunity) / 10000 -> 0 to 100
  driftRiskPercent: number; // Layer A score
  shapFeatures: LayerAShapFeature[]; // Layer A SHAP outputs
  hypotheses: LayerBCauseHypothesis[]; // Layer B rule outputs
  suggestedAction: 'PHARMACY_RECOVERY' | 'CONTEXTUAL_NUDGE' | 'DOCTOR_ESCALATION';
  status: 'OPEN' | 'CLINICIAN_REVIEWED' | 'INTERVENTION_PENDING' | 'RESOLVED';
}

export interface ForensicsAttribution {
  patientId: string;
  patientName: string;
  medicationName: string;
  missedDoseTime: string;
  clinicalState: ClinicalState;
  actionLabel: ActionLabel;
  detectedCause: FailureCause; // Top plausible hypothesis cause
  confidenceScore: number; // 0 to 100
  confidenceLevel: ConfidenceLevel;
  patternType: PatternType;
  driftRiskPercent: number; // Layer A output
  shapFeatures: LayerAShapFeature[]; // Layer A outputs
  hypotheses: LayerBCauseHypothesis[]; // Layer B outputs
  activeEpisode: DriftEpisode;
  evidence: EvidenceItem[];
  suggestedAction: 'PHARMACY_RECOVERY' | 'CONTEXTUAL_NUDGE' | 'DOCTOR_ESCALATION';
  adherenceTrend30Days: number[];
  priorityLeverageScore: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  priceINR: number;
  inStock: boolean;
  stockConfidence: ConfidenceLevel;
  lastVerifiedMinutesAgo: number;
  verificationSource: 'DIRECT_INVENTORY_API' | 'PARTNER_CONFIRMATION' | 'UNVERIFIED_LISTING';
  supportsDelivery: boolean;
  supportsPickup: boolean;
  estimatedFulfillmentTime: string;
  phone: string;
  whatsapp: string;
  isGenericEquivalent?: boolean;
  storeHours: string;
  transitDelayMins: number;
  reservedUntilTimestamp?: string;
  reservedForPatientId?: string;
  availableAlternatives?: AlternativeMedication[];
}

export interface StockReservation {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  patientId: string;
  patientName: string;
  medicationName: string;
  reservedAt: string;
  expiresAt: string;
  status: 'ACTIVE' | 'FULFILLED' | 'EXPIRED';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  activeCoMedications: string[];
  knownAllergies: string[];
  clinicalState: ClinicalState;
  actionLabel: ActionLabel;
  priorityLeverageScore: number;
  supply: MedicationSupply;
  doses: DoseEvent[];
  signals: PatientSignals;
  activeAttribution?: ForensicsAttribution;
  episodes: DriftEpisode[];
  verificationStatus: VerificationStatus;
  ashaEscalated?: boolean;
  activeReservation?: StockReservation;
  recoveryHistory: {
    timestamp: string;
    action: string;
    result: string;
  }[];
}
