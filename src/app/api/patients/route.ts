import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const body = await request.json()
  const { name, email, password, surgery_date, tags, notes } = body

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Nome, email e senha são obrigatórios.' }, { status: 400 })
  }

  // Cria o usuário do paciente via Admin API
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const patientAuthId = authData.user.id

  // Cria o registro do paciente
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .insert({
      physiotherapist_id: user.id,
      auth_user_id: patientAuthId,
      name,
    })
    .select()
    .single()

  if (patientError) {
    // Rollback: remove usuário criado
    await adminClient.auth.admin.deleteUser(patientAuthId)
    return NextResponse.json({ error: patientError.message }, { status: 400 })
  }

  // Cria o tratamento inicial
  const { error: treatmentError } = await supabase
    .from('treatments')
    .insert({
      patient_id: patient.id,
      surgery_date: surgery_date || null,
      tags: tags ?? [],
      notes: notes || null,
    })

  if (treatmentError) {
    return NextResponse.json({ error: treatmentError.message }, { status: 400 })
  }

  return NextResponse.json({ id: patient.id }, { status: 201 })
}
