'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { type Treatment } from '@/lib/types'

const inputClass = "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:dark:bg-gray-800 disabled:text-gray-500 disabled:dark:text-gray-500"

export default function TreatmentForm({ treatment, patientId }: { treatment: Treatment; patientId: string }) {
  const router = useRouter()
  const [surgeryDate, setSurgeryDate] = useState(treatment.surgery_date ?? '')
  const [tags, setTags] = useState((treatment.tags ?? []).join(', '))
  const [notes, setNotes] = useState(treatment.notes ?? '')
  const [loading, setLoading] = useState(false)
  const [discharging, setDischarging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isActive = !treatment.discharge_date

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('treatments')
      .update({
        surgery_date: surgeryDate || null,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        notes: notes || null,
      })
      .eq('id', treatment.id)

    setLoading(false)
    if (error) { setError(error.message); return }
    router.push(`/patients/${patientId}`)
    router.refresh()
  }

  async function handleDischarge() {
    if (!confirm('Confirmar alta do paciente?')) return
    setDischarging(true)
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]
    const { error } = await supabase
      .from('treatments')
      .update({ discharge_date: today })
      .eq('id', treatment.id)

    setDischarging(false)
    if (error) { setError(error.message); return }
    router.push(`/patients/${patientId}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data da cirurgia</label>
        <input type="date" value={surgeryDate} onChange={(e) => setSurgeryDate(e.target.value)} disabled={!isActive} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags <span className="text-gray-400 font-normal">(separadas por vírgula)</span>
        </label>
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} disabled={!isActive} className={inputClass} placeholder="LIG, MENIS, SUTURA" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observações</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!isActive} rows={3} className={inputClass} />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Cancelar
        </button>
        {isActive && (
          <>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={handleDischarge}
              disabled={discharging}
              className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 disabled:opacity-50 transition-colors"
            >
              {discharging ? 'Dando alta...' : 'Dar alta'}
            </button>
          </>
        )}
      </div>
    </form>
  )
}
