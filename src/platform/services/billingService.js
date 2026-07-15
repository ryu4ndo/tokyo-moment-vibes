import { isApiData } from '@/config/dataSource';
import { postApi, getApi } from '@/services/apiClient';
import { isStripeEnabled } from '@/lib/stripeClient';

export async function fetchBillingPlans() {
  if (!isApiData && !isStripeEnabled) {
    return {
      plans: [
        { id: 'owner_pro', label: 'Owner Pro', features: ['analytics', 'ai_advice', 'coupons'], configured: false },
        { id: 'sponsor', label: 'Sponsored Listing', features: ['sponsored_badge', 'ai_boost'], configured: false },
      ],
    };
  }
  return getApi('/api/billing/plans');
}

export async function createCheckout({ businessId, plan }) {
  const successUrl = `${window.location.origin}/owner/billing?success=1`;
  const cancelUrl = `${window.location.origin}/owner/billing?canceled=1`;
  return postApi('/api/billing/checkout', { businessId, plan, successUrl, cancelUrl });
}
