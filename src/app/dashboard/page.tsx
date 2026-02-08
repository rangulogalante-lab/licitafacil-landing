import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { StatsGrid } from '@/components/StatsCards';
import ActivityFeed from '@/components/ActivityFeed';
import RecommendedTenders from '@/components/RecommendedTenders';

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_plan')
        .eq('id', user.id)
        .single();

    let userPlan: 'free' | 'pro' | 'ultra' = 'free';
    if (profile?.subscription_status === 'active') {
        if (profile.subscription_plan === 'ultra') {
            userPlan = 'ultra';
        } else if (
            profile.subscription_plan === 'pro' ||
            profile.subscription_plan === 'pro+'
        ) {
            userPlan = 'pro';
        }
    }

    const { count: totalLicitaciones } = await supabase
        .from('licitaciones')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'abierta');

    const { data: recommendedLicitaciones } = await supabase
        .from('licitaciones')
        .select('*')
        .eq('estado', 'abierta')
        .order('presupuesto_base', { ascending: false, nullsFirst: false })
        .order('fecha_publicacion', { ascending: false })
        .limit(5);

    const stats = {
        activeTenders: totalLicitaciones || 0,
        upcomingDeadlines: 3,
        submittedProposals: 5,
        winRate: 24,
    };

    const recentActivities = [
        { id: '1', type: 'proposal' as const, title: 'Propuesta enviada', description: 'Suministro de equipos informáticos', time: 'Hace 2 horas' },
        { id: '2', type: 'ai' as const, title: 'Análisis IA completado', description: 'Servicios de consultoría', time: 'Hace 5 horas' },
        { id: '3', type: 'alert' as const, title: 'Nueva licitación relevante', description: 'Obra de mantenimiento vial', time: 'Ayer' },
        { id: '4', type: 'deadline' as const, title: 'Fecha límite próxima', description: 'Expediente 2026/1234', time: 'En 3 días' },
        { id: '5', type: 'draft' as const, title: 'Borrador guardado', description: 'Propuesta técnica para...', time: 'Hace 2 días' },
    ];

    const planBadge = {
        free: { label: 'Free', class: 'bg-slate-800 text-slate-200' },
        pro: { label: 'Pro+', class: 'bg-orange-900/50 text-orange-400' },
        ultra: { label: 'Ultra', class: 'bg-purple-900/50 text-purple-400' },
    };

    return (
        <div className="p-4 md:p-8 space-y-8 scroll-smooth">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                            Dashboard
                        </h1>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${planBadge[userPlan].class}`}>
                            {planBadge[userPlan].label}
                        </span>
                    </div>
                    <p className="text-[#94a3b8] text-sm md:text-base">
                        Bienvenido de vuelta. Aquí tienes un resumen de tu actividad.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/search"
                        className="h-10 px-4 bg-[#1a2632] hover:bg-[#243445] text-white font-medium rounded-lg border border-[#2b3b4c] transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">search</span>
                        <span className="hidden sm:inline">Buscar</span>
                    </Link>
                    <button className="h-10 px-5 bg-[#137fec] hover:bg-blue-600 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span className="hidden sm:inline">Nueva Alerta</span>
                    </button>
                </div>
            </div>

            <StatsGrid
                activeTenders={stats.activeTenders}
                upcomingDeadlines={stats.upcomingDeadlines}
                submittedProposals={stats.submittedProposals}
                winRate={stats.winRate}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <RecommendedTenders tenders={recommendedLicitaciones || []} />
                </div>
                <div className="xl:col-span-1">
                    <ActivityFeed activities={recentActivities} />
                </div>
            </div>

            <footer className="mt-8 pt-6 border-t border-[#2b3b4c] text-center">
                <p className="text-[#94a3b8] text-sm">
                    © 2026 LicitaFlash. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
}
