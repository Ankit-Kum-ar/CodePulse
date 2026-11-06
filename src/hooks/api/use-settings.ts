import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, extractData } from '@/lib/api-client';

// ==========================================
// Types
// ==========================================

export interface AppearancePreferences {
  theme: 'dark' | 'light' | 'system';
  accentColor: 'purple' | 'blue' | 'emerald' | 'orange' | 'pink';
  compactTableView: boolean;
  reducedMotion: boolean;
  defaultLandingTab: string;
}

export interface NotificationPreferences {
  battleChallenges: boolean;
  weeklyDigest: boolean;
  achievementUnlocks: boolean;
  leaderboardUpdates: boolean;
  challengeReminders: boolean;
  productUpdates: boolean;
}

export interface UserPreferences {
  appearance: AppearancePreferences;
  notifications: NotificationPreferences;
}

// ==========================================
// Default Constants
// ==========================================

export const DEFAULT_APPEARANCE_PREFERENCES: AppearancePreferences = {
  theme: 'dark',
  accentColor: 'purple',
  compactTableView: false,
  reducedMotion: false,
  defaultLandingTab: 'dashboard',
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  battleChallenges: true,
  weeklyDigest: true,
  achievementUnlocks: true,
  leaderboardUpdates: false,
  challengeReminders: true,
  productUpdates: true,
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  appearance: DEFAULT_APPEARANCE_PREFERENCES,
  notifications: DEFAULT_NOTIFICATION_PREFERENCES,
};

export const SETTINGS_STORAGE_KEY = 'devbattle_user_preferences';

// ==========================================
// Local Storage Helpers
// ==========================================

export function loadLocalPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(raw);
    return {
      appearance: {
        ...DEFAULT_APPEARANCE_PREFERENCES,
        ...(parsed.appearance || {}),
      },
      notifications: {
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        ...(parsed.notifications || {}),
      },
    };
  } catch (err) {
    console.warn('Could not parse stored preferences, using defaults:', err);
    return DEFAULT_PREFERENCES;
  }
}

export function saveLocalPreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.warn('Failed to save preferences to localStorage:', err);
  }
}

// ==========================================
// Custom Hook for Persistent Preferences
// ==========================================

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateSettingsMutation = useUpdateSettings();

  // Hydrate preferences from localStorage on client mount
  useEffect(() => {
    const stored = loadLocalPreferences();
    setPreferences(stored);
    setIsLoaded(true);
  }, []);

  // Update appearance settings
  const updateAppearance = useCallback(
    (partial: Partial<AppearancePreferences>) => {
      setPreferences((prev) => {
        const next: UserPreferences = {
          ...prev,
          appearance: { ...prev.appearance, ...partial },
        };
        saveLocalPreferences(next);
        setLastSaved(new Date());

        // Sync with backend asynchronously
        try {
          updateSettingsMutation.mutate({ appearance: next.appearance });
        } catch {}

        return next;
      });
    },
    [updateSettingsMutation]
  );

  // Update notification settings
  const updateNotifications = useCallback(
    (partial: Partial<NotificationPreferences>) => {
      setPreferences((prev) => {
        const next: UserPreferences = {
          ...prev,
          notifications: { ...prev.notifications, ...partial },
        };
        saveLocalPreferences(next);
        setLastSaved(new Date());

        // Sync with backend asynchronously
        try {
          updateSettingsMutation.mutate({ notifications: next.notifications });
        } catch {}

        return next;
      });
    },
    [updateSettingsMutation]
  );

  // Reset all preferences back to defaults
  const resetToDefaults = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    saveLocalPreferences(DEFAULT_PREFERENCES);
    setLastSaved(new Date());

    try {
      updateSettingsMutation.mutate(DEFAULT_PREFERENCES);
    } catch {}

    return DEFAULT_PREFERENCES;
  }, [updateSettingsMutation]);

  return {
    preferences,
    isLoaded,
    lastSaved,
    updateAppearance,
    updateNotifications,
    resetToDefaults,
  };
}

// ==========================================
// Existing API Queries & Mutations
// ==========================================

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await apiClient.get('/settings');
      return extractData(response);
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.put('/settings', data);
      return extractData(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.put('/users/profile', data);
      return extractData(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'current-user'] });
    },
  });
}
