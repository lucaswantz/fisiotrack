import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import DashboardGrid from '@/components/DashboardGrid'
import { getTreatmentStatus, getDaysPostOp, type PatientWithTreatment } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const { data: patients } = await supabase
    .from('patients')
    .select(`*, treatments (id, surgery_date, discharge_date, tags, notes, created_at)`)
    .eq('physiotherapist_id', user.id)
    .order('name')

  const activePatients: PatientWithTreatment[] = (patients ?? [])
    .map((p) => {
      const sorted = (p.treatments as any[]).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      const activeTreatment = sorted.find((t) => !t.discharge_date) ?? null
      const lastTreatment = activeTreatment ?? sorted[0] ?? null
      const status = getTreatmentStatus(lastTreatment)
      const days = getDaysPostOp(activeTreatment)
      return { ...p, treatment: activeTreatment, status, days_post_op: days }
    })
    .filter((p) => p.status !== 'discharged')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar name={profile.name} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DashboardGrid patients={activePatients} patientCount={activePatients.length} />
      </main>
    </div>
  )
}
