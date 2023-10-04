import { createAction } from "@reduxjs/toolkit";
import { NotificationDetails } from "./types";

export const addUnreadNotification = createAction<{
  notification: NotificationDetails;
}>("notifications/addUnreadNotification");
export const addReadNotification = createAction<{
  notification: NotificationDetails;
}>("notifications/addReadNotification");
export const setUnreadNotifications = createAction<{
  notifications: NotificationDetails[];
}>("notifications/setUnreadNotifications");
export const setReadNotifications = createAction<{
  notifications: NotificationDetails[];
}>("notifications/setReadNotifications");

export const readOneNotification = createAction<{
  notification: NotificationDetails;
}>("notifications/readOneNotification");

export const updateTimestamp = createAction<{ timestamp: string }>(
  "notifications/updateTimestamp"
);
export const updateIsNewNotification = createAction<{ flag: boolean }>(
  "notifications/updateIsNewNotification"
);

// export const readAllNotifications = createAction('notifications/readAllNotifications')
