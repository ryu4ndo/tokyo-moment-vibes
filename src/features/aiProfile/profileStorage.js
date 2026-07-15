import { DEFAULT_PROFILE_DATA, PROFILE_STORAGE_KEY } from './types';

export function loadProfileData() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE_DATA, signals: { views: [], saves: [] } };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE_DATA,
      ...parsed,
      signals: {
        views: parsed.signals?.views ?? [],
        saves: parsed.signals?.saves ?? [],
      },
      extensions: { ...DEFAULT_PROFILE_DATA.extensions, ...parsed.extensions },
    };
  } catch {
    return { ...DEFAULT_PROFILE_DATA, signals: { views: [], saves: [] } };
  }
}

export function saveProfileData(data) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}
