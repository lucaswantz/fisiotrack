export type Profile = {
  id: string
  name: string
  tv_token: string
  created_at: string
}

export type Patient = {
  id: string
  physiotherapist_id: string
  auth_user_id: string | null
  name: string
  created_at: string
}

export type Treatment = {
  id: string
  patient_id: string
  surgery_date: string | null
  discharge_date: string | null
  tags: string[]
  notes: string | null
  created_at: string
}

export type TreatmentStatus = 'pre_op' | 'active' | 'discharged'

export type PatientWithTreatment = Patient & {
  treatment: Treatment | null
  status: TreatmentStatus
  days_post_op: number | null
}

export function getTreatmentStatus(treatment: Treatment | null): TreatmentStatus {
  if (!treatment) return 'pre_op'
  if (treatment.discharge_date) return 'discharged'
  if (!treatment.surgery_date) return 'pre_op'
  const surgeryDate = new Date(treatment.surgery_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  surgeryDate.setHours(0, 0, 0, 0)
  if (surgeryDate > today) return 'pre_op'
  return 'active'
}

export function getDaysPostOp(treatment: Treatment | null): number | null {
  if (!treatment?.surgery_date) return null
  const surgeryDate = new Date(treatment.surgery_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  surgeryDate.setHours(0, 0, 0, 0)
  if (surgeryDate > today) return null
  const diff = today.getTime() - surgeryDate.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
