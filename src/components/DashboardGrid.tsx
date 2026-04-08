'use client'

import { useState } from 'react'
import Link from 'next/link'
import PatientCard from './PatientCard'
import { type PatientWithTreatment } from '@/lib/types'

type SortOrder = 'name' | 'days'

export default function DashboardGrid({ patients, patientCount }: { patients: PatientWithTreatment[], patientCount: number }) {
  const [sort, setSort] = useState<SortOrder>('name')

  const sorted = [...patients].sort((a, b) => {
    if (sort === 'name') {
      return a.name.localeCompare(b.name, 'pt-BR')
    }
    const dA = a.days_post_op ?? -1
    const dB = b.days_post_op ?? -1
    return dB - dA
  })

  const rows = Math.ceil(sorted.length / 4)

  return (
    <div>
      {/* Cabeçalho: título + ordenação + botão */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{patientCount} paciente(s) em tratamento</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Ordenar por</span>
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
              <button
                onClick={() => setSort('name')}
                className={`px-3 py-1.5 transition-colors ${
                  sort === 'name'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Nome
              </button>
              <button
                onClick={() => setSort('days')}
                className={`px-3 py-1.5 border-l border-gray-200 dark:border-gray-700 transition-colors ${
                  sort === 'days'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Dias
              </button>
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

      {sorted.length === 0 ? (
        <div className="text-center py-24 text-gray-400 dark:text-gray-600">
          <p className="text-lg">Nenhum paciente em tratamento.</p>
          <Link href="/patients/new" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
            Cadastrar primeiro paciente
          </Link>
        </div>
      ) : (
        <div
          className="grid grid-cols-4 gap-4"
          style={{ gridAutoFlow: 'column', gridTemplateRows: `repeat(${rows}, auto)` }}
        >
          {sorted.map((patient) => (
            <Link key={patient.id} href={`/patients/${patient.id}`}>
              <PatientCard patient={patient} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
