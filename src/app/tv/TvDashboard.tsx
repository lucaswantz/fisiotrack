'use client'

import { useEffect, useState, useCallback } from 'react'
import PatientCard from '@/components/PatientCard'
import AppLogo from '@/components/AppLogo'
import { type PatientWithTreatment } from '@/lib/types'

type TvPatient = {
  id: string
  name: string
  status: 'pre_op' | 'active'
  days: number | null
  tags: string[]
}

function toPatientWithTreatment(p: TvPatient): PatientWithTreatment {
  return {
    id: p.id,
    name: p.name,
    physiotherapist_id: '',
    auth_user_id: null,
    created_at: '',
    status: p.status,
    days_post_op: p.days,
    treatment: {
      id: '',
      patient_id: p.id,
      surgery_date: null,
      discharge_date: null,
      tags: p.tags,
      notes: null,
      created_at: '',
    },
  }
}

const PAGE_SIZE = 30

export default function TvDashboard({ token }: { token: string }) {
  const [patients, setPatients] = useState<TvPatient[]>([])
  const [page, setPage] = useState(0)
  const [error, setError] = useState(false)

  // Força dark mode na TV
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const fetchPatients = useCallback(async () => {
    try {
      const res = await fetch(`/api/tv?token=${token}`)
      if (!res.ok) { setError(true); return }
      const data = await res.json()
      setPatients(data)
      setError(false)
    } catch {
      setError(true)
    }
  }, [token])

  useEffect(() => {
    fetchPatients()
    const interval = setInterval(fetchPatients, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchPatients])

  useEffect(() => {
    if (patients.length <= PAGE_SIZE) return
    const total = Math.ceil(patients.length / PAGE_SIZE)
    const interval = setInterval(() => {
      setPage((p) => (p + 1) % total)
    }, 10_000)
    return () => clearInterval(interval)
  }, [patients.length])

  const sorted = [...patients].sort((a, b) => (b.days ?? -1) - (a.days ?? -1))
  const visible = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const rows = Math.ceil(visible.length / 4)

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400">Erro ao carregar dados. Tentando novamente...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <AppLogo />
        <p className="text-gray-400 text-sm">{patients.length} paciente(s) em tratamento</p>
      </div>

      {visible.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Nenhum paciente em tratamento ativo.</p>
        </div>
      ) : (
        <div
          className="grid grid-cols-4 gap-4"
          style={{ gridAutoFlow: 'column', gridTemplateRows: `repeat(${rows}, auto)` }}
        >
          {visible.map((patient) => (
            <PatientCard key={patient.id} patient={toPatientWithTreatment(patient)} />
          ))}
        </div>
      )}

      {patients.length > PAGE_SIZE && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(patients.length / PAGE_SIZE) }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i === page ? 'bg-blue-400' : 'bg-gray-600'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
