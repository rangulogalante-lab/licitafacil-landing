'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()
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
            setMessage('¡Enlace enviado! Revisa tu bandeja de entrada.')
        }
        setLoading(false)
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">
                        Accede a LicitaFácil
                    </h1>
                    <p className="text-slate-600 text-center mb-8">
                        Te enviaremos un enlace mágico por email
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@empresa.com"
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                        >
                            {loading ? 'Enviando...' : 'Enviar enlace mágico'}
                        </button>
                    </form>

                    {message && (
                        <p className={`mt-4 text-center text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}

                    <div className="mt-6 text-center">
                        <a href="/" className="text-sm text-slate-500 hover:text-slate-700">
                            ← Volver al inicio
                        </a>
                    </div>
                </div>
            </div>
        </main>
    )
}
