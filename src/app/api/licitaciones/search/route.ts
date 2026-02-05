import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const tipo = searchParams.get('tipo') || ''
    const limit = parseInt(searchParams.get('limit') || '20')

    const supabase = await createClient()

    // Build query
    let dbQuery = supabase
        .from('licitaciones')
        .select('*')
        .eq('estado', 'abierta')
        .order('fecha_publicacion', { ascending: false })
        .limit(limit)

    // Apply search filter
    if (query) {
        dbQuery = dbQuery.or(`titulo.ilike.%${query}%,organo_contratacion.ilike.%${query}%`)
    }

    // Apply type filter
    if (tipo) {
        dbQuery = dbQuery.eq('tipo_contrato', tipo)
    }

    const { data, error } = await dbQuery

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ licitaciones: data || [] })
}
