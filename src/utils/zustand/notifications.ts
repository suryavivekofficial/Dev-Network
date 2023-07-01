import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TNotification {
  message: string;
  date: number;
}

interface NotificationState {
  notifications: TNotification[];
  setNotifications: (newNotification: {
    message: string;
    date: number;
  }) => void;
}

export const useNotificationStore = create(
  persist<NotificationState>(
    (set) => ({
      notifications: [],
      setNotifications: (newNotification) => {
        set((state) => {
          if (!state.notifications.includes(newNotification)) {
            return { notifications: [newNotification, ...state.notifications] };
          }
          return state;
        });
      },
    }),
    {
      name: "notifications",
      skipHydration: true,
    }
  )
);
