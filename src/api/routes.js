/**
 * API route map — client calls go through services/; server implements routes in server/routes/api.js
 */
export const API_ROUTES = {
  generatePlan: '/api/generate-plan',
  planFromText: '/api/plan-from-text',
  chat: '/api/chat',
  placesSearch: '/api/places/search',
  placesDetails: '/api/places/details',
  health: '/api/health',
};
