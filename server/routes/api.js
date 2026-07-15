import { Router } from 'express';
import { generatePlansWithOpenAI } from '../generatePlan.js';
import { generatePlanFromText } from '../generatePlanFromText.js';
import { chatWithAI } from '../chat.js';
import { searchPlaces, getPlaceDetails } from '../places.js';
import {
  getWeather,
  getEvents,
  getSpots,
  getSpotById,
  getVibes,
  getNearbySpots,
  getRoute,
} from '../dataApi.js';
import { getStore } from '../platform/dataAccess.js';
import { mergePlatformEvents } from '../../src/platform/utils/mergePlatformEvents.js';
import { searchSpots } from '../search.js';
import { formatOpenAIError, getEnvStatus } from '../openaiError.js';

const router = Router();

function sendApiError(res, error, context) {
  const detail = error.detail ?? formatOpenAIError(error, {
    ...context,
    env: getEnvStatus(),
  });

  console.error('[OpenAI API Error]', JSON.stringify(detail, null, 2));

  const statusCode =
    typeof detail.httpStatus === 'number' && detail.httpStatus >= 400
      ? detail.httpStatus
      : 500;

  res.status(statusCode).json({
    error: detail.message,
    detail,
  });
}

router.post('/generate-plan', async (req, res) => {
  try {
    const plans = await generatePlansWithOpenAI(req.body);
    res.json({ plans });
  } catch (error) {
    sendApiError(res, error, {
      step: 'generate-plan',
      endpoint: '/api/generate-plan',
    });
  }
});

router.post('/plan-from-text', async (req, res) => {
  try {
    const result = await generatePlanFromText(req.body);
    res.json(result);
  } catch (error) {
    sendApiError(res, error, {
      step: 'plan-from-text',
      endpoint: '/api/plan-from-text',
    });
  }
});

router.get('/weather', (req, res) => {
  const area = req.query.area ?? '渋谷';
  res.json({ weather: getWeather({ area }), source: 'mock' });
});

router.get('/events', (req, res) => {
  const date = req.query.date;
  const base = getEvents({ date });
  const platformEvents = getStore().platformEvents ?? [];
  const merged = mergePlatformEvents(base, platformEvents, date ? new Date(date) : new Date());
  res.json({ ...merged, source: process.env.DATABASE_URL ? 'db' : 'mock' });
});

router.get('/platform/events', (_req, res) => {
  res.json({ events: getStore().platformEvents.filter((e) => e.active) });
});

router.get('/platform/features', (_req, res) => {
  res.json({ features: getStore().featuredCollections.filter((f) => f.active) });
});

router.get('/spots', (req, res) => {
  const { area, locale = 'ja' } = req.query;
  res.json({ spots: getSpots({ area, locale }), source: 'mock' });
});

router.get('/spots/:id', (req, res) => {
  const spot = getSpotById(req.params.id, req.query.locale ?? 'ja');
  if (!spot) {
    res.status(404).json({ error: 'Spot not found' });
    return;
  }
  res.json({ spot, source: 'mock' });
});

router.get('/vibes', (req, res) => {
  const { experienceMode, companion, locale, category, location } = req.query;
  res.json({
    vibes: getVibes({ experienceMode, companion, locale, category, location }),
    source: 'mock',
  });
});

router.post('/maps/nearby', (req, res) => {
  const { lat, lng, area, limit, locale } = req.body;
  res.json({ nearby: getNearbySpots({ lat, lng, area, limit, locale }), source: 'mock' });
});

router.post('/maps/route', (req, res) => {
  const { from, to } = req.body;
  res.json({ route: getRoute({ from, to }), source: 'mock' });
});

router.post('/search', (req, res) => {
  const { query, context, activeFilters = [], excludeSpotIds = [] } = req.body;
  const result = searchSpots({ query, context, activeFilters, excludeSpotIds });
  res.json({ ...result, source: 'mock' });
});

router.post('/openai-status', (_req, res) => {
  res.json({ env: getEnvStatus() });
});

router.post('/places/search', async (req, res) => {
  try {
    const result = await searchPlaces(req.body);
    res.json(result);
  } catch (error) {
    sendApiError(res, error, { step: 'places-search', endpoint: '/api/places/search' });
  }
});

router.get('/places/details', async (req, res) => {
  try {
    const details = await getPlaceDetails({
      placeId: req.query.placeId,
      spotId: req.query.spotId,
      fromArea: req.query.fromArea,
      locale: req.query.locale ?? 'ja',
    });
    if (!details) {
      res.status(404).json({ error: 'Place not found' });
      return;
    }
    res.json({ place: details });
  } catch (error) {
    sendApiError(res, error, { step: 'places-details', endpoint: '/api/places/details' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const result = await chatWithAI(req.body);
    res.json(result);
  } catch (error) {
    sendApiError(res, error, { step: 'chat', endpoint: '/api/chat' });
  }
});

router.get('/users/snapshot/:userId', async (req, res) => {
  try {
    const { getUserSnapshot } = await import('../db/repository.js');
    const { isDbEnabled } = await import('../db/pool.js');
    if (!isDbEnabled()) {
      res.json({ snapshot: null });
      return;
    }
    const snapshot = await getUserSnapshot(req.params.userId);
    res.json({ snapshot });
  } catch {
    res.json({ snapshot: null });
  }
});

router.post('/users/snapshot', async (req, res) => {
  try {
    const { saveUserSnapshot } = await import('../db/repository.js');
    const { isDbEnabled } = await import('../db/pool.js');
    if (!isDbEnabled()) {
      res.json({ ok: true });
      return;
    }
    await saveUserSnapshot(req.body.userId, req.body.snapshot);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
