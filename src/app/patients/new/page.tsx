import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import NewPatientForm from './NewPatientForm'

export default async function NewPatientPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar name={profile.name} />
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Novo paciente</h1>
        <NewPatientForm physiotherapistId={user.id} />
      </main>
    </div>
  )
}
