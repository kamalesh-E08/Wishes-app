import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  autoApprove: boolean;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  twoFactorAuth: boolean;
  setAutoApprove: (val: boolean) => void;
  setNotificationsEnabled: (val: boolean) => void;
  setEmailNotifications: (val: boolean) => void;
  setTwoFactorAuth: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      autoApprove: false,
      notificationsEnabled: true,
      emailNotifications: true,
      twoFactorAuth: false,
      setAutoApprove: (val) => set({ autoApprove: val }),
      setNotificationsEnabled: (val) => set({ notificationsEnabled: val }),
      setEmailNotifications: (val) => set({ emailNotifications: val }),
      setTwoFactorAuth: (val) => set({ twoFactorAuth: val }),
    }),
    {
      name: 'wishes-settings-storage',
    }
  )
);
