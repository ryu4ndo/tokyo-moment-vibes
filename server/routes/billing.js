import { Router } from 'express';
import Stripe from 'stripe';
import { getStore, persistStore } from '../platform/dataAccess.js';

const secretKey = process.env.STRIPE_SECRET_KEY ?? '';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
const appUrl = process.env.APP_URL ?? 'http://localhost:5173';

export const isStripeEnabled = Boolean(secretKey);

function getStripe() {
  if (!isStripeEnabled) return null;
  return new Stripe(secretKey);
}

const PLANS = {
  owner_pro: {
    priceEnv: 'STRIPE_PRICE_OWNER_PRO',
    label: 'Owner Pro',
    features: ['analytics', 'ai_advice', 'coupons'],
  },
  sponsor: {
    priceEnv: 'STRIPE_PRICE_SPONSOR',
    label: 'Sponsored Listing',
    features: ['sponsored_badge', 'ai_boost'],
  },
};

export async function createCheckoutSession({ businessId, plan = 'owner_pro', successUrl, cancelUrl }) {
  const stripe = getStripe();
  if (!stripe) {
    return { demo: true, url: successUrl ?? `${appUrl}/owner/billing?demo=success&plan=${plan}` };
  }
  const priceId = process.env[PLANS[plan]?.priceEnv];
  if (!priceId) throw new Error(`Stripe price not configured for ${plan}`);
  const store = getStore();
  const business = store.businesses.find((b) => b.id === businessId);
  if (!business) throw new Error('Business not found');

  let customerId = business.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ metadata: { businessId } });
    customerId = customer.id;
    business.stripeCustomerId = customerId;
    await persistStore(store);
  }

  const mode = plan === 'sponsor' ? 'payment' : 'subscription';
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl ?? `${appUrl}/owner/billing?success=1`,
    cancel_url: cancelUrl ?? `${appUrl}/owner/billing?canceled=1`,
    metadata: { businessId, plan },
  });
  return { url: session.url, sessionId: session.id };
}

export async function handleStripeWebhook(rawBody, signature) {
  const stripe = getStripe();
  if (!stripe || !webhookSecret) return { ok: false, error: 'Stripe not configured' };

  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  const store = getStore();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { businessId, plan } = session.metadata ?? {};
    const biz = store.businesses.find((b) => b.id === businessId);
    if (biz) {
      if (plan === 'sponsor') {
        biz.sponsored = true;
        store.ads.push({
          id: `ad-${Date.now()}`,
          type: 'sponsor',
          labelJa: 'スポンサー',
          labelEn: 'Sponsored',
          businessId: biz.id,
          spotId: biz.spotId,
          active: true,
          isSponsored: true,
        });
      } else {
        biz.subscriptionStatus = 'active';
        biz.stripeSubscriptionId = session.subscription;
      }
      await persistStore(store);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    const biz = store.businesses.find((b) => b.stripeSubscriptionId === sub.id);
    if (biz) {
      biz.subscriptionStatus = 'canceled';
      biz.sponsored = false;
      await persistStore(store);
    }
  }

  return { ok: true };
}

export function getBillingPlans() {
  return Object.entries(PLANS).map(([id, p]) => ({
    id,
    label: p.label,
    features: p.features,
    configured: Boolean(process.env[p.priceEnv]),
  }));
}

const router = Router();

router.get('/plans', (_req, res) => {
  res.json({ plans: getBillingPlans() });
});

router.post('/checkout', async (req, res) => {
  try {
    const { businessId, plan, successUrl, cancelUrl } = req.body ?? {};
    const result = await createCheckoutSession({ businessId, plan, successUrl, cancelUrl });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
