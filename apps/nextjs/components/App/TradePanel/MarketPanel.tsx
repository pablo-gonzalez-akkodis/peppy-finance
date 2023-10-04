import React from "react";
import styled from "styled-components";

import { toBN } from "@symmio-client/core/utils/numbers";

import { PositionType } from "@symmio-client/core/types/trade";
import { COLLATERAL_TOKEN } from "@symmio-client/core/constants/tokens";
import { getTokenWithFallbackChainId } from "@symmio-client/core/utils/token";

import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import {
  useActiveMarket,
  usePositionType,
} from "@symmio-client/core/state/trade/hooks";

import { RowBetween, RowEnd } from "components/Row";
import { InnerCard } from "components/Card";
import SlippageTolerance from "components/App/SlippageTolerance";
import useBidAskPrice from "@symmio-client/core/hooks/useBidAskPrice";

const PriceWrap = styled(InnerCard)`
  padding-top: 8px;
  & > * {
    &:last-child {
      height: 28px;
      margin-top: 12px;
    }
  }
`;

const Title = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 12px;
  font-weight: 400;
`;

export const InputAmount = styled.input.attrs({ type: "number" })<{
  active?: boolean;
}>`
  border: 0;
  outline: none;
  width: 100%;
  margin-right: 2px;
  margin-left: 2px;
  font-size: 12px;
  background: transparent;
  color: ${({ theme, active }) => (active ? theme.text0 : theme.text2)};

  appearance: textfield;

  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export default function MarketPanel() {
  const { chainId } = useActiveWagmi();
  const market = useActiveMarket();
  const positionType = usePositionType();
  const collateralCurrency = getTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );
  const { ask, bid } = useBidAskPrice(market?.name, market?.pricePrecision);

  const lastMarketPrice = (() => {
    if (positionType === PositionType.LONG) {
      return ask;
    } else {
      return bid;
    }
  })();

  return (
    <>
      <PriceWrap>
        <RowBetween>
          <Title>Market Price</Title>
          <div>
            {toBN(lastMarketPrice).toFormat()} {collateralCurrency?.symbol}
          </div>
        </RowBetween>
        <RowBetween>
          <Title>Slippage</Title>
          <RowEnd>
            <SlippageTolerance />
          </RowEnd>
        </RowBetween>
      </PriceWrap>
    </>
  );
}
