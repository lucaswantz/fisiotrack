import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Verifica se é paciente ou fisioterapeuta
    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (patient) redirect('/me')
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">FisioTrack</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Acompanhamento de fisioterapia pós-cirúrgica</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
