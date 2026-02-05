'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [sent, setSent] = useState(false)
    const supabase = createClient()

    // Google OAuth login
    async function handleGoogleLogin() {
        setGoogleLoading(true)
        setMessage('')

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${siteUrl}/auth/callback`,
            },
        })

        if (error) {
            setMessage('Error al conectar con Google. Inténtalo de nuevo.')
            setGoogleLoading(false)
        }
    }

    // Magic Link login (backup)
    async function handleMagicLink(e: React.FormEvent) {
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
                        <span className="text-2xl font-black text-white tracking-tight">LicitaFlash</span>
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
                                Entra en segundos con tu cuenta de Google
                            </p>

                            {/* Google Login Button - Primary */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                                className="w-full h-14 flex items-center justify-center gap-3 bg-white text-gray-800 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {googleLoading ? (
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        Continuar con Google
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-[#0D1321] text-gray-500">o con email</span>
                                </div>
                            </div>

                            {/* Magic Link Form - Secondary */}
                            <form onSubmit={handleMagicLink} className="space-y-4">
                                <div>
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
                                    className="w-full py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

                            {message && (
                                <p className={`mt-4 text-center text-sm ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
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
