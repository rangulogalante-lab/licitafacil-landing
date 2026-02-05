import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Initialize Stripe only when needed (not at build time)
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set')
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2026-01-28.clover'
    })
}

function getSupabase() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Supabase environment variables not set')
    }
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''


export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    const stripe = getStripe()
    const supabase = getSupabase()

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session
            const customerEmail = session.customer_email || session.customer_details?.email

            if (customerEmail) {
                // Update user's subscription status
                const { error } = await supabase
                    .from('users')
                    .update({
                        subscription_status: 'active',
                        subscription_plan: session.amount_total === 8999 ? 'ultra' : 'pro',
                        stripe_customer_id: session.customer as string,
                        subscription_updated_at: new Date().toISOString()
                    })
                    .eq('email', customerEmail)

                if (error) {
                    console.error('Error updating user subscription:', error)
                } else {
                    console.log(`Subscription activated for ${customerEmail}`)
                }
            }
            break
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription
            const customerId = subscription.customer as string

            // Deactivate subscription
            const { error } = await supabase
                .from('users')
                .update({
                    subscription_status: 'cancelled',
                    subscription_updated_at: new Date().toISOString()
                })
                .eq('stripe_customer_id', customerId)

            if (error) {
                console.error('Error cancelling subscription:', error)
            }
            break
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice
            const customerId = invoice.customer as string

            // Mark as past_due
            await supabase
                .from('users')
                .update({
                    subscription_status: 'past_due',
                    subscription_updated_at: new Date().toISOString()
                })
                .eq('stripe_customer_id', customerId)
            break
        }
    }

    return NextResponse.json({ received: true })
}
