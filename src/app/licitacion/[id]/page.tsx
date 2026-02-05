import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

interface LicitacionPageProps {
    params: Promise<{ id: string }>
}

export default async function LicitacionPage({ params }: LicitacionPageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get licitación with optional resumen
    const { data: licitacion, error } = await supabase
        .from('licitaciones')
        .select(`
      *,
      resumen:resumenes(*)
    `)
        .eq('id', id)
        .single()

    if (error || !licitacion) {
        notFound()
    }

    const resumen = licitacion.resumen?.[0]?.resumen_json

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                        ← Volver al dashboard
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title & Status */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <h1 className="text-2xl font-bold text-slate-800">
                                    {licitacion.titulo}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${licitacion.estado === 'abierta'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {licitacion.estado}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500">Organismo:</span>
                                    <p className="font-medium text-slate-800">{licitacion.organo_contratacion || 'No especificado'}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Tipo:</span>
                                    <p className="font-medium text-slate-800">{licitacion.tipo_contrato || 'No especificado'}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Expediente:</span>
                                    <p className="font-medium text-slate-800">{licitacion.expediente}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Procedimiento:</span>
                                    <p className="font-medium text-slate-800">{licitacion.procedimiento || 'No especificado'}</p>
                                </div>
                            </div>
                        </div>

                        {/* AI Summary */}
                        {resumen ? (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-2xl">🤖</span>
                                    <h2 className="text-lg font-semibold text-slate-800">Resumen IA</h2>
                                </div>

                                <div className="space-y-4">
                                    {resumen.objeto && (
                                        <div>
                                            <h3 className="font-medium text-slate-700 mb-1">Objeto del Contrato</h3>
                                            <p className="text-slate-600">{resumen.objeto}</p>
                                        </div>
                                    )}

                                    {resumen.requisitos && resumen.requisitos.length > 0 && (
                                        <div>
                                            <h3 className="font-medium text-slate-700 mb-1">Requisitos Clave</h3>
                                            <ul className="list-disc list-inside text-slate-600 space-y-1">
                                                {resumen.requisitos.map((req: string, i: number) => (
                                                    <li key={i}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {resumen.criterios && resumen.criterios.length > 0 && (
                                        <div>
                                            <h3 className="font-medium text-slate-700 mb-2">Criterios de Adjudicación</h3>
                                            <div className="space-y-2">
                                                {resumen.criterios.map((c: { nombre: string, peso: number }, i: number) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div className="flex-1 bg-white rounded-full h-4 overflow-hidden">
                                                            <div
                                                                className="bg-blue-500 h-full rounded-full"
                                                                style={{ width: `${c.peso}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-slate-600 w-32">{c.nombre}</span>
                                                        <span className="text-sm font-medium text-slate-800">{c.peso}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {resumen.recomendacion && (
                                        <div className={`p-4 rounded-lg ${resumen.recomendacion.includes('Alta') ? 'bg-green-100 text-green-800' :
                                                resumen.recomendacion.includes('Media') ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            <span className="font-medium">Recomendación:</span> {resumen.recomendacion}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center">
                                <div className="text-4xl mb-4">📄</div>
                                <h3 className="text-lg font-medium text-slate-800 mb-2">
                                    Resumen IA no disponible
                                </h3>
                                <p className="text-slate-500 mb-4">
                                    Estamos procesando el pliego. El resumen estará disponible pronto.
                                </p>
                                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Generar resumen ahora (Pro+)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Key Info */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">Información Clave</h2>

                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-600">Presupuesto Base</p>
                                    <p className="text-2xl font-bold text-green-700">
                                        {licitacion.presupuesto_base?.toLocaleString('es-ES') || '—'}€
                                    </p>
                                </div>

                                <div className="p-4 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-600">Fecha Límite</p>
                                    <p className="text-xl font-bold text-orange-700">
                                        {licitacion.fecha_limite
                                            ? new Date(licitacion.fecha_limite).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })
                                            : 'No especificada'
                                        }
                                    </p>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600">Ubicación</p>
                                    <p className="text-lg font-medium text-blue-700">
                                        {licitacion.ubicacion || 'No especificada'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">Acciones</h2>

                            <div className="space-y-3">
                                {licitacion.url_publicacion && (
                                    <a
                                        href={licitacion.url_publicacion}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-3 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                                    >
                                        Ver en PLACE ↗
                                    </a>
                                )}

                                {licitacion.url_pliego && (
                                    <a
                                        href={licitacion.url_pliego}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-3 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Descargar Pliego ↗
                                    </a>
                                )}

                                <button className="w-full py-3 text-center bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
                                    ✨ Generar Borrador (Pro+)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
