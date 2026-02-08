'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Draft {
    id: string
    titulo: string
    status: string
    updated_at: string
    licitacion_id?: string
    licitacion?: { titulo: string; organo_contratacion: string }
}

export default function DraftsListPage() {
    const [drafts, setDrafts] = useState<Draft[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchDrafts() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('borradores')
                .select('*, licitaciones(titulo, organo_contratacion)')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false })

            if (data) {
                setDrafts(data.map((d: Record<string, unknown>) => ({
                    id: d.id as string,
                    titulo: d.titulo as string,
                    status: d.status as string,
                    updated_at: d.updated_at as string,
                    licitacion_id: d.licitacion_id as string,
                    licitacion: d.licitaciones as { titulo: string; organo_contratacion: string },
                })))
            }
            setLoading(false)
        }
        fetchDrafts()
    }, [])

    const statusConfig: Record<string, { icon: string; label: string; class: string }> = {
        borrador: { icon: 'edit_note', label: 'Borrador', class: 'bg-yellow-900/30 text-yellow-400' },
        enviado: { icon: 'send', label: 'Enviado', class: 'bg-emerald-900/30 text-emerald-400' },
        revision: { icon: 'rate_review', label: 'En revisión', class: 'bg-blue-900/30 text-blue-400' },
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#137fec]"></div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mis Borradores</h1>
                    <p className="text-[#94a3b8] text-sm mt-1">{drafts.length} borradores guardados</p>
                </div>
                <Link href="/search"
                    className="px-4 py-2.5 bg-[#137fec] hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Nuevo Borrador
                </Link>
            </div>

            {drafts.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                    <span className="material-symbols-outlined text-6xl text-[#2b3b4c]">edit_note</span>
                    <h2 className="text-xl font-bold text-white">No tienes borradores todavía</h2>
                    <p className="text-[#94a3b8] text-sm">Busca una licitación y genera tu primer borrador de propuesta con IA.</p>
                    <Link href="/search"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#137fec] hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors mt-2">
                        <span className="material-symbols-outlined text-lg">search</span>
                        Buscar Licitaciones
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {drafts.map((draft) => {
                        const status = statusConfig[draft.status] || statusConfig.borrador
                        return (
                            <Link
                                key={draft.id}
                                href={`/drafts/${draft.id}?licitacionId=${draft.licitacion_id || ''}`}
                                className="bg-[#1a2632] rounded-xl border border-[#2b3b4c] p-5 hover:border-[#137fec]/40 transition-all group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold group-hover:text-[#137fec] transition-colors">
                                            {draft.titulo}
                                        </h3>
                                        {draft.licitacion && (
                                            <p className="text-[#94a3b8] text-sm mt-1 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">gavel</span>
                                                {draft.licitacion.titulo}
                                            </p>
                                        )}
                                        <p className="text-[#64748b] text-xs mt-2">
                                            Última edición: {new Date(draft.updated_at).toLocaleDateString('es-ES', {
                                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${status.class}`}>
                                        <span className="material-symbols-outlined text-sm">{status.icon}</span>
                                        {status.label}
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
