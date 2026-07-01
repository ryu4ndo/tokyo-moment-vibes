import { Router } from 'express';
import { generatePlansWithOpenAI } from '../generatePlan.js';
import { generatePlanFromText } from '../generatePlanFromText.js';
import { chatWithAI } from '../chat.js';
import { searchPlaces, getPlaceDetails } from '../places.js';
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

export default router;
