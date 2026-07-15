/**
 * Data source switch — mock (default) or api
 * Set VITE_DATA_SOURCE=api in .env to use server endpoints
 */
export const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE === 'api' ? 'api' : 'mock';

export const isMockData = DATA_SOURCE === 'mock';
export const isApiData = DATA_SOURCE === 'api';
