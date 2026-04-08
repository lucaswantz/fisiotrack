import { type PatientWithTreatment } from '@/lib/types'

export default function PatientCard({ patient }: { patient: PatientWithTreatment }) {
  const { status, days_post_op: days, treatment } = patient
  const tags = treatment?.tags ?? []

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-2 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
      {/* Nome + badge de status */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{patient.name}</p>
        {status === 'pre_op' && (
          <span className="shrink-0 inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/40 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-400">
            Pré-op
          </span>
        )}
        {status === 'active' && (
          <span className="shrink-0 inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/40 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-400">
            Ativo
          </span>
        )}
      </div>

      {/* Dias pós-op ou traço */}
      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        {status === 'active' && days !== null ? `Dia ${days}` : '—'}
      </span>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
