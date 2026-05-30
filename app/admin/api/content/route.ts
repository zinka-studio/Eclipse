import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET() {
  const supabase = adminClient()
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('section')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const supabase = adminClient()
  const { section, key, value } = await req.json()
  const { data, error } = await supabase
    .from('site_content')
    .upsert({ section, key, value, updated_at: new Date().toISOString() }, { onConflict: 'section,key' })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
