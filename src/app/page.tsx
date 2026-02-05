'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

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
        setMessage('¡Ya estás en la lista! 🎉')
      } else {
        setMessage('Error. Inténtalo de nuevo.')
      }
    } else {
      setMessage('¡Gracias! Te avisaremos pronto 🚀')
      setEmail('')
    }
    setLoading(false)
  }

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-slate-50/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-[#1E3A5F]">
            <span className="text-3xl">📡</span>
            <h2 className="text-xl font-black tracking-tight">LicitaFácil</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-semibold hover:text-orange-500 transition-colors" href="#problemas">Problemas</a>
            <a className="text-sm font-semibold hover:text-orange-500 transition-colors" href="#solucion">Solución</a>
            <a className="text-sm font-semibold hover:text-orange-500 transition-colors" href="#precios">Precios</a>
          </nav>
          <Link
            href="/login"
            className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-[#1E3A5F] text-white text-sm font-bold transition-all hover:bg-[#1E3A5F]/90"
          >
            Acceder
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#1E3A5F]/10 text-[#1E3A5F] w-fit">
                  Impulsado por IA
                </span>
                <h1 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-[-0.033em]">
                  Gana Licitaciones Sin Volverte Loco
                </h1>
                <p className="text-lg text-slate-500 max-w-[500px]">
                  Simplifica la gestión de licitaciones públicas con nuestra plataforma inteligente. Encuentra, analiza y gestiona oportunidades sin complicaciones.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[500px]">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-lg border-none bg-white shadow-sm focus:ring-2 focus:ring-[#1E3A5F] text-sm font-medium outline-none"
                    placeholder="Introduce tu email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 px-8 bg-orange-500 text-white rounded-lg font-bold text-sm whitespace-nowrap hover:brightness-110 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Quiero Acceso Anticipado'}
                </button>
              </form>

              {message && (
                <p className={`text-sm font-medium ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  <div className="size-8 rounded-full border-2 border-white bg-blue-500" />
                  <div className="size-8 rounded-full border-2 border-white bg-green-500" />
                  <div className="size-8 rounded-full border-2 border-white bg-purple-500" />
                </div>
                <span>+500 empresas esperando el lanzamiento</span>
              </div>
            </div>

            <div className="relative">
              <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-[#1E3A5F] to-[#2c5282] relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 flex flex-col gap-4">
                  <div className="h-4 w-1/3 bg-white/20 rounded" />
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <div className="bg-white/5 rounded-lg border border-white/10" />
                    <div className="bg-white/5 rounded-lg border border-white/10" />
                    <div className="bg-white/5 rounded-lg border border-white/10 col-span-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-24 bg-white" id="problemas">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col gap-4 mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-[#1E3A5F]">¿Te suena esto?</h2>
              <p className="text-slate-500 text-lg">Sabemos lo frustrante y agotador que puede ser el proceso de licitación pública actual.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-2xl border border-slate-200 hover:border-[#1E3A5F]/20 hover:bg-[#1E3A5F]/5 transition-all">
                <div className="size-14 rounded-xl bg-red-100 flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform text-3xl">📄</div>
                <h3 className="text-xl font-bold mb-3">Documentos complejos</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Horas interminables intentando descifrar pliegos técnicos y administrativos imposibles de leer.</p>
              </div>
              <div className="group p-8 rounded-2xl border border-slate-200 hover:border-[#1E3A5F]/20 hover:bg-[#1E3A5F]/5 transition-all">
                <div className="size-14 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform text-3xl">🔔</div>
                <h3 className="text-xl font-bold mb-3">Fechas perdidas</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Alertas de portales oficiales que llegan tarde, se van a spam o simplemente nunca aparecen.</p>
              </div>
              <div className="group p-8 rounded-2xl border border-slate-200 hover:border-[#1E3A5F]/20 hover:bg-[#1E3A5F]/5 transition-all">
                <div className="size-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 mb-6 group-hover:scale-110 transition-transform text-3xl">⏰</div>
                <h3 className="text-xl font-bold mb-3">Tiempo perdido</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Burocracia interminable y búsqueda manual que frena el crecimiento real de tu negocio.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-24" id="solucion">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col gap-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-[#1E3A5F]">LicitaFácil: Tu Radar de Oportunidades</h2>
              <p className="text-slate-500 text-lg max-w-2xl">Nuestra tecnología se encarga del trabajo sucio para que tú te centres exclusivamente en presentar la mejor oferta.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col gap-6 group">
                <div className="aspect-[4/3] w-full bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3A5F]/10 to-transparent" />
                  <span className="text-6xl opacity-40 group-hover:scale-110 transition-transform">🎯</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">El Radar</h3>
                  <p className="text-slate-500 text-sm">IA avanzada que monitoriza miles de fuentes diarias para encontrar la licitación perfecta según el perfil de tu empresa.</p>
                </div>
              </div>
              <div className="flex flex-col gap-6 group">
                <div className="aspect-[4/3] w-full bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent" />
                  <span className="text-6xl opacity-40 group-hover:scale-110 transition-transform">📖</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">El Traductor</h3>
                  <p className="text-slate-500 text-sm">Simplificamos el complejo lenguaje jurídico y técnico a términos claros y acciones concretas para tu equipo.</p>
                </div>
              </div>
              <div className="flex flex-col gap-6 group">
                <div className="aspect-[4/3] w-full bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent" />
                  <span className="text-6xl opacity-40 group-hover:scale-110 transition-transform">✍️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">El Asistente</h3>
                  <p className="text-slate-500 text-sm">Gestión centralizada y automatizada de toda tu documentación, certificados y plazos de entrega.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-[#1E3A5F] text-white overflow-hidden relative" id="precios">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full" />
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4 block">Lanzamiento</span>
              <h2 className="text-4xl font-black mb-4">Precios - Próximamente</h2>
              <p className="text-gray-300">Reserva tu sitio ahora para obtener condiciones especiales de fundador.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Tier */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl flex flex-col">
                <h3 className="text-xl font-bold mb-2">Gratis</h3>
                <div className="text-4xl font-black mb-6">0€<span className="text-sm font-normal text-gray-400"> para siempre</span></div>
                <ul className="flex flex-col gap-4 mb-8 text-sm">
                  <li className="flex items-center gap-2">✅ 1 alerta diaria</li>
                  <li className="flex items-center gap-2">✅ Búsqueda manual básica</li>
                  <li className="flex items-center gap-2">✅ 3 resúmenes IA gratis</li>
                  <li className="flex items-center gap-2 opacity-50">❌ Borradores de propuesta</li>
                </ul>
                <button className="mt-auto w-full py-3 rounded-lg border border-white/30 font-bold hover:bg-white/10 transition-colors">Próximamente</button>
              </div>
              {/* Pro+ Tier */}
              <div className="bg-white text-[#1E3A5F] p-8 rounded-2xl flex flex-col transform md:-translate-y-4 shadow-2xl relative">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-orange-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">Recomendado</div>
                <h3 className="text-xl font-bold mb-2">Pro+</h3>
                <div className="text-4xl font-black mb-6">49€<span className="text-sm font-normal text-gray-500">/mes</span></div>
                <ul className="flex flex-col gap-4 mb-8 text-sm">
                  <li className="flex items-center gap-2">✅ Alertas ilimitadas</li>
                  <li className="flex items-center gap-2">✅ El Radar (IA Selectora)</li>
                  <li className="flex items-center gap-2">✅ Resúmenes IA ilimitados</li>
                  <li className="flex items-center gap-2">✅ Borradores de propuesta</li>
                </ul>
                <button className="mt-auto w-full py-3 rounded-lg bg-orange-500 text-white font-bold hover:brightness-110 shadow-lg shadow-orange-500/20 transition-all">Reserva Early-Bird</button>
              </div>
              {/* Agency Tier */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl flex flex-col">
                <h3 className="text-xl font-bold mb-2">Agencia</h3>
                <div className="text-4xl font-black mb-6">99€<span className="text-sm font-normal text-gray-400">/mes</span></div>
                <ul className="flex flex-col gap-4 mb-8 text-sm">
                  <li className="flex items-center gap-2">✅ Todo de Pro+</li>
                  <li className="flex items-center gap-2">✅ Multi-empresa (hasta 5)</li>
                  <li className="flex items-center gap-2">✅ Dashboard de equipo</li>
                  <li className="flex items-center gap-2">✅ Soporte prioritario</li>
                </ul>
                <button className="mt-auto w-full py-3 rounded-lg border border-white/30 font-bold hover:bg-white/10 transition-colors">Contactar</button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="bg-[#1E3A5F]/5 rounded-[2.5rem] p-12 md:p-20 text-center border border-[#1E3A5F]/10">
              <h2 className="text-3xl md:text-5xl font-black text-[#1E3A5F] mb-6">¿Preparado para ganar más?</h2>
              <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">Únete a la lista de espera hoy y recibe un 50% de descuento de por vida cuando lancemos oficialmente.</p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[550px] mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-14 px-6 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-[#1E3A5F] text-sm font-medium outline-none"
                  placeholder="Tu correo electrónico profesional"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 px-10 bg-orange-500 text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {loading ? '...' : 'Apuntarme'}
                </button>
              </form>
              <p className="mt-6 text-xs text-gray-400">No enviamos spam. Solo noticias importantes sobre el lanzamiento.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-[#1E3A5F] opacity-70">
            <span className="text-2xl">📡</span>
            <h2 className="text-lg font-black tracking-tight">LicitaFácil</h2>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a className="hover:text-[#1E3A5F] transition-colors" href="#">Privacidad</a>
            <a className="hover:text-[#1E3A5F] transition-colors" href="#">Términos</a>
            <a className="hover:text-[#1E3A5F] transition-colors" href="#">Contacto</a>
          </div>
          <div className="text-sm text-gray-400">
            © 2024 LicitaFácil AI. Hecho con ❤️ para licitadores.
          </div>
        </div>
      </footer>
    </div>
  )
}
