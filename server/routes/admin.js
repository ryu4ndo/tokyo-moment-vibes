import { Router } from 'express';
import { ENRICHED_VIBES } from '../../src/data/vibes.js';
import { getStore, persistStore } from '../platform/dataAccess.js';

const router = Router();

router.post('/auth/login', (req, res) => {
  const { email } = req.body ?? {};
  res.json({
    user: { id: 'admin-demo', email: email ?? 'admin@tokyomomentvibes.app', name: 'Platform Admin' },
  });
});

router.get('/metrics', (_req, res) => {
  res.json(getStore().adminMetrics);
});

router.get('/businesses', (_req, res) => {
  res.json(getStore().businesses);
});

router.put('/businesses/:businessId', async (req, res) => {
  const store = getStore();
  const b = store.businesses.find((x) => x.id === req.params.businessId);
  if (!b) {
    res.status(404).json({ error: 'Business not found' });
    return;
  }
  Object.assign(b, req.body);
  await persistStore(store);
  res.json(b);
});

router.get('/events', (_req, res) => {
  res.json(getStore().platformEvents);
});

router.post('/events', async (req, res) => {
  const store = getStore();
  const item = { ...req.body, id: req.body.id ?? `pe-${Date.now()}` };
  const idx = store.platformEvents.findIndex((e) => e.id === item.id);
  if (idx >= 0) store.platformEvents[idx] = item;
  else store.platformEvents.push(item);
  await persistStore(store);
  res.json(item);
});

router.delete('/events/:id', async (req, res) => {
  const store = getStore();
  store.platformEvents = store.platformEvents.filter((e) => e.id !== req.params.id);
  await persistStore(store);
  res.json({ ok: true });
});

router.get('/features', (_req, res) => {
  res.json(getStore().featuredCollections);
});

router.post('/features', async (req, res) => {
  const store = getStore();
  const item = { ...req.body, id: req.body.id ?? `feat-${Date.now()}` };
  const idx = store.featuredCollections.findIndex((f) => f.id === item.id);
  if (idx >= 0) store.featuredCollections[idx] = item;
  else store.featuredCollections.push(item);
  await persistStore(store);
  res.json(item);
});

router.get('/users', (_req, res) => {
  res.json(getStore().users);
});

router.put('/users/:userId', async (req, res) => {
  const store = getStore();
  const u = store.users.find((x) => x.id === req.params.userId);
  if (!u) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  Object.assign(u, req.body);
  await persistStore(store);
  res.json(u);
});

router.get('/reports', (_req, res) => {
  res.json(getStore().reports);
});

router.get('/inquiries', (_req, res) => {
  res.json(getStore().inquiries);
});

router.get('/ai-priority', (_req, res) => {
  res.json(getStore().aiPriority);
});

router.put('/ai-priority', async (req, res) => {
  const store = getStore();
  store.aiPriority = { ...store.aiPriority, ...req.body };
  await persistStore(store);
  res.json(store.aiPriority);
});

router.get('/ads', (_req, res) => {
  res.json(getStore().ads);
});

router.post('/ads', async (req, res) => {
  const store = getStore();
  const item = { ...req.body, id: req.body.id ?? `ad-${Date.now()}`, isSponsored: true };
  const idx = store.ads.findIndex((a) => a.id === item.id);
  if (idx >= 0) store.ads[idx] = item;
  else store.ads.push(item);
  await persistStore(store);
  res.json(item);
});

router.get('/spots', (_req, res) => {
  const store = getStore();
  res.json(
    ENRICHED_VIBES.map((v) => {
      const biz = store.businesses.find((b) => b.spotId === v.spotId);
      return {
        spotId: v.spotId,
        name: v.shopName,
        area: v.area,
        category: v.category,
        rating: v.rating,
        featured: Boolean(biz?.featured ?? v.aiPick),
        trending: Boolean(v.isPopular),
        sponsored: Boolean(biz?.sponsored),
      };
    }),
  );
});

router.put('/spots/:spotId', async (req, res) => {
  const store = getStore();
  let biz = store.businesses.find((b) => b.spotId === req.params.spotId);
  if (!biz) {
    const vibe = ENRICHED_VIBES.find((v) => v.spotId === req.params.spotId);
    if (!vibe) {
      res.status(404).json({ error: 'Spot not found' });
      return;
    }
    biz = { id: `biz-${req.params.spotId}`, spotId: req.params.spotId, name: vibe.shopName, ownerId: 'admin', status: 'verified', featured: false, sponsored: false };
    store.businesses.push(biz);
  }
  const { featured, sponsored, trending } = req.body;
  if (featured != null) biz.featured = featured;
  if (sponsored != null) biz.sponsored = sponsored;
  if (trending != null) {
    const vibe = ENRICHED_VIBES.find((v) => v.spotId === req.params.spotId);
    if (vibe) vibe.isPopular = trending;
  }
  await persistStore(store);
  res.json(biz);
});

export default router;
