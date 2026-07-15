/** Normalized domain types — API-ready contracts */

/** @typedef {'clear' | 'cloudy' | 'rain' | 'snow'} WeatherCondition */

/**
 * @typedef {Object} WeatherSnapshot
 * @property {WeatherCondition} condition
 * @property {number} temperatureC
 * @property {number} precipitationProbability 0–100
 * @property {number} [humidity]
 * @property {string} area
 * @property {'mock' | 'api' | 'openweather'} source
 * @property {string} updatedAt ISO timestamp
 */

/**
 * @typedef {'festival' | 'exhibition' | 'fireworks' | 'popup' | 'seasonal' | 'culture'} EventType
 * @typedef {'today' | 'this_week' | 'limited'} EventTiming
 */

/**
 * @typedef {Object} EventDTO
 * @property {string} id
 * @property {string} titleJa
 * @property {string} titleEn
 * @property {EventType} type
 * @property {EventTiming} timing
 * @property {string} area
 * @property {number} [lat]
 * @property {number} [lng]
 * @property {string} [descriptionJa]
 * @property {string} [descriptionEn]
 * @property {string} startDate YYYY-MM-DD
 * @property {string} [endDate] YYYY-MM-DD
 */

/**
 * @typedef {Object} ReviewDTO
 * @property {string} text
 * @property {number} rating
 * @property {string} [author]
 */

/**
 * @typedef {Object} SpotDTO
 * @property {string} id
 * @property {string} name
 * @property {string[]} photos
 * @property {string[]} videos
 * @property {string} openingHours
 * @property {string} priceRange
 * @property {string} genre
 * @property {string} category
 * @property {string} address
 * @property {string} area
 * @property {number} rating
 * @property {number} reviewCount
 * @property {ReviewDTO[]} reviews
 * @property {number} lat
 * @property {number} lng
 * @property {number} [walkMinutes]
 * @property {string} [googleMapsUrl]
 * @property {string} [placeId]
 * @property {'mock' | 'google' | 'api'} [source]
 */

export const EVENT_TYPES = ['festival', 'exhibition', 'fireworks', 'popup', 'seasonal', 'culture'];

export const WEATHER_CONDITIONS = ['clear', 'cloudy', 'rain', 'snow'];
