'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
}

interface SearchPanelProps {
    userPlan: 'free' | 'pro' | 'ultra'
    initialLicitaciones: Licitacion[]
}

export default function SearchPanel({ userPlan, initialLicitaciones }: SearchPanelProps) {
    const [query, setQuery] = useState('')
    const [tipo, setTipo] = useState('')
    const [licitaciones, setLicitaciones] = useState<Licitacion[]>(initialLicitaciones)
    const [isSearching, setIsSearching] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    // Feature limits based on plan
    const limits = {
        free: { summaries: 3, proposals: 0 },
        pro: { summaries: 20, proposals: 10 },
        ultra: { summaries: Infinity, proposals: Infinity }
    }

    const canUseSummary = userPlan !== 'free'
    const canUseMatchScore = userPlan !== 'free'
    const canUseProposal = userPlan !== 'free'
    const canUseWhatsApp = userPlan === 'ultra'
    const isUnlimited = userPlan === 'ultra'

    const handleSearch = async () => {
        if (!query && !tipo) return

        setIsSearching(true)
        setHasSearched(true)

        try {
            const params = new URLSearchParams()
            if (query) params.set('q', query)
            if (tipo) params.set('tipo', tipo)

            const res = await fetch(`/api/licitaciones/search?${params}`)
            const data = await res.json()
            setLicitaciones(data.licitaciones || [])
        } catch (error) {
            console.error('Error searching:', error)
        } finally {
            setIsSearching(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    // Calculate fake match score for demo
    const getMatchScore = (lic: Licitacion) => {
        const baseScore = 60 + Math.floor(Math.random() * 35)
        return baseScore
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            🔍
                        </span>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Buscar por palabra clave, organismo, CPV..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-slate-800"
                        />
                    </div>
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none text-slate-700 bg-white"
                    >
                        <option value="">Todos los tipos</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Suministros">Suministros</option>
                        <option value="Obras">Obras</option>
                        <option value="Concesión de servicios">Concesión de servicios</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {isSearching ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>

                {/* Quick filters */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <button
                        onClick={() => { setQuery('tecnología'); handleSearch() }}
                        className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                        🖥️ Tecnología
                    </button>
                    <button
                        onClick={() => { setQuery('consultoría'); handleSearch() }}
                        className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                        💼 Consultoría
                    </button>
                    <button
                        onClick={() => { setQuery('construcción'); handleSearch() }}
                        className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                        🏗️ Construcción
                    </button>
                    <button
                        onClick={() => { setQuery('sanidad'); handleSearch() }}
                        className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                        🏥 Sanidad
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            {hasSearched ? 'Resultados de búsqueda' : 'Licitaciones Recientes'}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {licitaciones.length} licitaciones encontradas
                        </p>
                    </div>
                    {userPlan === 'free' && (
                        <Link
                            href="/#pricing"
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                            ⚡ Mejora tu plan para más funciones
                        </Link>
                    )}
                </div>

                {licitaciones.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {licitaciones.map((lic) => {
                            const matchScore = getMatchScore(lic)
                            const isHighMatch = matchScore >= 80

                            return (
                                <div
                                    key={lic.id}
                                    className="p-6 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                                        {/* Main Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-slate-800 mb-1 line-clamp-2">
                                                        {lic.titulo}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 mb-2">
                                                        {lic.organo_contratacion}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md">
                                                            {lic.tipo_contrato}
                                                        </span>
                                                        {lic.cpv && (
                                                            <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md">
                                                                CPV: {lic.cpv.slice(0, 8)}
                                                            </span>
                                                        )}
                                                        {lic.lugar_ejecucion && (
                                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md">
                                                                📍 {lic.lugar_ejecucion}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Financial Info */}
                                        <div className="lg:text-right flex-shrink-0">
                                            <p className="text-xl font-bold text-slate-800">
                                                {lic.presupuesto_base?.toLocaleString('es-ES', {
                                                    style: 'currency',
                                                    currency: 'EUR'
                                                }) || 'A consultar'}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Límite: {new Date(lic.fecha_limite).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>

                                            {/* Match Score - Premium Feature */}
                                            {canUseMatchScore ? (
                                                <div className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${isHighMatch
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    🎯 Match: {matchScore}%
                                                </div>
                                            ) : (
                                                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-500">
                                                    🔒 Match Score
                                                    <span className="text-xs text-orange-600">Pro+</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                                        <Link
                                            href={`/licitacion/${lic.id}`}
                                            className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
                                        >
                                            📄 Ver detalles
                                        </Link>

                                        {canUseSummary ? (
                                            <button className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors font-medium">
                                                🤖 Resumen IA {!isUnlimited && <span className="text-xs opacity-70">(20/mes)</span>}
                                            </button>
                                        ) : (
                                            <button className="px-4 py-2 text-sm bg-slate-50 text-slate-400 rounded-lg cursor-not-allowed flex items-center gap-1">
                                                🔒 Resumen IA
                                                <span className="text-xs text-orange-500 font-medium">Pro+</span>
                                            </button>
                                        )}

                                        {canUseProposal ? (
                                            <button className="px-4 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors font-medium">
                                                ✍️ Borrador {!isUnlimited && <span className="text-xs opacity-70">(10/mes)</span>}
                                            </button>
                                        ) : (
                                            <button className="px-4 py-2 text-sm bg-slate-50 text-slate-400 rounded-lg cursor-not-allowed flex items-center gap-1">
                                                🔒 Borrador propuesta
                                                <span className="text-xs text-orange-500 font-medium">Pro+</span>
                                            </button>
                                        )}

                                        {canUseWhatsApp ? (
                                            <button className="px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors font-medium">
                                                💬 Alertar WhatsApp
                                            </button>
                                        ) : (
                                            <button className="px-4 py-2 text-sm bg-slate-50 text-slate-400 rounded-lg cursor-not-allowed flex items-center gap-1">
                                                🔒 WhatsApp
                                                <span className="text-xs text-purple-500 font-medium">Ultra</span>
                                            </button>
                                        )}

                                        <button className="px-4 py-2 text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors font-medium">
                                            ⭐ Guardar
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">
                            {hasSearched ? 'No hay resultados' : 'Busca tu primera licitación'}
                        </h3>
                        <p className="text-slate-500 mb-6">
                            {hasSearched
                                ? 'Prueba con otros términos o filtros'
                                : 'Usa la barra de búsqueda para encontrar oportunidades'}
                        </p>
                        {!hasSearched && (
                            <div className="flex flex-wrap justify-center gap-2">
                                <button
                                    onClick={() => { setQuery('software'); handleSearch() }}
                                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                                >
                                    Buscar "software"
                                </button>
                                <button
                                    onClick={() => { setQuery('limpieza'); handleSearch() }}
                                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                                >
                                    Buscar "limpieza"
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Upgrade CTA for Free users */}
            {userPlan === 'free' && (
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-bold mb-1">
                                🚀 Desbloquea todo el potencial
                            </h3>
                            <p className="text-white/80">
                                Match Score IA, resúmenes automáticos, borradores de propuesta y más
                            </p>
                        </div>
                        <Link
                            href="/#pricing"
                            className="px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-white/90 transition-colors text-center"
                        >
                            Ver planes desde 29,99€/mes
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
