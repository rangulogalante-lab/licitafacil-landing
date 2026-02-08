'use client';

interface StatCardProps {
    icon: string;
    iconBgClass: string;
    iconColorClass: string;
    label: string;
    value: string | number;
    trend?: {
        value: string;
        positive: boolean;
    };
    badge?: string;
}

export function StatCard({ icon, iconBgClass, iconColorClass, label, value, trend, badge }: StatCardProps) {
    return (
        <div className="bg-[#1a2632] rounded-xl p-6 border border-[#2b3b4c] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`${iconBgClass} p-2.5 rounded-lg ${iconColorClass}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                {trend && (
                    <span className={`flex items-center ${trend.positive ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'} px-2 py-0.5 rounded text-xs font-bold`}>
                        {trend.value}
                        <span className="material-symbols-outlined text-xs ml-0.5">
                            {trend.positive ? 'trending_up' : 'trending_down'}
                        </span>
                    </span>
                )}
                {badge && (
                    <span className="flex items-center text-[#94a3b8] bg-[#101922] px-2 py-0.5 rounded text-xs font-bold">
                        {badge}
                    </span>
                )}
            </div>
            <p className="text-[#94a3b8] text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
    );
}

interface StatsGridProps {
    activeTenders: number;
    upcomingDeadlines: number;
    submittedProposals: number;
    winRate: number;
}

export function StatsGrid({ activeTenders, upcomingDeadlines, submittedProposals, winRate }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                icon="folder_open"
                iconBgClass="bg-blue-900/20"
                iconColorClass="text-[#137fec]"
                label="Licitaciones Activas"
                value={activeTenders}
                trend={{ value: '+2%', positive: true }}
            />
            <StatCard
                icon="timer"
                iconBgClass="bg-orange-900/20"
                iconColorClass="text-orange-500"
                label="Próximos Vencimientos"
                value={upcomingDeadlines}
                badge="Urgente"
            />
            <StatCard
                icon="send"
                iconBgClass="bg-purple-900/20"
                iconColorClass="text-purple-500"
                label="Propuestas Enviadas"
                value={submittedProposals}
                trend={{ value: '+5%', positive: true }}
            />
            <StatCard
                icon="trophy"
                iconBgClass="bg-indigo-900/20"
                iconColorClass="text-indigo-500"
                label="Tasa de Éxito"
                value={`${winRate}%`}
                trend={{ value: '+1.5%', positive: true }}
            />
        </div>
    );
}
