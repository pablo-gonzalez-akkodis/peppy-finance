import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeHttpRequest } from "@symmio-client/core/utils/http";
import { NotificationResponse, NotificationDetails } from "./types";
import { groupingNotification, toNotification } from "./updater";

export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async ({
    baseUrl,
    account,
    timestamp,
    start = 0,
    size = 10,
  }: {
    baseUrl: string | undefined;
    account: string;
    timestamp: number;
    start?: number;
    size?: number;
  }) => {
    if (!baseUrl) {
      throw new Error("baseUrl is empty");
    }

    const body = JSON.stringify({
      address: `${account}`,
      modify_time_gte: timestamp,
    });

    const { href: getNotificationsUrl } = new URL(
      `position-state/${start}/${size}`,
      baseUrl
    );
    let unreadNotifications: NotificationDetails[] = [];

    try {
      const [notificationsRes] = await Promise.allSettled([
        makeHttpRequest(getNotificationsUrl, {
          method: "POST",
          headers: [["Content-Type", "application/json"]],
          body,
        }),
      ]);

      if (notificationsRes.status === "fulfilled") {
        unreadNotifications = notificationsRes.value.position_state.map(
          (n: NotificationResponse) => {
            const notification: NotificationDetails = groupingNotification(
              toNotification(n)
            );
            return notification;
          }
        );
      }
    } catch (error) {
      console.error(error, "happened in getNotifications");
      return { unreadNotifications: [] };
    }
    return { unreadNotifications };
  }
);
