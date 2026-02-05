import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user's licitaciones with alertas
    const { data: alertas } = await supabase
        .from('alertas')
        .select(`
      *,
      licitacion:licitaciones(*)
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

    // Get recent licitaciones
    const { data: licitaciones } = await supabase
        .from('licitaciones')
        .select('*')
        .eq('estado', 'abierta')
        .order('fecha_publicacion', { ascending: false })
        .limit(10)

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-800">LicitaFácil</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600">{user.email}</span>
                        <Link href="/settings" className="text-sm text-blue-600 hover:text-blue-700">
                            Configuración
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button className="text-sm text-slate-500 hover:text-slate-700">
                                Cerrar sesión
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-500">Licitaciones Activas</p>
                        <p className="text-3xl font-bold text-slate-800">{licitaciones?.length || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-500">Tus Alertas</p>
                        <p className="text-3xl font-bold text-blue-600">{alertas?.length || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-500">Resúmenes IA</p>
                        <p className="text-3xl font-bold text-green-600">0</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-500">Tu Plan</p>
                        <p className="text-3xl font-bold text-orange-500">Gratis</p>
                    </div>
                </div>

                {/* Licitaciones List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800">Licitaciones Recientes</h2>
                    </div>

                    {licitaciones && licitaciones.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {licitaciones.map((lic) => (
                                <Link
                                    key={lic.id}
                                    href={`/licitacion/${lic.id}`}
                                    className="block p-6 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-slate-800 mb-1">
                                                {lic.titulo}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                {lic.organo_contratacion} • {lic.tipo_contrato}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-800">
                                                {lic.presupuesto_base?.toLocaleString('es-ES')}€
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Límite: {new Date(lic.fecha_limite).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-lg font-medium text-slate-800 mb-2">
                                No hay licitaciones aún
                            </h3>
                            <p className="text-slate-500">
                                Configura tus preferencias para recibir alertas personalizadas.
                            </p>
                            <Link
                                href="/onboarding"
                                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Configurar alertas
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
