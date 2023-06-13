import { create } from "zustand";

export type TNotification = {
  notificationContent: string;
  date: number;
};

interface NotificationState {
  notifications: TNotification[];
  setNotifications: (newNotification: TNotification) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (newNotification) =>
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    })),
}));
