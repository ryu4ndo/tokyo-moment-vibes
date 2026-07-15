function hashArea(area) {
  let h = 0;
  for (let i = 0; i < area.length; i += 1) h = (h * 31 + area.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Mock weather — deterministic per area + hour */
export function getMockWeather(area = '渋谷', date = new Date()) {
  const hour = date.getHours();
  const month = date.getMonth() + 1;
  const seed = hashArea(area) + hour + month;

  let condition = 'clear';
  if (seed % 7 === 0 || (hour >= 18 && hour % 3 === 0)) condition = 'rain';
  else if (seed % 5 === 0 || hour >= 12) condition = 'cloudy';
  if (month === 1 || month === 2) {
    if (seed % 11 === 0) condition = 'snow';
  }

  const baseTemp = month >= 6 && month <= 9 ? 28 : month >= 3 && month <= 5 ? 18 : 10;
  const temperatureC = baseTemp + (seed % 6) - 3;

  const precipitationProbability =
    condition === 'rain' ? 70 + (seed % 25) : condition === 'snow' ? 60 : condition === 'cloudy' ? 30 : 10;

  return {
    condition,
    temperatureC,
    precipitationProbability,
    humidity: 45 + (seed % 40),
    area,
    source: 'mock',
    updatedAt: date.toISOString(),
  };
}
