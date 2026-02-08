'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface SidebarProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
        role?: string;
    };
}

const navItems = [
    { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/search', icon: 'search', label: 'Buscar Licitaciones' },
    { href: '/drafts', icon: 'edit_note', label: 'Borradores', badge: true },
    { href: '/documents', icon: 'folder_open', label: 'Documentos' },
    { href: '/analytics', icon: 'analytics', label: 'Analytics' },
];

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <aside className="w-[280px] bg-[#1a2632] border-r border-[#2b3b4c] flex flex-col justify-between transition-colors duration-300 hidden md:flex shrink-0 z-20">
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-[#137fec]/10 p-2 rounded-lg text-[#137fec]">
                            <span className="material-symbols-outlined text-3xl">gavel</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#137fec]">
                            Licita<span className="text-white">Flash</span>
                        </span>
                    </div>

                    {/* User Profile */}
                    <div className="flex gap-3 items-center p-3 rounded-xl bg-[#101922]/50 border border-[#2b3b4c] mb-6">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-sm bg-gradient-to-br from-[#137fec] to-purple-600"
                            style={user.avatar ? { backgroundImage: `url("${user.avatar}")` } : {}}
                        >
                            {!user.avatar && (
                                <span className="material-symbols-outlined text-white flex items-center justify-center h-full">person</span>
                            )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <h1 className="text-white text-sm font-semibold leading-tight truncate">
                                {user.name || 'Usuario'}
                            </h1>
                            <p className="text-[#94a3b8] text-xs font-normal leading-normal truncate">
                                {user.role || 'Plan Gratuito'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive
                                    ? 'bg-[#137fec]/10 text-[#137fec]'
                                    : 'text-[#94a3b8] hover:bg-[#101922]/50 hover:text-white'
                                    }`}
                            >
                                <div className="relative">
                                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </span>
                                    {item.badge && (
                                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#137fec] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#137fec]"></span>
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-medium leading-normal">{item.label}</p>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-[#2b3b4c] mt-auto space-y-1">
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#94a3b8] hover:bg-[#101922]/50 hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined">settings</span>
                        <p className="text-sm font-medium leading-normal">Configuración</p>
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#94a3b8] hover:bg-red-900/10 hover:text-red-400 transition-all"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <p className="text-sm font-medium leading-normal">Cerrar Sesión</p>
                    </button>
                </div>
            </div>
        </aside>
    );
}
