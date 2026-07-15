const MAX_SIGNALS = 80;

function trimSignals(list) {
  return list.slice(0, MAX_SIGNALS);
}

export function recordViewSignal(data, payload) {
  const entry = {
    vibeId: payload.vibeId,
    spotId: payload.spotId,
    category: payload.category,
    area: payload.area,
    priceRange: payload.priceRange,
    walkMinutes: payload.walkMinutes ?? 5,
    companion: payload.companion,
    experienceMode: payload.experienceMode,
    suitableFor: payload.suitableFor ?? [],
    experienceModes: payload.experienceModes ?? [],
    timestamp: Date.now(),
  };
  const views = trimSignals([entry, ...data.signals.views.filter((v) => v.vibeId !== payload.vibeId)]);
  return { ...data, signals: { ...data.signals, views } };
}

export function recordSaveSignal(data, payload) {
  const entry = {
    spotId: payload.spotId,
    category: payload.category,
    area: payload.area,
    priceRange: payload.priceRange,
    walkMinutes: payload.walkMinutes ?? 5,
    timestamp: Date.now(),
  };
  const saves = trimSignals([entry, ...data.signals.saves.filter((s) => s.spotId !== payload.spotId)]);
  return { ...data, signals: { ...data.signals, saves } };
}
