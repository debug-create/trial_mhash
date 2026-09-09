import { Patient } from './types';
import { analyzeExecutionForensics } from './forensicsEngine';

export const INITIAL_PATIENTS: Patient[] = [
  // Demo Anchor 1: Patient caught early with high priority leverage (Access Exhaustion)
  {
    id: 'p-101',
    name: 'Anvesha Sharma',
    age: 48,
    condition: 'Essential Hypertension',
    activeCoMedications: ['Metformin 500mg BD', 'Atorvastatin 10mg HS'],
    knownAllergies: ['Lactose Monohydrate', 'Sulfa Drugs'],
    clinicalState: 'NEEDS_REVIEW',
    actionLabel: 'REVIEW NOW',
    priorityLeverageScore: 88,
    verificationStatus: 'PENDING',
    episodes: [],
    supply: {
      medicationName: 'Amlodipine 5mg',
      dosage: '1 tablet daily',
      currentStock: 0,
      dailyConsumption: 1,
      lastRefillDate: '2026-08-04',
      expectedDepletionDate: '2026-09-04',
      deliveryLeadTimeHours: 6,
      brandName: 'Amlovas 5mg',
      genericName: 'Amlodipine Besylate 5mg',
    },
    doses: [
      {
        id: 'd-1',
        medicationName: 'Amlodipine 5mg',
        dosage: '1 tablet',
        scheduledTime: '08:00 AM Today',
        status: 'MISSED',
      },
      {
        id: 'd-2',
        medicationName: 'Amlodipine 5mg',
        dosage: '1 tablet',
        scheduledTime: '08:00 AM Yesterday',
        status: 'TAKEN',
        takenAt: '08:12 AM',
      },
    ],
    signals: {
      doseEvents: [
        {
          id: 'd-1',
          medicationName: 'Amlodipine 5mg',
          dosage: '1 tablet',
          scheduledTime: '08:00 AM Today',
          status: 'MISSED',
        },
      ],
      supply: {
        medicationName: 'Amlodipine 5mg',
        dosage: '1 tablet daily',
        currentStock: 0,
        dailyConsumption: 1,
        lastRefillDate: '2026-08-04',
        expectedDepletionDate: '2026-09-04',
        deliveryLeadTimeHours: 6,
        brandName: 'Amlovas 5mg',
        genericName: 'Amlodipine Besylate 5mg',
      },
      refill: {
        lastRefillDate: '2026-08-04',
        refillOverdueDays: 3,
        expectedRunoutDate: '2026-09-03',
        feedStaleHours: 2,
      },
      wearable: {
        sleepDisruptionHours: 0.5,
        activityLevelPercentile: 85,
        timezoneChanged: false,
        restingHeartRateDelta: 2,
        isSensorOnline: true,
      },
      labHistory: {
        eGFR: 84,
        serumCreatinine: 0.9,
        lastTestedDate: '2026-07-15',
      },
    },
    recoveryHistory: [
      {
        timestamp: '08:00 AM',
        action: 'Passive Telemetry Signal Extraction',
        result: 'Identified physical stock depletion (0 units) & overdue refill claims feed',
      },
      {
        timestamp: '08:15 AM',
        action: 'Execution Forensics Synthesis Executed',
        result: 'Layer A Risk: 76% · Layer B Cause: ACCESS_EXHAUSTION · Leverage Rank #1',
      },
    ],
  },

  // Demo Anchor 2: Patient with Treatment Intolerance (Side Effect Avoidance)
  {
    id: 'p-102',
    name: 'Rahul Verma',
    age: 34,
    condition: 'Post-Op Bacterial Infection',
    activeCoMedications: ['Paracetamol 650mg PRN'],
    knownAllergies: ['Penicillin Derivatives'],
    clinicalState: 'NEEDS_REVIEW',
    actionLabel: 'REVIEW NOW',
    priorityLeverageScore: 74,
    verificationStatus: 'PENDING',
    episodes: [],
    supply: {
      medicationName: 'Amoxicillin 500mg',
      dosage: '1 capsule TID',
      currentStock: 12,
      dailyConsumption: 3,
      lastRefillDate: '2026-09-02',
      expectedDepletionDate: '2026-09-08',
      deliveryLeadTimeHours: 4,
      brandName: 'Mox 500mg',
      genericName: 'Amoxicillin Trihydrate',
    },
    doses: [
      {
        id: 'd-10',
        medicationName: 'Amoxicillin 500mg',
        dosage: '1 capsule',
        scheduledTime: '02:00 PM Today',
        status: 'MISSED',
      },
    ],
    signals: {
      doseEvents: [
        {
          id: 'd-10',
          medicationName: 'Amoxicillin 500mg',
          dosage: '1 capsule',
          scheduledTime: '02:00 PM Today',
          status: 'MISSED',
        },
      ],
      supply: {
        medicationName: 'Amoxicillin 500mg',
        dosage: '1 capsule TID',
        currentStock: 12,
        dailyConsumption: 3,
        lastRefillDate: '2026-09-02',
        expectedDepletionDate: '2026-09-08',
        deliveryLeadTimeHours: 4,
        brandName: 'Mox 500mg',
        genericName: 'Amoxicillin Trihydrate',
      },
      refill: {
        lastRefillDate: '2026-09-02',
        refillOverdueDays: 0,
        expectedRunoutDate: '2026-09-08',
        feedStaleHours: 1,
      },
      symptoms: [
        {
          symptomName: 'Acute Epigastric Nausea & Distress',
          severity: 8,
          loggedHoursPostDose: 1.5,
        },
      ],
      wearable: {
        sleepDisruptionHours: 1.2,
        activityLevelPercentile: 50,
        timezoneChanged: false,
        restingHeartRateDelta: 4,
        isSensorOnline: true,
      },
    },
    recoveryHistory: [
      {
        timestamp: '02:00 PM',
        action: 'Passive Telemetry Signal Logged',
        result: 'Symptom check-in recorded severity 8/10 epigastric distress post-dose',
      },
      {
        timestamp: '02:15 PM',
        action: 'Layer B Rule Hypothesis Engine Executed',
        result: 'Layer B Assessment: SIDE_EFFECT_AVOIDANCE (Plausible) · Regimen review suggested',
      },
    ],
  },

  // Patient 3: Routine Disruption (Travel / Circadian Drift)
  {
    id: 'p-103',
    name: 'Priya Patel',
    age: 29,
    condition: 'Bronchial Asthma',
    activeCoMedications: ['Montelukast 10mg HS'],
    knownAllergies: ['Aspirin', 'NSAIDs'],
    clinicalState: 'DRIFT',
    actionLabel: 'WATCH',
    priorityLeverageScore: 52,
    verificationStatus: 'PENDING',
    episodes: [],
    supply: {
      medicationName: 'Budesonide 200mcg Inhaler',
      dosage: '2 puffs twice daily',
      currentStock: 40,
      dailyConsumption: 4,
      lastRefillDate: '2026-08-20',
      expectedDepletionDate: '2026-09-20',
      deliveryLeadTimeHours: 6,
      brandName: 'Budecort 200',
      genericName: 'Budesonide Inhalation Powder',
    },
    doses: [
      {
        id: 'd-20',
        medicationName: 'Budesonide 200mcg',
        dosage: '2 puffs',
        scheduledTime: '09:00 AM Today',
        status: 'MISSED',
      },
    ],
    signals: {
      doseEvents: [
        {
          id: 'd-20',
          medicationName: 'Budesonide 200mcg',
          dosage: '2 puffs',
          scheduledTime: '09:00 AM Today',
          status: 'MISSED',
        },
      ],
      supply: {
        medicationName: 'Budesonide 200mcg Inhaler',
        dosage: '2 puffs twice daily',
        currentStock: 40,
        dailyConsumption: 4,
        lastRefillDate: '2026-08-20',
        expectedDepletionDate: '2026-09-20',
        deliveryLeadTimeHours: 6,
        brandName: 'Budecort 200',
        genericName: 'Budesonide Inhalation Powder',
      },
      refill: {
        lastRefillDate: '2026-08-20',
        refillOverdueDays: 0,
        expectedRunoutDate: '2026-09-20',
        feedStaleHours: 4,
      },
      wearable: {
        sleepDisruptionHours: 3.2,
        activityLevelPercentile: 45,
        timezoneChanged: true,
        restingHeartRateDelta: 6,
        isSensorOnline: true,
      },
    },
    recoveryHistory: [
      {
        timestamp: '09:20 AM',
        action: 'Wearable Telemetry Shift Evaluated',
        result: 'Travel timezone shift + 3.2h sleep degradation detected',
      },
    ],
  },

  // Demo Anchor 3: Patient correctly NOT flagged (Spurious Anomaly / False Positive Avoided)
  {
    id: 'p-104',
    name: 'Amit Kumar',
    age: 56,
    condition: 'Hyperlipidemia',
    activeCoMedications: ['Enalapril 5mg'],
    knownAllergies: [],
    clinicalState: 'NORMAL',
    actionLabel: 'STABLE',
    priorityLeverageScore: 12,
    verificationStatus: 'VERIFIED_SUCCESS',
    episodes: [],
    supply: {
      medicationName: 'Atorvastatin 10mg',
      dosage: '1 tablet HS',
      currentStock: 24,
      dailyConsumption: 1,
      lastRefillDate: '2026-08-28',
      expectedDepletionDate: '2026-09-28',
      deliveryLeadTimeHours: 12,
      brandName: 'Atorva 10mg',
      genericName: 'Atorvastatin Calcium',
    },
    doses: [
      {
        id: 'd-30',
        medicationName: 'Atorvastatin 10mg',
        dosage: '1 tablet',
        scheduledTime: '10:00 PM Yesterday',
        status: 'TAKEN',
        takenAt: '09:55 PM',
      },
    ],
    signals: {
      doseEvents: [
        {
          id: 'd-30',
          medicationName: 'Atorvastatin 10mg',
          dosage: '1 tablet',
          scheduledTime: '10:00 PM Yesterday',
          status: 'TAKEN',
          takenAt: '09:55 PM',
        },
      ],
      supply: {
        medicationName: 'Atorvastatin 10mg',
        dosage: '1 tablet HS',
        currentStock: 24,
        dailyConsumption: 1,
        lastRefillDate: '2026-08-28',
        expectedDepletionDate: '2026-09-28',
        deliveryLeadTimeHours: 12,
        brandName: 'Atorva 10mg',
        genericName: 'Atorvastatin Calcium',
      },
      refill: {
        lastRefillDate: '2026-08-28',
        refillOverdueDays: 0,
        expectedRunoutDate: '2026-09-28',
        feedStaleHours: 2,
      },
      wearable: {
        sleepDisruptionHours: 0.3,
        activityLevelPercentile: 90,
        timezoneChanged: false,
        restingHeartRateDelta: 0,
        isSensorOnline: true,
      },
    },
    recoveryHistory: [
      {
        timestamp: '09:55 PM',
        action: 'Routine Evaluation Completed',
        result: 'Single unconfirmed reminder evaluated as benign non-persistent anomaly; system withheld false positive alert',
      },
    ],
  },

  // Patient 5: Coverage Gap (Missing / Stale Feeds — Silence ≠ Stability)
  {
    id: 'p-105',
    name: 'Siddharth Rao',
    age: 61,
    condition: 'Type 2 Diabetes Mellitus',
    activeCoMedications: ['Teneligliptin 20mg'],
    knownAllergies: ['Gluten'],
    clinicalState: 'COVERAGE_GAP',
    actionLabel: 'COVERAGE GAP',
    priorityLeverageScore: 25,
    verificationStatus: 'PENDING',
    episodes: [],
    supply: {
      medicationName: 'Metformin 500mg SR',
      dosage: '1 tablet BD',
      currentStock: 10,
      dailyConsumption: 2,
      lastRefillDate: '2026-07-20',
      expectedDepletionDate: '2026-08-20',
      deliveryLeadTimeHours: 8,
      brandName: 'Glycomet 500',
      genericName: 'Metformin Hydrochloride',
    },
    doses: [
      {
        id: 'd-50',
        medicationName: 'Metformin 500mg SR',
        dosage: '1 tablet',
        scheduledTime: '08:00 PM Yesterday',
        status: 'MISSED',
      },
    ],
    signals: {
      doseEvents: [
        {
          id: 'd-50',
          medicationName: 'Metformin 500mg SR',
          dosage: '1 tablet',
          scheduledTime: '08:00 PM Yesterday',
          status: 'MISSED',
        },
      ],
      supply: {
        medicationName: 'Metformin 500mg SR',
        dosage: '1 tablet BD',
        currentStock: 10,
        dailyConsumption: 2,
        lastRefillDate: '2026-07-20',
        expectedDepletionDate: '2026-08-20',
        deliveryLeadTimeHours: 8,
        brandName: 'Glycomet 500',
        genericName: 'Metformin Hydrochloride',
      },
      refill: {
        lastRefillDate: '2026-07-20',
        refillOverdueDays: 14,
        expectedRunoutDate: '2026-08-20',
        feedStaleHours: 72, // Stale feed > 24h
      },
      wearable: {
        sleepDisruptionHours: 0,
        activityLevelPercentile: 0,
        timezoneChanged: false,
        restingHeartRateDelta: 0,
        isSensorOnline: false, // Disconnected sensor
      },
    },
    recoveryHistory: [
      {
        timestamp: '10:00 AM',
        action: 'Evidence Stream Staleness Protocol Executed',
        result: 'PBM feed stale (>72h) & wearable offline. System abstained from risk score & set explicit COVERAGE GAP state.',
      },
    ],
  },
];

// Initialize forensics attributions for each patient
INITIAL_PATIENTS.forEach((p) => {
  const attrib = analyzeExecutionForensics(p.id, p.name, p.signals);
  p.activeAttribution = attrib;
  p.clinicalState = attrib.clinicalState;
  p.actionLabel = attrib.actionLabel;
  p.priorityLeverageScore = attrib.priorityLeverageScore;
  p.episodes = [attrib.activeEpisode];
});
