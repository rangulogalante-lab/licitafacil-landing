'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const tabs = [
    { id: 'resumen', label: 'Resumen Ejecutivo', icon: 'summarize' },
    { id: 'metodologia', label: 'Metodología Técnica', icon: 'engineering' },
    { id: 'cronograma', label: 'Cronograma', icon: 'calendar_month' },
    { id: 'equipo', label: 'Equipo de Trabajo', icon: 'group' },
]

interface Licitacion {
    titulo: string
    organo_contratacion: string
    presupuesto_base: number
    fecha_limite: string
    tipo_contrato: string
}

export default function DraftEditorPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const draftId = params.id as string
    const licitacionId = searchParams.get('licitacionId')

    const [activeTab, setActiveTab] = useState('resumen')
    const [content, setContent] = useState<Record<string, string>>({ resumen: '', metodologia: '', cronograma: '', equipo: '' })
    const [licitacion, setLicitacion] = useState<Licitacion | null>(null)
    const [saving, setSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<string | null>(null)

    useEffect(() => {
        if (!licitacionId) return
        const supabase = createClient()
        supabase.from('licitaciones').select('titulo, organo_contratacion, presupuesto_base, fecha_limite, tipo_contrato')
            .eq('id', licitacionId).single().then(({ data }) => { if (data) setLicitacion(data) })
    }, [licitacionId])

    useEffect(() => {
        if (draftId === 'new') return
        const supabase = createClient()
        supabase.from('borradores').select('contenido').eq('id', draftId).single()
            .then(({ data }) => { if (data?.contenido) setContent(data.contenido as Record<string, string>) })
    }, [draftId])

    const handleSave = useCallback(async () => {
        setSaving(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setSaving(false); return }

        if (draftId === 'new') {
            await supabase.from('borradores').insert({
                user_id: user.id,
                licitacion_id: licitacionId,
                titulo: licitacion?.titulo ? `Propuesta: ${licitacion.titulo.slice(0, 60)}` : 'Nuevo Borrador',
                contenido: content,
                status: 'borrador',
            })
        } else {
            await supabase.from('borradores').update({ contenido: content, updated_at: new Date().toISOString() }).eq('id', draftId)
        }
        setLastSaved(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
        setSaving(false)
    }, [content, draftId, licitacionId, licitacion])

    // Auto-save every 30s
    useEffect(() => {
        if (draftId === 'new') return
        const timer = setInterval(handleSave, 30000)
        return () => clearInterval(timer)
    }, [draftId, handleSave])

    const formatCurrency = (val: number | null) =>
        val != null ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val) : '-'

    return (
        <div className="flex flex-col xl:flex-row h-full">
            {/* Left Panel — Requirements */}
            <aside className="w-full xl:w-96 border-b xl:border-b-0 xl:border-r border-[#2b3b4c] bg-[#0f1920] p-5 overflow-y-auto shrink-0">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <Link href="/drafts" className="text-[#94a3b8] hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                        </Link>
                        <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">Requisitos de la Licitación</h2>
                    </div>
                </div>

                {licitacion ? (
                    <div className="space-y-4">
                        <div className="bg-[#1a2632] rounded-lg p-4 border border-[#2b3b4c]">
                            <h3 className="text-white font-semibold text-sm mb-3 leading-snug">{licitacion.titulo}</h3>
                            <p className="text-[#94a3b8] text-xs">{licitacion.organo_contratacion}</p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { icon: 'euro', label: 'Presupuesto', value: formatCurrency(licitacion.presupuesto_base) },
                                { icon: 'event_busy', label: 'Fecha Límite', value: licitacion.fecha_limite ? new Date(licitacion.fecha_limite).toLocaleDateString('es-ES') : '-' },
                                { icon: 'category', label: 'Tipo', value: licitacion.tipo_contrato },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <span className="material-symbols-outlined text-[#137fec] text-lg">{item.icon}</span>
                                    <div>
                                        <p className="text-[#64748b] text-xs">{item.label}</p>
                                        <p className="text-white font-medium">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* AI Tip */}
                        <div className="bg-gradient-to-r from-[#137fec]/10 to-[#7c3aed]/10 rounded-lg p-3 border border-[#137fec]/20 mt-4">
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-[#137fec] text-lg">auto_awesome</span>
                                <p className="text-xs text-[#94a3b8]">
                                    <span className="text-[#137fec] font-semibold">Sugerencia IA:</span> Enfoca la propuesta en criterios de precio-calidad. El presupuesto sugiere una PYME con experiencia específica.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <span className="material-symbols-outlined text-4xl text-[#2b3b4c]">description</span>
                        <p className="text-[#94a3b8] text-sm mt-2">Sin licitación vinculada</p>
                    </div>
                )}
            </aside>

            {/* Right Panel — Editor */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#2b3b4c] bg-[#1a2632]">
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? 'bg-[#137fec]/10 text-[#137fec] border border-[#137fec]/30'
                                        : 'text-[#94a3b8] hover:text-white hover:bg-[#0f1920]'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        {lastSaved && (
                            <span className="text-[#64748b] text-xs hidden md:block">Guardado: {lastSaved}</span>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-3 py-1.5 text-xs font-bold bg-[#137fec] hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 p-5 overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h3>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-[#137fec] to-[#7c3aed] text-white rounded-lg hover:opacity-90 transition-opacity">
                                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                Generar con IA
                            </button>
                        </div>
                        <textarea
                            value={content[activeTab] || ''}
                            onChange={(e) => setContent(prev => ({ ...prev, [activeTab]: e.target.value }))}
                            placeholder={`Escribe el contenido de "${tabs.find(t => t.id === activeTab)?.label}" aquí...`}
                            className="w-full h-[calc(100vh-320px)] bg-[#0f1920] border border-[#2b3b4c] rounded-lg p-4 text-white text-sm leading-relaxed resize-none focus:outline-none focus:border-[#137fec]/50 placeholder-[#3f5468]"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
