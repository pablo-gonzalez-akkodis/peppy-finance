import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { toast } from "react-hot-toast";

import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";

import { TransferTab } from "@symmio-client/core/types/transfer";
import { getRemainingTime } from "@symmio-client/core/utils/time";
import { COLLATERAL_TOKEN } from "@symmio-client/core/constants/tokens";
import { getTokenWithFallbackChainId } from "@symmio-client/core/utils/token";
import {
  formatCurrency,
  formatPrice,
  toBN,
} from "@symmio-client/core/utils/numbers";

import {
  useAccountPartyAStat,
  useActiveAccountAddress,
} from "@symmio-client/core/state/user/hooks";

import { useTransferCollateral } from "@symmio-client/core/callbacks/useTransferCollateral";

import { RowCenter } from "components/Row";
import { DotFlashing } from "components/Icons";

const RemainingWrap = styled(RowCenter)<{ cursor?: string }>`
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.primaryBlue};
  background: ${({ theme }) => theme.bg7};
  color: ${({ theme }) => theme.white};
  height: 40px;
  font-size: 12px;
  width: 162px;
  height: 40px;
  cursor: ${({ cursor }) => cursor ?? "progress"};
`;

const RemainingBlock = styled.div<{ width?: string }>`
  background: ${({ theme }) => theme.hoverGrad};
  opacity: 0.2;
  height: 100%;
  left: 0;
  bottom: 0;
  position: absolute;
  border-radius: 4px 0px 0px 4px;
  width: ${({ width }) => width ?? "unset"};
`;

const Text = styled(RowCenter)`
  font-weight: 500;
  font-size: 12px;
  color: ${({ theme }) => theme.primaryBlue};
`;

export default function WithdrawCooldown({
  formatedAmount,
  text,
}: {
  formatedAmount: boolean;
  text?: string;
}) {
  const { chainId } = useActiveWagmi();
  const activeAccountAddress = useActiveAccountAddress();
  const { accountBalance, withdrawCooldown, cooldownMA } =
    useAccountPartyAStat(activeAccountAddress);

  const collateralCurrency = getTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );
  const { callback: transferBalanceCallback, error: transferBalanceError } =
    useTransferCollateral(
      formatPrice(accountBalance, collateralCurrency?.decimals),
      TransferTab.WITHDRAW
    );
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const remainingPercent = useMemo(() => {
    const cooldownRemainPercent = toBN(currentTimestamp)
      .minus(withdrawCooldown)
      .div(cooldownMA)
      .times(100);
    return cooldownRemainPercent.gte(0) && cooldownRemainPercent.lte(100)
      ? cooldownRemainPercent.toFixed(0)
      : null;
  }, [cooldownMA, currentTimestamp, withdrawCooldown]);
  const { diff, hours, seconds, minutes } = getRemainingTime(
    toBN(withdrawCooldown).plus(cooldownMA).times(1000).toNumber()
  );

  const handleAction = useCallback(async () => {
    if (!transferBalanceCallback) {
      toast.error(transferBalanceError);
      return;
    }

    try {
      setAwaitingConfirmation(true);
      await transferBalanceCallback();
      setAwaitingConfirmation(false);
    } catch (e) {
      setAwaitingConfirmation(false);
      if (e instanceof Error) {
        console.log(e.message);
      } else {
        console.error(e);
      }
    }
  }, [transferBalanceCallback, transferBalanceError]);

  const fixedAccountBalance = formatPrice(
    accountBalance,
    collateralCurrency?.decimals
  );

  if (diff > 0) {
    return (
      <RemainingWrap>
        <Text>{`Withdraw in ${hours}:${minutes}:${seconds}`}</Text>
        <RemainingBlock width={`${remainingPercent}%`}></RemainingBlock>
      </RemainingWrap>
    );
  } else if (toBN(fixedAccountBalance).isGreaterThan(0)) {
    const balance = formatedAmount
      ? formatPrice(fixedAccountBalance, 2, true)
      : formatCurrency(fixedAccountBalance, 4, true);

    if (awaitingConfirmation) {
      return (
        <RemainingWrap cursor={"default"}>
          <Text>
            {text ?? `Withdraw ${balance} ${collateralCurrency?.symbol}`}
            <DotFlashing />
          </Text>
          <RemainingBlock width={`100%`}></RemainingBlock>
        </RemainingWrap>
      );
    }
    return (
      <RemainingWrap onClick={handleAction} cursor={"pointer"}>
        <Text>
          {text ?? `Withdraw ${balance} ${collateralCurrency?.symbol}`}
        </Text>
        <RemainingBlock width={`100%`}></RemainingBlock>
      </RemainingWrap>
    );
  } else {
    return <></>;
  }
}
