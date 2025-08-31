import { useNotificationStore } from "../stores/notificationStore";

export const useNotification = () => {
  const { notifications, setNotification  } = useNotificationStore(
    (state) => state
  );
  return { notifications, setNotification  };
};