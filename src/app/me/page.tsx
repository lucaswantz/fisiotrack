import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTreatmentStatus, getDaysPostOp } from '@/lib/types'
import PatientNavbar from '@/components/PatientNavbar'

export default async function MePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: patient } = await supabase
    .from('patients')
    .select(`*, treatments (*)`)
    .eq('auth_user_id', user.id)
    .single()

  if (!patient) redirect('/login')

  const activeTreatment = (patient.treatments as any[]).find((t) => !t.discharge_date) ?? null
  const status = getTreatmentStatus(activeTreatment)
  const days = getDaysPostOp(activeTreatment)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <PatientNavbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{patient.name}</h1>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-sm">
            {status === 'pre_op' && (
              <>
                <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/40 px-3 py-1 text-sm font-medium text-yellow-800 dark:text-yellow-400">
                  Pré-operatório
                </span>
                <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">Aguardando cirurgia</p>
              </>
            )}

            {status === 'active' && days !== null && (
              <>
                <p className="text-7xl font-bold text-blue-600 dark:text-blue-400">{days}</p>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">dias de pós-operatório</p>
                {activeTreatment?.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-1">
                    {activeTreatment.tags.map((tag: string) => (
                      <span key={tag} className="rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            {status === 'discharged' && (
              <>
                <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/40 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-400">
                  Alta concedida
                </span>
                <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">Tratamento encerrado</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
