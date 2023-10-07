import { useCallback } from "react";
import find from "lodash/find";

import { useAppDispatch, useAppSelector } from "..";
import { NotificationDetails } from "./types";
import {
  addReadNotification,
  addUnreadNotification,
  readOneNotification,
  updateIsNewNotification,
} from "./actions";

export function useUnreadNotifications(): NotificationDetails[] {
  const unreadNotification: NotificationDetails[] = useAppSelector(
    (state) => state.notifications.unreadNotification
  );
  return unreadNotification.filter((notification) => notification.showInModal);
}

export function useReadNotifications(): NotificationDetails[] {
  const readNotification: NotificationDetails[] = useAppSelector(
    (state) => state.notifications.readNotification
  );
  return readNotification.filter((notification) => notification.showInModal);
}

export function usePartialFillNotifications() {
  const readNotification: NotificationDetails[] = useAppSelector(
    (state) => state.notifications.readNotification
  );
  const unreadNotification: NotificationDetails[] = useAppSelector(
    (state) => state.notifications.unreadNotification
  );
  return [...readNotification, ...unreadNotification].filter(
    (notification) => !notification.showInModal
  );
}

export function useLastUpdateTimestamp() {
  const lastUpdateTimestamp = useAppSelector(
    (state) => state.notifications.lastUpdateTimestamp
  );
  return lastUpdateTimestamp;
}

export function useNewNotification() {
  const isNewNotification = useAppSelector(
    (state) => state.notifications.isNewNotification
  );
  return isNewNotification;
}

export function useSetNewNotificationFlag() {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    dispatch(updateIsNewNotification({ flag: true }));
    setTimeout(() => dispatch(updateIsNewNotification({ flag: false })), 1000);
  }, [dispatch]);
}

export function useNotificationAdderCallback(): (
  notification: NotificationDetails,
  readOrUnread: "read" | "unread"
) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (notification: NotificationDetails, readOrUnread: "read" | "unread") => {
      const { notificationType } = notification;
      if (!notificationType) return;
      if (readOrUnread === "read")
        dispatch(addReadNotification({ notification }));
      else dispatch(addUnreadNotification({ notification }));
    },
    [dispatch]
  );
}

export function useMarkAsReadNotificationCallback(): (
  notification: NotificationDetails
) => void {
  const dispatch = useAppDispatch();
  const readNotifications = useReadNotifications();
  return useCallback(
    (notification: NotificationDetails) => {
      const { quoteId, notificationType } = notification;
      const existedNotification = find(readNotifications, {
        quoteId,
        notificationType,
      });
      if (!quoteId) return;
      if (existedNotification) {
        console.log("mark as read existed notification.", quoteId);
        return;
      }
      dispatch(readOneNotification({ notification }));
    },
    [dispatch, readNotifications]
  );
}

export function useMarkAsReadAllNotificationsCallback(): () => void {
  const dispatch = useAppDispatch();
  const unReadNotifications = useUnreadNotifications();

  return useCallback(() => {
    unReadNotifications.map((notification) => {
      return dispatch(readOneNotification({ notification }));
    });
  }, [dispatch, unReadNotifications]);
}

// export function addNotificationFromTxs(): (
//   response: TransactionResponse,
//   info: TransactionInfo,
//   summary?: string
// ) => void {
//   return useCallback(
//     (response: TransactionResponse, info: TransactionInfo, summary?: string) => {
//       const notification: NotificationDetails = {
//         id: response.hash,
//         quoteId: null,
//         counterpartyAddress: null,
//         filledAmountOpen: null,
//         filledAmountClose: null,
//         lastSeenAction: null,
//         actionStatus: null,
//         failureType: null,
//         failureMessage: null,
//         stateType: StateType.REPORT,
//         notificationType: null,
//         createTime: `${Math.floor(Date.now() / 1000)}`,
//         modifyTime: `${Math.floor(Date.now() / 1000)}`,
//         withdrawAmount: undefined,
//         depositAmount: undefined,
//         version: null,
//       }

//       switch (info.type) {
//         case TransactionType.TRADE:
//           notification.notificationType = NotificationType.TRADE
//         case TransactionType.CANCEL:
//           notification.notificationType = NotificationType.CANCEL
//         case TransactionType.TRANSFER_COLLATERAL:
//           notification.notificationType = NotificationType.TRANSFER_COLLATERAL
//         case TransactionType.MINT:
//           notification.notificationType = NotificationType.MINT_COLLATERAL
//       }

//       adder(notification, 'unread')
//     },
//     [adder]
//   )
// }
