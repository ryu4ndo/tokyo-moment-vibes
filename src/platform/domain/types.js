/** @typedef {'owner' | 'admin' | 'consumer'} PlatformRole */

/** @typedef {'google' | 'email'} BusinessAuthProvider */

/**
 * @typedef {Object} BusinessHours
 * @property {string} open
 * @property {string} close
 * @property {string[]} closedDays
 */

/**
 * @typedef {Object} BusinessProfile
 * @property {string} id
 * @property {string} ownerId
 * @property {string} name
 * @property {string} nameEn
 * @property {string} description
 * @property {string} descriptionEn
 * @property {string[]} photos
 * @property {string[]} videos
 * @property {string[]} menu
 * @property {string} priceRange
 * @property {BusinessHours} hours
 * @property {string} address
 * @property {string} area
 * @property {string} phone
 * @property {string} instagram
 * @property {string} website
 * @property {string} spotId
 * @property {'pending' | 'verified' | 'suspended'} status
 * @property {boolean} featured
 * @property {boolean} sponsored
 * @property {number} lat
 * @property {number} lng
 * @property {string} category
 * @property {number} updatedAt
 */

/**
 * @typedef {Object} BusinessEvent
 * @property {string} id
 * @property {string} businessId
 * @property {'limited_menu' | 'event' | 'campaign' | 'happy_hour' | 'popup'} type
 * @property {string} titleJa
 * @property {string} titleEn
 * @property {string} descriptionJa
 * @property {string} descriptionEn
 * @property {string} startDate
 * @property {string} endDate
 * @property {boolean} active
 */

/**
 * @typedef {Object} BusinessCoupon
 * @property {string} id
 * @property {string} businessId
 * @property {'percent' | 'free_item' | 'limited'} type
 * @property {string} labelJa
 * @property {string} labelEn
 * @property {number} [discountPercent]
 * @property {string} [freeItem]
 * @property {string} startDate
 * @property {string} endDate
 * @property {boolean} active
 */

/**
 * @typedef {Object} BusinessAnalytics
 * @property {string} businessId
 * @property {number} views
 * @property {number} saves
 * @property {number} aiRecommendations
 * @property {Record<string, number>} hourlyViews
 * @property {Record<string, number>} weekdayViews
 * @property {Record<string, number>} tagPopularity
 * @property {number} travelerRatio
 * @property {number} localRatio
 * @property {Record<string, number>} userAttributes
 */

/**
 * @typedef {Object} BusinessReview
 * @property {string} id
 * @property {string} businessId
 * @property {string} author
 * @property {number} rating
 * @property {string} text
 * @property {string} [reply]
 * @property {number} createdAt
 */

/**
 * @typedef {Object} PlatformEvent
 * @property {string} id
 * @property {'fireworks' | 'festival' | 'limited' | 'seasonal' | 'popup' | 'exhibition'} type
 * @property {string} titleJa
 * @property {string} titleEn
 * @property {string} area
 * @property {string} startDate
 * @property {string} endDate
 * @property {boolean} showOnToday
 * @property {boolean} showOnVibes
 * @property {boolean} active
 */

/**
 * @typedef {Object} FeaturedCollection
 * @property {string} id
 * @property {string} slug
 * @property {string} titleJa
 * @property {string} titleEn
 * @property {string} descriptionJa
 * @property {string} descriptionEn
 * @property {string[]} spotIds
 * @property {string} season
 * @property {boolean} active
 */

/**
 * @typedef {Object} AdPlacement
 * @property {string} id
 * @property {'sponsor' | 'area' | 'event' | 'featured'} type
 * @property {string} labelJa
 * @property {string} labelEn
 * @property {string} [spotId]
 * @property {string} [businessId]
 * @property {string} [area]
 * @property {boolean} active
 * @property {boolean} isSponsored
 */

/**
 * @typedef {Object} AiPriorityConfig
 * @property {number} eventBoost
 * @property {number} sponsorBoost
 * @property {number} localBoost
 * @property {number} newStoreBoost
 * @property {number} trendingBoost
 */

/**
 * @typedef {Object} AdminMetrics
 * @property {number} dau
 * @property {number} mau
 * @property {number} newUsers
 * @property {Array<{area: string, count: number}>} popularAreas
 * @property {Array<{category: string, count: number}>} popularCategories
 * @property {Array<{spotId: string, name: string, count: number}>} popularSpots
 * @property {Array<{query: string, count: number}>} searchRanking
 * @property {Array<{spotId: string, name: string, count: number}>} saveRanking
 * @property {number} aiUsage
 * @property {number} plansCreated
 */

/**
 * @typedef {Object} PlatformUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'consumer' | 'owner' | 'admin'} role
 * @property {'active' | 'suspended' | 'reported'} status
 * @property {number} createdAt
 */

export const DEFAULT_AI_PRIORITY = {
  eventBoost: 15,
  sponsorBoost: 20,
  localBoost: 10,
  newStoreBoost: 12,
  trendingBoost: 8,
};

export const BUSINESS_EVENT_TYPES = [
  'limited_menu',
  'event',
  'campaign',
  'happy_hour',
  'popup',
];

export const COUPON_TYPES = ['percent', 'free_item', 'limited'];
