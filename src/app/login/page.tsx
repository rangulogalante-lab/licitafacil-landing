'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [sent, setSent] = useState(false)
    const supabase = createClient()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            setMessage('Error al enviar el enlace. Inténtalo de nuevo.')
        } else {
            setSent(true)
            setMessage('¡Enlace enviado! Revisa tu bandeja de entrada.')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-orange-500/15 to-red-500/15 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/25">
                            📡
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">LicitaFácil</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                    {!sent ? (
                        <>
                            <h1 className="text-2xl font-bold text-white text-center mb-2">
                                Accede a tu cuenta
                            </h1>
                            <p className="text-gray-400 text-center mb-8">
                                Te enviaremos un enlace mágico al email
                            </p>

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Email corporativo
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@empresa.com"
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Enviando...
                                        </span>
                                    ) : 'Enviar enlace mágico'}
                                </button>
                            </form>

                            {message && message.includes('Error') && (
                                <p className="mt-4 text-center text-sm text-red-400">
                                    {message}
                                </p>
                            )}

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <p className="text-center text-sm text-gray-500">
                                    ¿No tienes cuenta?{' '}
                                    <Link href="/#precios" className="text-orange-400 hover:text-orange-300 font-medium">
                                        Ver planes
                                    </Link>
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">¡Email enviado!</h2>
                            <p className="text-gray-400 mb-6">
                                Hemos enviado un enlace mágico a<br />
                                <span className="text-white font-medium">{email}</span>
                            </p>
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-300">
                                <p>💡 Revisa también tu carpeta de spam si no lo encuentras.</p>
                            </div>
                            <button
                                onClick={() => { setSent(false); setMessage(''); }}
                                className="mt-6 text-sm text-gray-500 hover:text-white transition-colors"
                            >
                                ← Usar otro email
                            </button>
                        </div>
                    )}
                </div>

                {/* Back link */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
                        ← Volver al inicio
                    </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-8 flex justify-center gap-6 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        SSL Seguro
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        RGPD Compliant
                    </span>
                </div>
            </div>
        </div>
    )
}
