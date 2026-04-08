import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import { getTreatmentStatus, getDaysPostOp } from '@/lib/types'

export default async function PatientsPage() {
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
    .select(`*, treatments (id, surgery_date, discharge_date, tags, created_at)`)
    .eq('physiotherapist_id', user.id)
    .order('name')

  const rows = (patients ?? []).map((p) => {
    const activeTreatment = (p.treatments as any[]).find((t) => !t.discharge_date) ?? null
    const status = getTreatmentStatus(activeTreatment)
    const days = getDaysPostOp(activeTreatment)
    return { ...p, treatment: activeTreatment, status, days_post_op: days }
  })

  const statusLabel: Record<string, string> = {
    pre_op: 'Pré-op',
    active: 'Ativo',
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Pacientes</h1>
          <Link
            href="/patients/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            + Novo paciente
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="text-center py-24 text-gray-400 dark:text-gray-600">
            <p>Nenhum paciente cadastrado.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Dias pós-op</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {rows.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/patients/${p.id}`} className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[p.status]}`}>
                        {statusLabel[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {p.days_post_op !== null ? `Dia ${p.days_post_op}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(p.treatment?.tags ?? []).map((tag: string) => (
                          <span key={tag} className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
