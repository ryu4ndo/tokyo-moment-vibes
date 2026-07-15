import { Router } from 'express';
import { getStore, persistStore } from '../platform/dataAccess.js';
import { getBusinessAnalytics, generateAiBusinessAdvice } from '../platform/store.js';

const router = Router();

router.post('/auth/login', (req, res) => {
  const { provider, email } = req.body ?? {};
  const store = getStore();
  const business = store.businesses.find((b) => b.ownerId === 'owner-demo') ?? store.businesses[0];
  res.json({
    user: {
      id: provider === 'google' ? 'owner-google' : 'owner-demo',
      email: email ?? 'owner@shop.example.com',
      name: provider === 'google' ? 'Google Owner' : 'Shop Owner',
      provider,
    },
    businessId: business.id,
  });
});

router.get('/profile/:businessId', (req, res) => {
  const biz = getStore().businesses.find((b) => b.id === req.params.businessId);
  if (!biz) {
    res.status(404).json({ error: 'Business not found' });
    return;
  }
  res.json(biz);
});

router.put('/profile/:businessId', async (req, res) => {
  const store = getStore();
  const idx = store.businesses.findIndex((b) => b.id === req.params.businessId);
  if (idx < 0) {
    res.status(404).json({ error: 'Business not found' });
    return;
  }
  store.businesses[idx] = { ...store.businesses[idx], ...req.body, updatedAt: Date.now() };
  await persistStore(store);
  res.json(store.businesses[idx]);
});

router.get('/:businessId/events', (req, res) => {
  res.json(getStore().businessEvents.filter((e) => e.businessId === req.params.businessId));
});

router.post('/:businessId/events', async (req, res) => {
  const store = getStore();
  const item = { ...req.body, id: req.body.id ?? `be-${Date.now()}`, businessId: req.params.businessId };
  const idx = store.businessEvents.findIndex((e) => e.id === item.id);
  if (idx >= 0) store.businessEvents[idx] = item;
  else store.businessEvents.push(item);
  await persistStore(store);
  res.json(item);
});

router.get('/:businessId/coupons', (req, res) => {
  res.json(getStore().coupons.filter((c) => c.businessId === req.params.businessId));
});

router.post('/:businessId/coupons', async (req, res) => {
  const store = getStore();
  const item = { ...req.body, id: req.body.id ?? `cp-${Date.now()}`, businessId: req.params.businessId };
  const idx = store.coupons.findIndex((c) => c.id === item.id);
  if (idx >= 0) store.coupons[idx] = item;
  else store.coupons.push(item);
  await persistStore(store);
  res.json(item);
});

router.get('/:businessId/reviews', (req, res) => {
  res.json(getStore().reviews.filter((r) => r.businessId === req.params.businessId));
});

router.put('/reviews/:reviewId', async (req, res) => {
  const store = getStore();
  const review = store.reviews.find((r) => r.id === req.params.reviewId);
  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  review.reply = req.body.reply;
  await persistStore(store);
  res.json(review);
});

router.get('/:businessId/analytics', (req, res) => {
  const store = getStore();
  const business = store.businesses.find((b) => b.id === req.params.businessId);
  const analytics = getBusinessAnalytics(req.params.businessId);
  const advice = generateAiBusinessAdvice(analytics, business, req.query.locale ?? 'ja');
  res.json({ analytics, advice });
});

router.get('/ads/active', (_req, res) => {
  res.json({ ads: getStore().ads.filter((a) => a.active) });
});

router.get('/ai-priority', (_req, res) => {
  res.json(getStore().aiPriority);
});

router.get('/sponsored/:spotId', (req, res) => {
  const sponsored = getStore().ads.some((a) => a.active && a.isSponsored && a.spotId === req.params.spotId);
  const biz = getStore().businesses.find((b) => b.spotId === req.params.spotId);
  res.json({ sponsored: sponsored || Boolean(biz?.sponsored) });
});

export default router;
