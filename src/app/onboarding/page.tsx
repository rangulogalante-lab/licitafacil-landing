'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const SECTORS = [
    { id: 'construccion', label: '🏗️ Construcción y Obras' },
    { id: 'it', label: '💻 Tecnología e IT' },
    { id: 'limpieza', label: '🧹 Limpieza y Mantenimiento' },
    { id: 'seguridad', label: '🛡️ Seguridad' },
    { id: 'consultoria', label: '📊 Consultoría' },
    { id: 'formacion', label: '📚 Formación' },
    { id: 'sanidad', label: '🏥 Sanidad' },
    { id: 'transporte', label: '🚚 Transporte y Logística' },
]

const UBICACIONES = [
    'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza',
    'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao',
    'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón'
]

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [selectedSectors, setSelectedSectors] = useState<string[]>([])
    const [selectedUbicaciones, setSelectedUbicaciones] = useState<string[]>([])
    const [keywords, setKeywords] = useState('')
    const [presupuestoMin, setPresupuestoMin] = useState('')
    const [presupuestoMax, setPresupuestoMax] = useState('')
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    const toggleSector = (sector: string) => {
        setSelectedSectors(prev =>
            prev.includes(sector)
                ? prev.filter(s => s !== sector)
                : [...prev, sector]
        )
    }

    const toggleUbicacion = (ubi: string) => {
        setSelectedUbicaciones(prev =>
            prev.includes(ubi)
                ? prev.filter(u => u !== ubi)
                : [...prev, ubi]
        )
    }

    async function handleSubmit() {
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        const { error } = await supabase
            .from('user_profiles')
            .upsert({
                id: user.id,
                sector: selectedSectors,
                ubicaciones: selectedUbicaciones,
                keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
                presupuesto_min: presupuestoMin ? parseInt(presupuestoMin) : 0,
                presupuesto_max: presupuestoMax ? parseInt(presupuestoMax) : 999999999,
                onboarding_completed: true,
            })

        if (error) {
            console.error('Error saving profile:', error)
        } else {
            router.push('/dashboard')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
                {/* Progress */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-slate-200'}`}
                        />
                    ))}
                </div>

                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            ¿En qué sectores trabajas?
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Selecciona los sectores donde buscas licitaciones
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {SECTORS.map((sector) => (
                                <button
                                    key={sector.id}
                                    onClick={() => toggleSector(sector.id)}
                                    className={`p-4 rounded-lg border-2 text-left transition-colors ${selectedSectors.includes(sector.id)
                                            ? 'border-blue-600 bg-blue-50 text-blue-800'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {sector.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            disabled={selectedSectors.length === 0}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors"
                        >
                            Continuar
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            ¿Dónde operas?
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Selecciona las provincias donde puedes ejecutar contratos
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {UBICACIONES.map((ubi) => (
                                <button
                                    key={ubi}
                                    onClick={() => toggleUbicacion(ubi)}
                                    className={`px-4 py-2 rounded-full border transition-colors ${selectedUbicaciones.includes(ubi)
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-slate-300 hover:border-blue-400'
                                        }`}
                                >
                                    {ubi}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                            >
                                Atrás
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            Afina tu radar
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Configura filtros adicionales para recibir solo lo relevante
                        </p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Palabras clave (separadas por coma)
                                </label>
                                <input
                                    type="text"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    placeholder="instalación eléctrica, mantenimiento, software..."
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Presupuesto mínimo (€)
                                    </label>
                                    <input
                                        type="number"
                                        value={presupuestoMin}
                                        onChange={(e) => setPresupuestoMin(e.target.value)}
                                        placeholder="0"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Presupuesto máximo (€)
                                    </label>
                                    <input
                                        type="number"
                                        value={presupuestoMax}
                                        onChange={(e) => setPresupuestoMax(e.target.value)}
                                        placeholder="Sin límite"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                            >
                                Atrás
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold rounded-lg"
                            >
                                {loading ? 'Guardando...' : '¡Empezar a recibir alertas!'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
