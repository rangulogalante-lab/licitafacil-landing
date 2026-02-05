import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SearchPanel from '@/components/SearchPanel'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user's subscription status (mock for now - would come from profiles table)
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_plan')
        .eq('id', user.id)
        .single()

    // Determine user plan
    let userPlan: 'free' | 'pro' | 'ultra' = 'free'
    if (profile?.subscription_status === 'active') {
        if (profile.subscription_plan === 'ultra') {
            userPlan = 'ultra'
        } else if (profile.subscription_plan === 'pro' || profile.subscription_plan === 'pro+') {
            userPlan = 'pro'
        }
    }

    // Get user's alertas count
    const { count: alertasCount } = await supabase
        .from('alertas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    // Get recent licitaciones
    const { data: licitaciones } = await supabase
        .from('licitaciones')
        .select('*')
        .eq('estado', 'abierta')
        .order('fecha_publicacion', { ascending: false })
        .limit(10)

    // Get total active licitaciones count
    const { count: totalLicitaciones } = await supabase
        .from('licitaciones')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'abierta')

    const planLabels = {
        free: 'Free',
        pro: 'Pro+',
        ultra: 'Ultra'
    }

    const planColors = {
        free: 'text-slate-600',
        pro: 'text-orange-500',
        ultra: 'text-purple-500'
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">⚡</span>
                        <h1 className="text-xl font-bold text-slate-800">LicitaFlash</h1>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${userPlan === 'free'
                            ? 'bg-slate-100 text-slate-600'
                            : userPlan === 'ultra'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                            {planLabels[userPlan]}
                        </span>
                        <span className="text-sm text-slate-600 hidden md:block">{user.email}</span>
                        <Link href="/settings" className="text-sm text-blue-600 hover:text-blue-700">
                            ⚙️
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button className="text-sm text-slate-500 hover:text-slate-700">
                                Salir
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Welcome Banner */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        ¡Hola! 👋
                    </h2>
                    <p className="text-slate-600">
                        Encuentra las mejores licitaciones para tu negocio
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-500 mb-1">Licitaciones Activas</p>
                        <p className="text-2xl font-bold text-slate-800">{totalLicitaciones?.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-500 mb-1">Tus Alertas</p>
                        <p className="text-2xl font-bold text-blue-600">{alertasCount || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-500 mb-1">Resúmenes IA</p>
                        <p className="text-2xl font-bold text-green-600">
                            {userPlan === 'free' ? '3/mes' : '∞'}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-500 mb-1">Tu Plan</p>
                        <p className={`text-2xl font-bold ${planColors[userPlan]}`}>
                            {planLabels[userPlan]}
                        </p>
                        {userPlan === 'free' && (
                            <Link href="/#pricing" className="text-xs text-orange-600 hover:underline">
                                Mejorar →
                            </Link>
                        )}
                    </div>
                </div>

                {/* Search Panel */}
                <SearchPanel
                    userPlan={userPlan}
                    initialLicitaciones={licitaciones || []}
                />
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white mt-12 py-6">
                <div className="container mx-auto px-4 text-center text-sm text-slate-500">
                    <p>© 2026 LicitaFlash. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    )
}
