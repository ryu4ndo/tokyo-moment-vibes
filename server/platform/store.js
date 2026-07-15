export { getStore, persistStore, initPlatformData, isUsingDatabase } from './dataAccess.js';

export function getBusinessAnalytics(businessId) {
  const seed = businessId.split('').reduce((h, c) => h + c.charCodeAt(0), 0);
  const hours = ['6', '12', '18', '21'];
  const days = ['月', '火', '水', '木', '金', '土', '日'];
  return {
    businessId,
    views: 1200 + (seed % 800),
    saves: 180 + (seed % 100),
    aiRecommendations: 420 + (seed % 200),
    hourlyViews: Object.fromEntries(hours.map((h, i) => [h, 100 + (seed % 50) * (i + 1)])),
    weekdayViews: Object.fromEntries(days.map((d, i) => [d, 80 + (seed % 40) * (i % 3 + 1)])),
    tagPopularity: { date: 45, nightview: 38, local: 52, cafe: 30 },
    travelerRatio: 0.35 + (seed % 20) / 100,
    localRatio: 0.65 - (seed % 20) / 100,
    userAttributes: { couple: 40, solo: 35, friends: 25 },
  };
}

export function generateAiBusinessAdvice(analytics, business, locale = 'ja') {
  const isEn = locale === 'en';
  const tips = [];
  const peakHour = Object.entries(analytics.hourlyViews).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (peakHour && Number(peakHour) >= 18) {
    tips.push(isEn ? 'Evening visits dominate — consider a night-only menu.' : '夜の利用が多いため、夜限定メニューがおすすめです。');
  }
  if (analytics.travelerRatio > 0.4) {
    tips.push(isEn ? 'International visitors are growing.' : '外国人ユーザーが増えています。');
  }
  if ((business?.photos?.length ?? 0) < 3) {
    tips.push(isEn ? 'Adding more photos could improve save rates.' : '写真を追加すると保存率が上がる可能性があります。');
  }
  return tips.length ? tips : [isEn ? 'Keep your hours updated for AI picks.' : '営業時間を最新に保つとAIおすすめに載りやすくなります。'];
}
