'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputClass = "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

export default function NewPatientForm({ physiotherapistId }: { physiotherapistId: string }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [surgeryDate, setSurgeryDate] = useState('')
  const [tags, setTags] = useState('')
  const [notes, setNotes] = useState('')
  const [isPreOp, setIsPreOp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          surgery_date: surgeryDate || null,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          notes: notes || null,
          is_pre_op: isPreOp,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao cadastrar paciente.')
      router.push(`/patients/${data.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome completo *</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Nome do paciente" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email de acesso *</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="paciente@email.com" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha de acesso *</label>
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="Mínimo 6 caracteres" />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="pre_op"
          type="checkbox"
          checked={isPreOp}
          onChange={(e) => setIsPreOp(e.target.checked)}
          className="rounded border-gray-300 dark:border-gray-700"
        />
        <label htmlFor="pre_op" className="text-sm text-gray-700 dark:text-gray-300">Paciente em pré-operatório</label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Data da cirurgia {isPreOp ? '(pode ser futura)' : ''}
        </label>
        <input type="date" value={surgeryDate} onChange={(e) => setSurgeryDate(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags de cirurgia <span className="text-gray-400 font-normal">(separadas por vírgula)</span>
        </label>
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="LIG, MENIS, SUTURA" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observações</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClass} placeholder="Observações sobre o tratamento..." />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Salvando...' : 'Cadastrar'}
        </button>
      </div>
    </form>
  )
}
