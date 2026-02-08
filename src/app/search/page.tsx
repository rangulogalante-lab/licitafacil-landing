import { createClient } from '@/lib/supabase/server'
import SearchPanel from '@/components/SearchPanel'

export default async function SearchPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    let userPlan: 'free' | 'pro' | 'ultra' = 'free'
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_status, subscription_plan')
            .eq('id', user.id)
            .single()

        if (profile?.subscription_status === 'active') {
            if (profile.subscription_plan === 'ultra') {
                userPlan = 'ultra'
            } else if (profile.subscription_plan === 'pro' || profile.subscription_plan === 'pro+') {
                userPlan = 'pro'
            }
        }
    }

    const { data: licitaciones } = await supabase
        .from('licitaciones')
        .select('*')
        .eq('estado', 'abierta')
        .order('fecha_publicacion', { ascending: false })
        .limit(20)

    return <SearchPanel userPlan={userPlan} initialLicitaciones={licitaciones || []} />
}
