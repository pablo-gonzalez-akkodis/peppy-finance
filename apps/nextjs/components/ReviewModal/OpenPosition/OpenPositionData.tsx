import React, { useMemo } from "react";
import styled, { useTheme } from "styled-components";

import InfoItem from "components/InfoItem";
import { DisplayLabel } from "components/InputLabel";
import ActionButton from "./ActionButton";
import Column from "components/Column";
import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import {
  useActiveMarket,
  useOrderType,
} from "@symmio-client/core/state/trade/hooks";
import { useLeverage } from "@symmio-client/core/state/user/hooks";
import { useCollateralToken } from "@symmio-client/core/constants/tokens";
import { useGetTokenWithFallbackChainId } from "@symmio-client/core/utils/token";
import useTradePage, {
  useLockedValues,
  useNotionalValue,
} from "@symmio-client/core/hooks/useTradePage";
import {
  DEFAULT_PRECISION,
  MARKET_ORDER_DEADLINE,
} from "@symmio-client/core/constants/misc";
import { formatAmount, toBN } from "@symmio-client/core/utils/numbers";
import { OrderType } from "@symmio-client/core/types/trade";

const LabelsWrapper = styled(Column)`
  gap: 12px;
`;

export default function OpenPositionData() {
  const theme = useTheme();
  const { chainId } = useActiveWagmi();

  const orderType = useOrderType();
  const market = useActiveMarket();
  const userLeverage = useLeverage();
  const COLLATERAL_TOKEN = useCollateralToken();
  const collateralCurrency = useGetTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );

  const { price, formattedAmounts } = useTradePage();

  const [symbol, pricePrecision] = useMemo(
    () =>
      market ? [market.symbol, market.pricePrecision] : ["", DEFAULT_PRECISION],
    [market]
  );
  const quantityAsset = useMemo(
    () => (toBN(formattedAmounts[1]).isNaN() ? "0" : formattedAmounts[1]),
    [formattedAmounts]
  );

  const notionalValue = useNotionalValue(quantityAsset, price);

  const { total: lockedValue } = useLockedValues(notionalValue);

  const tradingFee = useMemo(() => {
    const notionalValueBN = toBN(notionalValue);
    if (!market || notionalValueBN.isNaN()) return "-";
    return market.tradingFee
      ? `${notionalValueBN.times(market.tradingFee).toString()} ${
          collateralCurrency?.symbol
        }`
      : "ss-";
  }, [market, notionalValue, collateralCurrency?.symbol]);

  const info = useMemo(() => {
    const lockedValueBN = toBN(lockedValue);
    return [
      {
        title: "Locked Value:",
        value: `${
          lockedValueBN.isNaN() ? "0" : lockedValueBN.toFixed(pricePrecision)
        } ${collateralCurrency?.symbol}`,
      },
      { title: "Leverage:", value: `${userLeverage} X` },
      {
        title: "Open Price:",
        value: `${
          price === "" ? "-" : orderType === OrderType.MARKET ? "Market" : price
        }`,
        valueColor: theme.primaryBlue,
      },
      {
        title: "Platform Fee:",
        value: !toBN(tradingFee).isNaN()
          ? `${formatAmount(
              toBN(tradingFee).div(2),
              3,
              true
            )} (OPEN) / ${formatAmount(
              toBN(tradingFee).div(2),
              3,
              true
            )} (CLOSE) ${collateralCurrency?.symbol}`
          : `0 (OPEN) / 0 (CLOSE) ${collateralCurrency?.symbol}`,
      },
      {
        title: "Order Expire Time:",
        value: `${
          orderType === OrderType.MARKET
            ? `${MARKET_ORDER_DEADLINE} seconds`
            : "Unlimited"
        }`,
      },
    ];
  }, [
    lockedValue,
    pricePrecision,
    collateralCurrency?.symbol,
    userLeverage,
    price,
    orderType,
    theme.primaryBlue,
    tradingFee,
  ]);

  return (
    <React.Fragment>
      <LabelsWrapper>
        <DisplayLabel
          label="Position Value"
          value={toBN(lockedValue).toFixed(pricePrecision)}
          leverage={userLeverage}
          symbol={collateralCurrency?.symbol}
          precision={pricePrecision}
        />

        <DisplayLabel
          label="Receive"
          value={formattedAmounts[1]}
          symbol={symbol}
        />
      </LabelsWrapper>
      {info.map((info, index) => {
        return (
          <InfoItem
            label={info.title}
            amount={info.value}
            valueColor={info?.valueColor}
            key={index}
          />
        );
      })}

      <ActionButton />
    </React.Fragment>
  );
}
