import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AUTH_PROVIDERS,
  createGuestUser,
  createOAuthUser,
  DEFAULT_USER_PROFILE,
  SESSION_KEY,
} from '@/features/auth/types';
import {
  applyUserSnapshot,
  collectCurrentSnapshot,
  loadUserSnapshot,
  saveUserSnapshot,
} from '@/features/auth/userDataSync';
import { useLocale } from '@/locales/LocaleContext';
import { useToast } from '@/contexts/ToastContext';
import {
  isSupabaseEnabled,
  signInWithGoogle,
  signInWithApple,
  signInWithEmail,
  signOut as supabaseSignOut,
  onAuthStateChange,
  getSession,
} from '@/services/auth';
import { ensureProfile } from '@/services/profile';
import { ServiceError } from '@/types/api';

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(session) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children, onDataHydrate }) {
  const { locale, setLocale } = useLocale();
  const { showToast } = useToast();
  const [session, setSession] = useState(loadSession);
  const [userProfile, setUserProfile] = useState(() => {
    const s = loadSession();
    const snap = s ? loadUserSnapshot(s.user.id) : null;
    return { ...DEFAULT_USER_PROFILE, ...(snap?.userProfile ?? {}) };
  });
  const [isHydrating, setIsHydrating] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(() => isSupabaseEnabled);
  const [authError, setAuthError] = useState(null);
  const syncTimer = useRef(null);
  const hydratedRef = useRef(false);

  const isAuthenticated = Boolean(session?.user?.id);

  const handleAuthError = useCallback(
    (error, fallbackMessage) => {
      const message = error instanceof ServiceError ? error.message : fallbackMessage;
      setAuthError(message);
      showToast({ message, type: 'error' });
    },
    [showToast],
  );

  const syncNow = useCallback(() => {
    if (!session?.user?.id) return;
    const snapshot = collectCurrentSnapshot(userProfile, locale);
    saveUserSnapshot(session.user.id, snapshot);
  }, [session, userProfile, locale]);

  const scheduleSync = useCallback(() => {
    if (!session?.user?.id) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(syncNow, 800);
  }, [session, syncNow]);

  useEffect(() => {
    scheduleSync();
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [userProfile, locale, scheduleSync]);

  const completeLogin = useCallback(
    async (user, profileOverrides = {}) => {
      setIsHydrating(true);
      setAuthError(null);
      const existing = loadUserSnapshot(user.id);

      let remoteProfile = null;
      if (isSupabaseEnabled) {
        try {
          remoteProfile = await ensureProfile(user.id, {
            name: profileOverrides.name || user.name,
            avatar: profileOverrides.avatarUrl || user.avatarUrl,
            mode: user.provider === 'guest' ? 'local' : 'local',
          });
        } catch (e) {
          handleAuthError(e, 'Profile sync failed');
        }
      }

      const mergedProfile = {
        ...DEFAULT_USER_PROFILE,
        ...existing?.userProfile,
        ...profileOverrides,
        name:
          profileOverrides.name ||
          remoteProfile?.name ||
          user.name ||
          existing?.userProfile?.name ||
          '',
        avatarUrl:
          profileOverrides.avatarUrl ||
          remoteProfile?.avatar ||
          user.avatarUrl ||
          existing?.userProfile?.avatarUrl ||
          '',
        defaultExperienceMode:
          remoteProfile?.mode === 'traveler' ? 'traveler' : existing?.userProfile?.defaultExperienceMode ?? 'local',
      };

      if (existing) {
        applyUserSnapshot(existing);
        if (existing.locale === 'en' || existing.locale === 'ja') setLocale(existing.locale);
      } else {
        const snapshot = collectCurrentSnapshot(mergedProfile, locale);
        saveUserSnapshot(user.id, { ...snapshot, userProfile: mergedProfile });
      }

      const nextSession = { user, loggedInAt: Date.now() };
      setSession(nextSession);
      persistSession(nextSession);
      setUserProfile(mergedProfile);

      await onDataHydrate?.();
      setIsHydrating(false);
    },
    [locale, onDataHydrate, setLocale, handleAuthError],
  );

  useEffect(() => {
    if (!isSupabaseEnabled) {
      setIsAuthLoading(false);
      return undefined;
    }

    getSession()
      .then((user) => {
        if (user && !hydratedRef.current) {
          hydratedRef.current = true;
          completeLogin(user, { name: user.name, avatarUrl: user.avatarUrl });
        }
      })
      .catch((e) => handleAuthError(e, 'Session restore failed'))
      .finally(() => setIsAuthLoading(false));

    return onAuthStateChange((user, event) => {
      if (event === 'SIGNED_IN' && user) {
        completeLogin(user, { name: user.name, avatarUrl: user.avatarUrl });
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        persistSession(null);
        setUserProfile({ ...DEFAULT_USER_PROFILE });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loginWithApple = useCallback(async () => {
    if (isSupabaseEnabled) {
      try {
        setAuthError(null);
        await signInWithApple();
      } catch (e) {
        handleAuthError(e, 'Apple sign-in failed');
      }
      return;
    }
    const user = createOAuthUser(AUTH_PROVIDERS.apple, {
      name: locale === 'en' ? 'Tokyo Explorer' : '東京トラベラー',
      email: 'apple.user@privaterelay.appleid.com',
      avatarUrl: '',
    });
    await completeLogin(user, { name: user.name });
  }, [completeLogin, locale, handleAuthError]);

  const loginWithGoogle = useCallback(async () => {
    if (isSupabaseEnabled) {
      try {
        setAuthError(null);
        await signInWithGoogle();
      } catch (e) {
        handleAuthError(e, 'Google sign-in failed');
      }
      return;
    }
    const user = createOAuthUser(AUTH_PROVIDERS.google, {
      name: locale === 'en' ? 'Alex Tanaka' : '田中 アレックス',
      email: 'alex.tanaka@gmail.com',
      avatarUrl: '',
    });
    await completeLogin(user, { name: user.name });
  }, [completeLogin, locale, handleAuthError]);

  const loginWithEmail = useCallback(
    async (email, password) => {
      if (!isSupabaseEnabled) {
        handleAuthError(new ServiceError('Supabase not configured', 'SUPABASE_DISABLED'), 'Email login unavailable');
        return;
      }
      try {
        setAuthError(null);
        setIsHydrating(true);
        const user = await signInWithEmail({ email, password });
        await completeLogin(user, { name: user.name, avatarUrl: user.avatarUrl });
      } catch (e) {
        handleAuthError(e, 'Email sign-in failed');
        setIsHydrating(false);
      }
    },
    [completeLogin, handleAuthError],
  );

  const loginAsGuest = useCallback(async () => {
    const user = createGuestUser();
    const name = locale === 'en' ? 'Guest' : 'ゲスト';
    await completeLogin({ ...user, name }, { name });
  }, [completeLogin, locale]);

  const logout = useCallback(async () => {
    syncNow();
    if (isSupabaseEnabled) {
      try {
        await supabaseSignOut();
      } catch (e) {
        handleAuthError(e, 'Sign out failed');
      }
    }
    setSession(null);
    persistSession(null);
    setUserProfile({ ...DEFAULT_USER_PROFILE });
  }, [syncNow, handleAuthError]);

  const updateProfile = useCallback((updates) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
    scheduleSync();
  }, [scheduleSync]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const displayName = userProfile.name || session?.user?.name || (locale === 'en' ? 'Guest' : 'ゲスト');
  const avatarUrl =
    userProfile.avatarUrl ||
    session?.user?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&size=128`;

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      userProfile,
      displayName,
      avatarUrl,
      isAuthenticated,
      isHydrating,
      isAuthLoading,
      authError,
      isSupabaseEnabled,
      loginWithApple,
      loginWithGoogle,
      loginWithEmail,
      loginAsGuest,
      logout,
      updateProfile,
      syncNow,
      clearAuthError,
      provider: session?.user?.provider ?? null,
    }),
    [
      session,
      userProfile,
      displayName,
      avatarUrl,
      isAuthenticated,
      isHydrating,
      isAuthLoading,
      authError,
      loginWithApple,
      loginWithGoogle,
      loginWithEmail,
      loginAsGuest,
      logout,
      updateProfile,
      syncNow,
      clearAuthError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
