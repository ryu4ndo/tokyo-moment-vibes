export const SESSION_KEY = 'tokyo-moment-vibes-session';

export const DEFAULT_USER_PROFILE = {
  name: '',
  avatarUrl: '',
  residence: '',
  defaultExperienceMode: 'local',
  notificationsEnabled: true,
  darkMode: true,
  onboardingCompleted: false,
};

export const AUTH_PROVIDERS = {
  apple: 'apple',
  google: 'google',
  guest: 'guest',
};

export function createGuestUser() {
  const id = `guest-${crypto.randomUUID?.() ?? Date.now()}`;
  return {
    id,
    provider: AUTH_PROVIDERS.guest,
    email: null,
    name: '',
    avatarUrl: '',
    createdAt: Date.now(),
  };
}

export function createOAuthUser(provider, { name, email, avatarUrl }) {
  const seed = `${provider}-${email ?? name}-${Date.now()}`;
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const id = `${provider}-${Math.abs(h)}`;
  return {
    id,
    provider,
    email: email ?? null,
    name: name ?? '',
    avatarUrl: avatarUrl ?? '',
    createdAt: Date.now(),
  };
}
