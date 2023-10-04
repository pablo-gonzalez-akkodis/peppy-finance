import React from "react";
import { useTheme } from "styled-components";

import LIQUIDATION_ALERT_ICON from "/public/static/images/etc/RedErrorTriangle.svg";

import { Account } from "@symmio-client/core/types/user";

import { LiquidationText } from "./styles";
import { NotificationDetails } from "@symmio-client/core/state/notifications/types";
import BaseItem from "components/Notifications/Cards/BaseCard";

export default function LiquidationAlertCard({
  notification,
  account,
  loading,
}: {
  notification: NotificationDetails;
  account: Account;
  loading?: boolean;
}): JSX.Element {
  const theme = useTheme();
  const { modifyTime } = notification;

  return (
    <BaseItem
      title={"Liquidation Alert"}
      text={
        <LiquidationText>
          <div>[{account.name}] Account Health:</div>
          <div>3.64%</div>
        </LiquidationText>
      }
      icon={LIQUIDATION_ALERT_ICON}
      timestamp={modifyTime}
      loading={loading}
      accountName={account.name}
      bg={theme.bgLoose}
      border={theme.red1}
    />
  );
}
