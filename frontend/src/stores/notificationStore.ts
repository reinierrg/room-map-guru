import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { INotification } from '../types/notification.type'

interface INotificationStore {
    notifications: INotification[]
    setNotification: (notifications: INotification[]) => void
    addNotification: (notification: INotification) => void
    deleteNotification: (notification_id: string) => void
}

export const useNotificationStore = create<INotificationStore>()(
    devtools(
        (set, get) => ({
            notifications: [],
            setNotification: (notifications: INotification[]) =>
                set({ notifications }),

            deleteNotification: (notification_id: string) => {
                const { notifications } = get()
                const newNotifications =
                    notifications.filter(
                        (notif) =>
                            notif.id.toString() !== notification_id.toString()
                    ) || []

                set({ notifications: newNotifications })
            },

            addNotification: (notification: INotification) => {
                const { notifications } = get()
                set({
                    notifications: [
                        ...notifications,
                        {
                            ...notification,
                            id: notification.id ?? crypto.randomUUID(),
                        },
                    ],
                })
            },
        }),
        { name: 'notification-store' }
    )
)
