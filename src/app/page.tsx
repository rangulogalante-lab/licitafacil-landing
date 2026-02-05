'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 37, seconds: 0 })

  const supabase = createClient()

  // Countdown timer for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        if (days < 0) { days = 0; hours = 0; minutes = 0; seconds = 0 }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const params = new URLSearchParams(window.location.search)
    const { error } = await supabase.from('waitlist').insert({
      email,
      source: 'landing',
      metadata: {
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
        referrer: document.referrer
      }
    })

    if (error) {
      if (error.code === '23505') {
        setMessage('¡Ya estás en la lista! Te avisaremos pronto. 🎉')
      } else {
        setMessage('Error. Inténtalo de nuevo.')
      }
    } else {
      setMessage('¡Bienvenido! Revisa tu email para confirmar. 🚀')
      setEmail('')
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#0A0F1C] text-white min-h-screen overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/15 to-pink-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      </div>

      {/* Urgency Banner - Sticky */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white py-2 px-4 text-center relative z-50 animate-pulse">
        <p className="text-sm font-bold tracking-wide">
          🔥 OFERTA DE LANZAMIENTO: <span className="underline">50% OFF de por vida</span> — Termina en{' '}
          <span className="font-mono bg-black/20 px-2 py-0.5 rounded mx-1">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
        </p>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0A0F1C]/80 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/25">
              📡
            </div>
            <h2 className="text-xl font-black tracking-tight">LicitaFácil</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#problema">El Problema</a>
            <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#solucion">La Solución</a>
            <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#precios">Precios</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:flex items-center justify-center rounded-lg h-10 px-5 bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-all"
            >
              Acceder
            </Link>
            <a
              href="#precios"
              className="flex items-center justify-center rounded-lg h-10 px-5 bg-gradient-to-r from-orange-500 to-red-500 text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-orange-500/25"
            >
              Empezar Gratis
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 md:pt-28 md:pb-40">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              {/* Social Proof Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
                <div className="flex -space-x-2">
                  <div className="size-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-[#0A0F1C] flex items-center justify-center text-xs">JL</div>
                  <div className="size-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-[#0A0F1C] flex items-center justify-center text-xs">MC</div>
                  <div className="size-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-[#0A0F1C] flex items-center justify-center text-xs">AR</div>
                </div>
                <span className="text-sm text-gray-400">
                  <span className="text-white font-semibold">+847 empresas</span> ya están ganando más
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-[-0.03em] mb-6">
                Deja de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">perder</span> licitaciones
                <br />por falta de tiempo
              </h1>

              <p className="text-xl text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
                La IA que encuentra, analiza y resume pliegos de licitación por ti.
                <span className="text-white font-medium"> Ahorra 20+ horas semanales</span> y multiplica tus oportunidades de ganar.
              </p>

              {/* CTA Form */}
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 px-5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-white placeholder-gray-500 text-base outline-none transition-all"
                    placeholder="tu@empresa.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 px-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-base whitespace-nowrap hover:brightness-110 shadow-xl shadow-orange-500/30 transition-all disabled:opacity-50 group"
                >
                  {loading ? 'Enviando...' : (
                    <>
                      Probar Gratis
                      <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </button>
              </form>

              {message && (
                <p className={`text-sm font-medium mb-6 ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                  {message}
                </p>
              )}

              {/* Trust Signals */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Sin tarjeta requerida
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Cancelar cuando quieras
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Setup en 2 minutos
                </span>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="mt-20 relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent z-10" />
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-1 shadow-2xl">
                <div className="rounded-xl bg-[#0D1321] overflow-hidden">
                  {/* Mock Dashboard */}
                  <div className="h-8 bg-[#0A0F1C] flex items-center gap-2 px-4 border-b border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 text-center text-xs text-gray-500">LicitaFácil Dashboard</div>
                  </div>
                  <div className="p-6 grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium">Nueva licitación detectada</span>
                          </div>
                          <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-1 rounded">Match 94%</span>
                        </div>
                        <p className="text-sm text-gray-400">Servicios TI - Ayuntamiento Madrid</p>
                        <p className="text-xs text-gray-500 mt-1">Presupuesto: €450,000 • Plazo: 15 días</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/5 opacity-60">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Resumen IA generado</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-white/10 rounded w-full" />
                          <div className="h-2 bg-white/10 rounded w-4/5" />
                          <div className="h-2 bg-white/10 rounded w-3/4" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-lg p-4 border border-green-500/20">
                        <p className="text-3xl font-black text-green-400">+23</p>
                        <p className="text-xs text-gray-400">Oportunidades este mes</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                        <p className="text-3xl font-black">4.2M€</p>
                        <p className="text-xs text-gray-400">Valor acumulado</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section - Pain Points */}
        <section className="py-24 relative" id="problema">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
                El Problema
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                ¿Cuánto dinero estás dejando <span className="text-red-400">escapar</span>?
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Las empresas que no automatizan su búsqueda de licitaciones pierden el 78% de las oportunidades relevantes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group relative p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-red-500/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative">
                  <div className="size-14 rounded-xl bg-red-500/10 flex items-center justify-center text-2xl mb-6">
                    ⏱️
                  </div>
                  <h3 className="text-xl font-bold mb-3">20+ horas semanales</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Buscando manualmente en portales, leyendo pliegos interminables, filtrando oportunidades irrelevantes.
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-red-400 text-sm font-semibold">= €2,400/mes en tiempo perdido</p>
                  </div>
                </div>
              </div>

              <div className="group relative p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-orange-500/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative">
                  <div className="size-14 rounded-xl bg-orange-500/10 flex items-center justify-center text-2xl mb-6">
                    🎯
                  </div>
                  <h3 className="text-xl font-bold mb-3">78% de oportunidades perdidas</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Las licitaciones ideales para ti pasan desapercibidas porque están en portales que no revisas.
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-orange-400 text-sm font-semibold">= Millones de € en contratos perdidos</p>
                  </div>
                </div>
              </div>

              <div className="group relative p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-yellow-500/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative">
                  <div className="size-14 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl mb-6">
                    📄
                  </div>
                  <h3 className="text-xl font-bold mb-3">Pliegos de 200+ páginas</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Lenguaje jurídico indescifrable. Requisitos escondidos. Fechas críticas enterradas en el texto.
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-yellow-400 text-sm font-semibold">= Descalificaciones evitables</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-24 relative" id="solucion">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-green-500/10 text-green-400 border border-green-500/20 mb-4">
                La Solución
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Tu departamento de licitaciones con <span className="text-green-400">superpoderes</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Inteligencia artificial trabajando 24/7 para ti. Encuentra, analiza, resume, y te alerta de las mejores oportunidades.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 p-8 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl mb-6">
                    🎯
                  </div>
                  <h3 className="text-xl font-bold mb-3">Radar IA</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Monitoriza +15,000 fuentes diarias. Detecta licitaciones relevantes para tu perfil antes que nadie.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="text-blue-400">✓</span> PLACE, BOE, DOUE
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="text-blue-400">✓</span> Comunidades y ayuntamientos
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="text-blue-400">✓</span> Alertas en tiempo real
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 p-8 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xl mb-6">
                    📖
                  </div>
                  <h3 className="text-xl font-bold mb-3">Traductor de Pliegos</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Convierte 200 páginas de jerga legal en un resumen ejecutivo de 2 minutos.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="text-orange-400">✓</span> Requisitos clave extraídos
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="text-orange-400">✓</span> Criterios de evaluación
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="text-orange-400">✓</span> Fechas importantes
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 p-8 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xl mb-6">
                    📊
                  </div>
                  <h3 className="text-xl font-bold mb-3">Match Score</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Puntuación de compatibilidad entre tu empresa y cada licitación. Sin perder tiempo en oportunidades inadecuadas.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="text-green-400">✓</span> Perfil de empresa personalizado
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="text-green-400">✓</span> Histórico de adjudicaciones
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="text-green-400">✓</span> Predicción de éxito
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20 border-y border-white/5 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">847+</p>
                <p className="text-gray-400 text-sm mt-2">Empresas activas</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">€142M</p>
                <p className="text-gray-400 text-sm mt-2">En contratos ganados</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">23h</p>
                <p className="text-gray-400 text-sm mt-2">Ahorro semanal medio</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">94%</p>
                <p className="text-gray-400 text-sm mt-2">Tasa de satisfacción</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black">Lo que dicen nuestros clientes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-6 italic">
                  "Antes dedicábamos 2 días a la semana solo a buscar licitaciones. Ahora encontramos mejores oportunidades en 10 minutos."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold">JL</div>
                  <div>
                    <p className="font-semibold text-sm">José Luis Martínez</p>
                    <p className="text-xs text-gray-500">CEO, TechSolutions SL</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-6 italic">
                  "El resumen automático de pliegos es increíble. Entiendo en 5 minutos lo que antes me costaba horas de lectura."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-bold">MC</div>
                  <div>
                    <p className="font-semibold text-sm">María Carmen López</p>
                    <p className="text-xs text-gray-500">Directora, Construcciones León</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-6 italic">
                  "Hemos ganado 3 contratos en 2 meses que nunca habríamos encontrado sin LicitaFácil. ROI brutal."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center font-bold">AR</div>
                  <div>
                    <p className="font-semibold text-sm">Antonio Ruiz</p>
                    <p className="text-xs text-gray-500">Gerente, Servicios Integrales SA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 relative overflow-hidden" id="precios">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-4">
                🎉 Oferta de Lanzamiento
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Empieza a ganar <span className="text-orange-400">hoy</span>
              </h2>
              <p className="text-gray-400 text-lg">
                50% de descuento de por vida para los primeros 100 usuarios.{' '}
                <span className="text-orange-400 font-semibold">Quedan 23 plazas.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Free */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col">
                <h3 className="text-xl font-bold mb-1">Gratis</h3>
                <p className="text-gray-500 text-sm mb-6">Para explorar</p>
                <div className="text-4xl font-black mb-6">
                  0€
                  <span className="text-base font-normal text-gray-500">/mes</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="text-gray-300">3 alertas diarias</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="text-gray-300">Búsqueda manual básica</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="text-gray-300">5 resúmenes IA/mes</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-500">
                    <span className="mt-0.5">✕</span>
                    <span>Match Score personalizado</span>
                  </li>
                </ul>
                <Link
                  href="/login"
                  className="w-full py-3 rounded-xl border border-white/20 text-center font-semibold hover:bg-white/5 transition-colors"
                >
                  Empezar Gratis
                </Link>
              </div>

              {/* Starter */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col">
                <h3 className="text-xl font-bold mb-1">Starter</h3>
                <p className="text-gray-500 text-sm mb-6">Para autónomos</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-lg text-gray-500 line-through">19,90€</span>
                  <span className="text-4xl font-black text-white">9,90€</span>
                  <span className="text-base font-normal text-gray-500">/mes</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="text-gray-300">Alertas ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="text-gray-300">Resúmenes IA ilimitados</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="text-gray-300">Filtros avanzados</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="text-gray-300">Soporte por email</span>
                  </li>
                </ul>
                <a
                  href="https://buy.stripe.com/6oU00kc0B9q704Jce79AA01"
                  className="w-full py-3 rounded-xl border border-white/20 text-center font-semibold hover:bg-white/5 transition-colors"
                >
                  Suscribirse
                </a>
              </div>

              {/* PRO - Featured */}
              <div className="relative rounded-2xl border-2 border-orange-500/50 bg-gradient-to-b from-orange-500/10 to-transparent p-8 flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold uppercase tracking-wider">
                  Más Popular
                </div>
                <h3 className="text-xl font-bold mb-1">PRO</h3>
                <p className="text-gray-500 text-sm mb-6">Para equipos ganadores</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-lg text-gray-500 line-through">58€</span>
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">29€</span>
                  <span className="text-base font-normal text-gray-500">/mes</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-orange-400 mt-0.5">✓</span>
                    <span className="text-white font-medium">Todo de Starter +</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-orange-400 mt-0.5">✓</span>
                    <span className="text-gray-300">Match Score con IA</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-orange-400 mt-0.5">✓</span>
                    <span className="text-gray-300">Borradores de propuesta</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-orange-400 mt-0.5">✓</span>
                    <span className="text-gray-300">Análisis de competencia</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-orange-400 mt-0.5">✓</span>
                    <span className="text-gray-300">Soporte prioritario</span>
                  </li>
                </ul>
                <a
                  href="https://buy.stripe.com/9B6aEY5Cd0TB9Fjfqj9AA00"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-center font-bold hover:brightness-110 transition-all shadow-lg shadow-orange-500/25"
                >
                  Suscribirse a PRO
                </a>
              </div>
            </div>

            {/* Money back guarantee */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                <span className="text-2xl">🛡️</span>
                <p className="text-sm">
                  <span className="font-semibold text-white">Garantía de 30 días.</span>
                  <span className="text-gray-400 ml-1">Si no ves resultados, te devolvemos el dinero.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10" />
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                ¿Listo para ganar más licitaciones?
              </h2>
              <p className="text-xl text-gray-400 mb-10">
                Únete a las +847 empresas que ya usan LicitaFácil para encontrar y ganar contratos públicos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#precios"
                  className="inline-flex items-center justify-center h-14 px-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-lg hover:brightness-110 transition-all shadow-xl shadow-orange-500/25"
                >
                  Empezar Gratis Ahora
                </a>
                <a
                  href="#solucion"
                  className="inline-flex items-center justify-center h-14 px-10 border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/5 transition-colors"
                >
                  Ver cómo funciona
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#060912]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
                📡
              </div>
              <span className="font-bold">LicitaFácil</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a className="hover:text-white transition-colors" href="#">Privacidad</a>
              <a className="hover:text-white transition-colors" href="#">Términos</a>
              <a className="hover:text-white transition-colors" href="#">Contacto</a>
            </div>
            <div className="text-sm text-gray-600">
              © 2025 LicitaFácil. Hecho en España 🇪🇸
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
