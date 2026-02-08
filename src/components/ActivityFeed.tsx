'use client';

interface ActivityItem {
    id: string;
    type: 'proposal' | 'ai' | 'alert' | 'draft' | 'deadline';
    title: string;
    description: string;
    time: string;
}

const typeConfig = {
    proposal: {
        icon: 'upload_file',
        bgClass: 'bg-blue-900/30',
        colorClass: 'text-[#137fec]',
        showOnline: true,
    },
    ai: {
        icon: 'auto_awesome',
        bgClass: 'bg-purple-900/30',
        colorClass: 'text-purple-400',
    },
    alert: {
        icon: 'mark_email_unread',
        bgClass: 'bg-yellow-900/30',
        colorClass: 'text-yellow-400',
    },
    draft: {
        icon: 'edit',
        bgClass: 'bg-gray-800',
        colorClass: 'text-gray-400',
    },
    deadline: {
        icon: 'warning',
        bgClass: 'bg-red-900/30',
        colorClass: 'text-red-400',
    },
};

interface ActivityFeedProps {
    activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Actividad Reciente</h2>
                <button className="text-[#94a3b8] hover:text-[#137fec] transition-colors">
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            </div>

            <div className="bg-[#1a2632] rounded-xl border border-[#2b3b4c] shadow-sm overflow-hidden flex-1">
                <div className="divide-y divide-[#2b3b4c]">
                    {activities.map((activity) => {
                        const config = typeConfig[activity.type];
                        return (
                            <div
                                key={activity.id}
                                className="p-4 hover:bg-[#101922]/50 transition-colors cursor-pointer group"
                            >
                                <div className="flex gap-4">
                                    <div className="relative shrink-0">
                                        <div className={`size-10 rounded-full ${config.bgClass} flex items-center justify-center ${config.colorClass}`}>
                                            <span className="material-symbols-outlined text-lg">{config.icon}</span>
                                        </div>
                                        {'showOnline' in config && config.showOnline && (
                                            <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-[#1a2632] rounded-full"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                                        <p className="text-xs text-[#94a3b8] mt-0.5">{activity.description}</p>
                                        <p className="text-[10px] text-[#94a3b8] mt-1 font-medium">{activity.time}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-3 bg-[#101922]/50 border-t border-[#2b3b4c] text-center">
                    <a className="text-xs font-semibold text-[#137fec] hover:underline" href="#">
                        Ver toda la actividad
                    </a>
                </div>
            </div>
        </div>
    );
}
