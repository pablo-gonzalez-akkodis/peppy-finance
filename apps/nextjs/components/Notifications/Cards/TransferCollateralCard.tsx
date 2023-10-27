import React from "react";

import DEPOSIT_USDT_ICON from "/public/static/images/etc/DepositFUSDT.svg";
import WITHDRAW_USDT_ICON from "/public/static/images/etc/WithdrawFUSDT.svg";
import DEPOSIT_USDC_ICON from "/public/static/images/etc/DepositUSDC.svg";
import WITHDRAW_USDC_ICON from "/public/static/images/etc/WithdrawUSDC.svg";

import { useCollateralToken } from "@symmio-client/core/constants/tokens";
import { SupportedChainId } from "@symmio-client/core/constants/chains";
import { Account } from "@symmio-client/core/types/user";
import { TransferTab } from "@symmio-client/core/types/transfer";
import { getTokenWithFallbackChainId } from "@symmio-client/core/utils/token";
import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";

import { NotificationDetails } from "@symmio-client/core/state/notifications/types";

import BaseItem from "components/Notifications/Cards/BaseCard";

export default function TransferCollateralCard({
  notification,
  account,
}: {
  notification: NotificationDetails;
  account: Account;
  loading?: boolean;
}): JSX.Element {
  const { chainId } = useActiveWagmi();
  const { modifyTime, transferAmount, transferType } = notification;
  const COLLATERAL_TOKEN = useCollateralToken();
  const collateralCurrency = getTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );
  const icon = useTransferTypeIcon(transferType);
  const text =
    transferType === TransferTab.DEALLOCATE
      ? `${transferType} submitted.`
      : `${transferType} successful.`;

  return (
    <BaseItem
      title={`${transferAmount} ${collateralCurrency?.symbol} ${transferType}`}
      text={text}
      icon={icon}
      timestamp={modifyTime}
      accountName={account.name}
    />
  );
}

function useTransferTypeIcon(transferType: TransferTab | undefined) {
  const { chainId } = useActiveWagmi();
  let icon;

  switch (chainId) {
    case SupportedChainId.BSC:
      icon =
        transferType === TransferTab.DEPOSIT
          ? DEPOSIT_USDT_ICON
          : WITHDRAW_USDT_ICON;
      break;
    default:
      icon =
        transferType === TransferTab.DEPOSIT
          ? DEPOSIT_USDC_ICON
          : WITHDRAW_USDC_ICON;
  }

  return icon;
}
