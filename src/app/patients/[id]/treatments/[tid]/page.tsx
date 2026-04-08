import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import TreatmentForm from './TreatmentForm'

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ id: string; tid: string }>
}) {
  const { id, tid } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const { data: patient } = await supabase
    .from('patients')
    .select('id, name')
    .eq('id', id)
    .eq('physiotherapist_id', user.id)
    .single()

  if (!patient) notFound()

  const { data: treatment } = await supabase
    .from('treatments')
    .select('*')
    .eq('id', tid)
    .eq('patient_id', id)
    .single()

  if (!treatment) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar name={profile.name} />
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Editar tratamento</h1>
        <p className="text-sm text-gray-500 mb-6">{patient.name}</p>
        <TreatmentForm treatment={treatment} patientId={id} />
      </main>
    </div>
  )
}
