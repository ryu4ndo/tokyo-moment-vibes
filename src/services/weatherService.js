import { isApiData } from '@/config/dataSource';
import { getApi } from './apiClient';
import { getMockWeather } from '@/domain/mock/weatherMock';

export async function fetchWeather(area = '渋谷') {
  if (isApiData) {
    const params = new URLSearchParams({ area });
    const { weather } = await getApi(`/api/weather?${params}`);
    return weather;
  }
  return getMockWeather(area);
}

export function getWeatherSync(area = '渋谷') {
  return getMockWeather(area);
}
