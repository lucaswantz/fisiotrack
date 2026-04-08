import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import { getTreatmentStatus, getDaysPostOp } from '@/lib/types'
import EditPatientForm from './EditPatientForm'

export default async function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
    .select(`*, treatments (*)`)
    .eq('id', id)
    .eq('physiotherapist_id', user.id)
    .single()

  if (!patient) notFound()

  const treatments = (patient.treatments as any[]).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const activeTreatment = treatments.find((t) => !t.discharge_date) ?? null
  const status = getTreatmentStatus(activeTreatment)
  const days = getDaysPostOp(activeTreatment)

  const statusLabel: Record<string, string> = {
    pre_op: 'Pré-operatório',
    active: 'Em tratamento',
    discharged: 'Alta',
  }

  const statusColor: Record<string, string> = {
    pre_op: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400',
    active: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400',
    discharged: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar name={profile.name} />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link href="/patients" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">← Pacientes</Link>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{patient.name}</h1>
            <div className="mt-1 flex items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[status]}`}>
                {statusLabel[status]}
              </span>
              {status === 'active' && days !== null && (
                <span className="text-sm text-gray-500 dark:text-gray-400">Dia <strong className="text-blue-600 dark:text-blue-400">{days}</strong> de pós-op</span>
              )}
            </div>
          </div>
          {status === 'discharged' && (
            <Link
              href={`/patients/${id}/treatments/new`}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              + Novo tratamento
            </Link>
          )}
        </div>

        {/* Dados do paciente (editável) */}
        <EditPatientForm patient={patient} />

        {/* Tratamento ativo */}
        {activeTreatment && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Tratamento atual</h2>
              <Link
                href={`/patients/${id}/treatments/${activeTreatment.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Editar
              </Link>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Data da cirurgia</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                  {activeTreatment.surgery_date
                    ? new Date(activeTreatment.surgery_date + 'T12:00:00').toLocaleDateString('pt-BR')
                    : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Tags</dt>
                <dd className="mt-0.5 flex flex-wrap gap-1">
                  {activeTreatment.tags?.length > 0
                    ? activeTreatment.tags.map((tag: string) => (
                        <span key={tag} className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">{tag}</span>
                      ))
                    : <span className="text-gray-400 dark:text-gray-600">—</span>
                  }
                </dd>
              </div>
              {activeTreatment.notes && (
                <div className="col-span-2">
                  <dt className="text-gray-500 dark:text-gray-400">Observações</dt>
                  <dd className="font-medium text-gray-900 dark:text-gray-100 mt-0.5">{activeTreatment.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Histórico */}
        {treatments.filter((t) => t.discharge_date).length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Histórico de tratamentos</h2>
            <div className="space-y-3">
              {treatments.filter((t) => t.discharge_date).map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Cirurgia: {t.surgery_date
                        ? new Date(t.surgery_date + 'T12:00:00').toLocaleDateString('pt-BR')
                        : '—'}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Alta: {new Date(t.discharge_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {t.tags?.map((tag: string) => (
                      <span key={tag} className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
