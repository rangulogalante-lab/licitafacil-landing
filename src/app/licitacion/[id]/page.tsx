'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Licitacion {
    id: string
    titulo: string
    organo_contratacion: string
    tipo_contrato: string
    presupuesto_base: number
    fecha_limite: string
    fecha_publicacion: string
    estado: string
    cpv?: string
    lugar_ejecucion?: string
    enlace_licitacion?: string
    resumen_ia?: string
}

export default function LicitacionDetailPage() {
    const params = useParams()
    const id = params.id as string
    const [licitacion, setLicitacion] = useState<Licitacion | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLicitacion() {
            const supabase = createClient()
            const { data } = await supabase
                .from('licitaciones')
                .select('*')
                .eq('id', id)
                .single()
            setLicitacion(data)
            setLoading(false)
        }
        fetchLicitacion()
    }, [id])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#137fec]"></div>
            </div>
        )
    }

    if (!licitacion) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <span className="material-symbols-outlined text-6xl text-[#2b3b4c] mb-4">search_off</span>
                <h2 className="text-xl font-bold text-white mb-2">Licitación no encontrada</h2>
                <Link href="/search" className="text-[#137fec] hover:underline">Volver a buscar</Link>
            </div>
        )
    }

    // Parse AI summary
    let aiSummary: { resumen_ejecutivo?: string; solvencia_tecnica?: string; criterios_evaluacion?: { nombre: string; peso: number }[]; recomendacion?: string } | null = null
    try {
        if (licitacion.resumen_ia) {
            aiSummary = JSON.parse(licitacion.resumen_ia)
        }
    } catch {
        aiSummary = null
    }

    const formatCurrency = (val: number | null) =>
        val != null ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val) : 'No especificado'

    const formatDate = (d: string | null) =>
        d ? new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No especificado'

    const statusColors: Record<string, string> = {
        abierta: 'bg-emerald-900/30 text-emerald-400',
        cerrada: 'bg-red-900/30 text-red-400',
        adjudicada: 'bg-amber-900/30 text-amber-400',
    }

    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/search" className="text-[#94a3b8] hover:text-white transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[licitacion.estado] || 'bg-gray-700 text-gray-300'}`}>
                            {licitacion.estado}
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">{licitacion.titulo}</h1>
                    <p className="text-[#94a3b8] mt-1 text-sm">{licitacion.organo_contratacion}</p>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column — Metadata */}
                <div className="xl:col-span-1 space-y-4">
                    <div className="bg-[#1a2632] rounded-xl border border-[#2b3b4c] p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">Datos del Expediente</h3>
                        <div className="space-y-3">
                            {[
                                { icon: 'business', label: 'Organismo', value: licitacion.organo_contratacion },
                                { icon: 'euro', label: 'Presupuesto Base', value: formatCurrency(licitacion.presupuesto_base) },
                                { icon: 'category', label: 'Tipo de Contrato', value: licitacion.tipo_contrato },
                                { icon: 'calendar_today', label: 'Publicación', value: formatDate(licitacion.fecha_publicacion) },
                                { icon: 'event_busy', label: 'Fecha Límite', value: formatDate(licitacion.fecha_limite) },
                                { icon: 'location_on', label: 'Lugar de Ejecución', value: licitacion.lugar_ejecucion || 'No especificado' },
                                { icon: 'tag', label: 'CPV', value: licitacion.cpv || 'No especificado' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#137fec] text-lg mt-0.5">{item.icon}</span>
                                    <div>
                                        <p className="text-xs text-[#94a3b8]">{item.label}</p>
                                        <p className="text-sm text-white font-medium">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[#1a2632] rounded-xl border border-[#2b3b4c] p-5 space-y-3">
                        <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">Acciones Rápidas</h3>
                        {licitacion.enlace_licitacion && (
                            <a href={licitacion.enlace_licitacion} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-3 w-full p-3 rounded-lg bg-[#0f1920] hover:bg-[#1e3045] transition-colors border border-[#2b3b4c]">
                                <span className="material-symbols-outlined text-[#137fec]">open_in_new</span>
                                <span className="text-sm text-white">Ver en PLACE</span>
                            </a>
                        )}
                        <Link href={`/drafts/new?licitacionId=${licitacion.id}`}
                            className="flex items-center gap-3 w-full p-3 rounded-lg bg-[#137fec]/10 hover:bg-[#137fec]/20 transition-colors border border-[#137fec]/30">
                            <span className="material-symbols-outlined text-[#137fec]">edit_note</span>
                            <span className="text-sm text-[#137fec] font-medium">Generar Borrador de Propuesta</span>
                        </Link>
                    </div>
                </div>

                {/* Right Column — AI Summary */}
                <div className="xl:col-span-2">
                    <div className="bg-[#1a2632] rounded-xl border border-[#2b3b4c] p-6 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-[#137fec] to-[#7c3aed] p-2 rounded-lg">
                                <span className="material-symbols-outlined text-white text-xl">auto_awesome</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Análisis y Resumen IA</h2>
                                <p className="text-xs text-[#94a3b8]">Generado por LicitaFlash AI</p>
                            </div>
                        </div>

                        {aiSummary ? (
                            <div className="space-y-5">
                                {/* Resumen Ejecutivo */}
                                {aiSummary.resumen_ejecutivo && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-[#e2e8f0] flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#137fec] text-lg">summarize</span>
                                            Resumen Ejecutivo
                                        </h4>
                                        <p className="text-sm text-[#94a3b8] leading-relaxed pl-7">{aiSummary.resumen_ejecutivo}</p>
                                    </div>
                                )}

                                {/* Solvencia Técnica */}
                                {aiSummary.solvencia_tecnica && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-[#e2e8f0] flex items-center gap-2">
                                            <span className="material-symbols-outlined text-emerald-400 text-lg">verified</span>
                                            Solvencia Técnica
                                        </h4>
                                        <p className="text-sm text-[#94a3b8] leading-relaxed pl-7">{aiSummary.solvencia_tecnica}</p>
                                    </div>
                                )}

                                {/* Criterios de Evaluación */}
                                {aiSummary.criterios_evaluacion && aiSummary.criterios_evaluacion.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-[#e2e8f0] flex items-center gap-2">
                                            <span className="material-symbols-outlined text-amber-400 text-lg">analytics</span>
                                            Criterios de Evaluación
                                        </h4>
                                        <div className="pl-7 space-y-2.5">
                                            {aiSummary.criterios_evaluacion.map((c, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-[#e2e8f0]">{c.nombre}</span>
                                                        <span className="text-[#94a3b8]">{c.peso}%</span>
                                                    </div>
                                                    <div className="w-full bg-[#0f1920] rounded-full h-2">
                                                        <div className="h-2 rounded-full bg-gradient-to-r from-[#137fec] to-[#7c3aed]" style={{ width: `${c.peso}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recomendación */}
                                {aiSummary.recomendacion && (
                                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-emerald-900/20 to-emerald-900/5 border border-emerald-700/30">
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-emerald-400">thumb_up</span>
                                            <div>
                                                <h4 className="text-sm font-semibold text-emerald-400">Recomendación</h4>
                                                <p className="text-sm text-[#94a3b8] mt-1">{aiSummary.recomendacion}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-10 space-y-3">
                                <span className="material-symbols-outlined text-5xl text-[#2b3b4c]">psychology</span>
                                <p className="text-[#94a3b8] text-sm">El resumen IA aún no se ha generado para esta licitación.</p>
                                <button className="px-5 py-2.5 bg-[#137fec] hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors">
                                    Generar Análisis IA
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Generate Proposal CTA */}
                    <div className="mt-4 bg-gradient-to-r from-[#137fec]/10 to-[#7c3aed]/10 rounded-xl border border-[#137fec]/20 p-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#137fec] text-3xl">rocket_launch</span>
                            <div>
                                <h3 className="text-white font-bold">¿Listo para preparar tu propuesta?</h3>
                                <p className="text-[#94a3b8] text-sm">Usa la IA para generar un borrador en minutos.</p>
                            </div>
                        </div>
                        <Link href={`/drafts/new?licitacionId=${licitacion.id}`}
                            className="px-5 py-2.5 bg-[#137fec] hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap">
                            Generar Borrador
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
