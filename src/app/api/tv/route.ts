import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token obrigatório.' }, { status: 403 })
  }

  const { data: profile } = await adminClient
    .from('profiles')
    .select('id')
    .eq('tv_token', token)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 403 })
  }

  const { data: patients } = await adminClient
    .from('patients')
    .select(`id, name, treatments (id, surgery_date, discharge_date, tags)`)
    .eq('physiotherapist_id', profile.id)
    .order('name')

  const active = (patients ?? [])
    .map((p) => {
      const activeTreatment = (p.treatments as any[]).find((t) => !t.discharge_date) ?? null
      if (!activeTreatment) return null

      let status = 'pre_op'
      let days = null

      if (activeTreatment.surgery_date) {
        const surgeryDate = new Date(activeTreatment.surgery_date + 'T12:00:00')
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (surgeryDate <= today) {
          status = 'active'
          days = Math.floor((today.getTime() - surgeryDate.getTime()) / (1000 * 60 * 60 * 24))
        }
      }

      return { id: p.id, name: p.name, status, days, tags: activeTreatment.tags ?? [] }
    })
    .filter(Boolean)

  return NextResponse.json(active)
}
