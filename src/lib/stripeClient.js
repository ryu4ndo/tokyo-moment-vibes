const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '';

export const isStripeEnabled = Boolean(publishableKey);

export function getStripePublishableKey() {
  return publishableKey;
}
