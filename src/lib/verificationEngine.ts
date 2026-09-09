import { Patient, VerificationStatus, ClinicalState, ActionLabel } from './types';

export function advanceVerificationState(
  patient: Patient,
  nextStatus: VerificationStatus,
  actionDetails: string
): Patient {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const updatedHistory = [
    {
      timestamp,
      action: actionDetails,
      result: `Verification ledger updated: ${nextStatus}`,
    },
    ...patient.recoveryHistory,
  ];

  let updatedDoses = [...patient.doses];
  let updatedSupply = { ...patient.supply };
  let newClinicalState: ClinicalState = patient.clinicalState;
  let newActionLabel: ActionLabel = patient.actionLabel;

  // If medication acquired, update physical stock (+30) and mark missed dose as RECOVERED
  if (nextStatus === 'MEDICATION_ACQUIRED' || nextStatus === 'DOSE_RESTORED' || nextStatus === 'VERIFIED_SUCCESS') {
    updatedSupply.currentStock = Math.max(updatedSupply.currentStock + 30, 30);
    updatedDoses = updatedDoses.map((d) =>
      d.status === 'MISSED' ? { ...d, status: 'RECOVERED', takenAt: timestamp } : d
    );
    newClinicalState = 'RECOVERED';
    newActionLabel = 'RECOVERED';
  } else if (nextStatus === 'STOCK_RESERVED') {
    newActionLabel = 'WATCH';
  }

  return {
    ...patient,
    clinicalState: newClinicalState,
    actionLabel: newActionLabel,
    verificationStatus: nextStatus,
    supply: updatedSupply,
    doses: updatedDoses,
    recoveryHistory: updatedHistory,
  };
}
