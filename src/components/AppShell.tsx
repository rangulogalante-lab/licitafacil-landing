import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default async function AppShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, subscription_plan, subscription_status')
        .eq('id', user.id)
        .single();

    let userRole = 'Plan Gratuito';
    if (profile?.subscription_status === 'active') {
        if (profile.subscription_plan === 'ultra') {
            userRole = 'Plan Ultra';
        } else if (profile.subscription_plan === 'pro' || profile.subscription_plan === 'pro+') {
            userRole = 'Plan Pro+';
        }
    }

    const sidebarUser = {
        name: profile?.full_name || user.email?.split('@')[0] || 'Usuario',
        email: user.email || '',
        role: userRole,
    };

    return (
        <div className="flex h-screen w-full bg-[#101922]">
            <Sidebar user={sidebarUser} />
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <header className="md:hidden flex items-center justify-between p-4 border-b border-[#2b3b4c] bg-[#1a2632]">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#137fec]/10 p-1.5 rounded-lg text-[#137fec]">
                            <span className="material-symbols-outlined">gavel</span>
                        </div>
                        <span className="text-lg font-bold text-[#137fec]">
                            Licita<span className="text-white">Flash</span>
                        </span>
                    </div>
                    <button className="text-[#94a3b8] hover:text-white">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto">{children}</div>
            </main>
        </div>
    );
}
