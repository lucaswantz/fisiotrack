'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type PatientWithTreatment, type TreatmentStatus } from '@/lib/types'

type SortOrder = 'name' | 'days' | 'status'

const PAGE_SIZE = 15

const statusLabel: Record<TreatmentStatus, string> = {
  pre_op: 'Pré-op',
  active: 'Ativo',
  discharged: 'Alta',
}

const statusColor: Record<TreatmentStatus, string> = {
  pre_op: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400',
  active: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400',
  discharged: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
}

const statusOrder: Record<TreatmentStatus, number> = {
  active: 0,
  pre_op: 1,
  discharged: 2,
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR')
}

export default function PatientsTable({ patients }: { patients: PatientWithTreatment[] }) {
  const [sort, setSort] = useState<SortOrder>('name')
  const [page, setPage] = useState(0)

  const sorted = [...patients].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name, 'pt-BR')
    if (sort === 'days') return (b.days_post_op ?? -1) - (a.days_post_op ?? -1)
    const diff = statusOrder[a.status] - statusOrder[b.status]
    return diff !== 0 ? diff : a.name.localeCompare(b.name, 'pt-BR')
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function changeSort(value: SortOrder) {
    setSort(value)
    setPage(0)
  }

  const options: { value: SortOrder; label: string }[] = [
    { value: 'name', label: 'Nome' },
    { value: 'days', label: 'Dias' },
    { value: 'status', label: 'Status' },
  ]

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Pacientes</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Ordenar por</span>
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
              {options.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => changeSort(opt.value)}
                  className={`px-3 py-1.5 transition-colors ${
                    i > 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''
                  } ${
                    sort === opt.value
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <Link
            href="/patients/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            + Novo paciente
          </Link>
        </div>
      </div>

      {/* Tabela */}
      {sorted.length === 0 ? (
        <div className="text-center py-24 text-gray-400 dark:text-gray-600">
          <p>Nenhum paciente cadastrado.</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Dias pós-op</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Tags</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {paginated.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/patients/${p.id}`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[p.status]}`}>
                        {statusLabel[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {p.status !== 'discharged' && p.days_post_op !== null ? `Dia ${p.days_post_op}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(p.treatment?.tags ?? []).map((tag) => (
                          <span key={tag} className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {p.status === 'discharged' && (
                        <Link
                          href={`/patients/${p.id}/treatments/new`}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                        >
                          + Novo tratamento
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} de {sorted.length} pacientes
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className="px-2 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  «
                </button>
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  className="px-3 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-md text-sm transition-colors ${
                      i === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages - 1}
                  className="px-3 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima
                </button>
                <button
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page === totalPages - 1}
                  className="px-2 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
