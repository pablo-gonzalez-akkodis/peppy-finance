import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeHttpRequest } from "../../utils/http";
import {
  NotificationResponse,
  NotificationDetails,
  NotificationUrlResponseType,
} from "./types";
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
        makeHttpRequest<NotificationUrlResponseType>(getNotificationsUrl, {
          method: "POST",
          headers: [["Content-Type", "application/json"]],
          body,
        }),
      ]);

      if (notificationsRes.status === "fulfilled" && notificationsRes.value) {
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
