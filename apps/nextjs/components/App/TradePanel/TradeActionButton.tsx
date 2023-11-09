import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { DotFlashing, LongArrow, ShortArrow } from "components/Icons";
import { useToggleOpenPositionModal } from "@symmio-client/core/state/application/hooks";
import {
  ContextError,
  InvalidContext,
  useInvalidContext,
} from "components/InvalidContext";
import ErrorButton from "components/Button/ErrorButton";
import { titleCase } from "@symmio-client/core/utils/string";
import { useWebSocketStatus } from "@symmio-client/core/state/hedger/hooks";
import {
  useSetLimitPrice,
  useActiveMarket,
  useSetTypedValue,
  usePositionType,
} from "@symmio-client/core/state/trade/hooks";
import { useIsHavePendingTransaction } from "@symmio-client/core/state/transactions/hooks";
import { MainButton } from "components/Button";
import { RowStart } from "components/Row";
import useTradePage from "@symmio-client/core/hooks/useTradePage";
import { DEFAULT_PRECISION } from "@symmio-client/core/constants/misc";
import { calculateString } from "utils/calculationalString";
import { InputField, PositionType } from "@symmio-client/core/types/trade";
import { ConnectionStatus } from "@symmio-client/core/state/hedger/types";
import {
  useUserWhitelist,
  useIsTermsAccepted,
} from "@symmio-client/core/state/user/hooks";
import { WEB_SETTING } from "@symmio-client/core/config";

const OpenPositionButton = styled(MainButton)<{ longOrShort: boolean }>`
  &:focus,
  &:hover {
    background: ${({ longOrShort, theme }) =>
      longOrShort ? theme.hoverLong : theme.hoverShort};
  }
`;

const IconWrap = styled.div`
  position: absolute;
  right: 10px;
`;

export default function TradeActionButtons(): JSX.Element | null {
  const validatedContext = useInvalidContext();
  const market = useActiveMarket();
  const connectionStatus = useWebSocketStatus();

  const toggleShowTradeInfoModal = useToggleOpenPositionModal();
  const isPendingTxs = useIsHavePendingTransaction();

  const [calculationMode, setCalculationMode] = useState(false);
  const [calculationLoading, setCalculationLoading] = useState(false);

  const setLimitPrice = useSetLimitPrice();
  const setTypedValue = useSetTypedValue();
  const positionType = usePositionType();
  const userWhitelisted = useUserWhitelist();
  const isAcceptTerms = useIsTermsAccepted();

  const { formattedAmounts, state, balance } = useTradePage();

  const [outputTicker, pricePrecision] = useMemo(
    () =>
      market ? [market.symbol, market.pricePrecision] : ["", DEFAULT_PRECISION],
    [market]
  );
  function onEnterPress() {
    setCalculationLoading(true);
    setCalculationMode(false);
    const result = calculateString(
      formattedAmounts[0],
      balance,
      pricePrecision,
      "1"
    );
    setTypedValue(result, InputField.PRICE);
    setCalculationLoading(false);
  }
  //reset amounts when user switches to another orderType or market
  useEffect(() => {
    setLimitPrice("");
    setTypedValue("", InputField.PRICE);
  }, [market]); // eslint-disable-line react-hooks/exhaustive-deps
  if (validatedContext !== ContextError.VALID) {
    return <InvalidContext />;
  }

  if (WEB_SETTING.showSignModal && !isAcceptTerms) {
    return <MainButton disabled>Accept Terms Please</MainButton>;
  }

  if (calculationLoading) {
    return (
      <MainButton disabled>
        Waiting for Calculation
        <DotFlashing />
      </MainButton>
    );
  }
  if (isPendingTxs) {
    return (
      <MainButton disabled>
        Transacting <DotFlashing />
      </MainButton>
    );
  }

  if (calculationMode) {
    return <MainButton onClick={onEnterPress}>Calculate Amount</MainButton>;
  }

  if (connectionStatus !== ConnectionStatus.OPEN) {
    return (
      <ErrorButton
        state={state}
        disabled={true}
        exclamationMark={true}
        customText={"Hedger disconnected"}
      />
    );
  }

  if (state) {
    return <ErrorButton state={state} disabled={true} exclamationMark={true} />;
  }
  if (userWhitelisted === false) {
    return (
      <ErrorButton
        state={state}
        disabled={true}
        exclamationMark={true}
        customText={"You are not whitelisted"}
      />
    );
  }

  return (
    <RowStart>
      <OpenPositionButton
        onClick={() => toggleShowTradeInfoModal()}
        longOrShort={positionType === PositionType.LONG}
      >
        {titleCase(positionType)} {outputTicker}
        <IconWrap>
          {positionType === PositionType.LONG ? (
            <LongArrow
              width={19}
              height={11}
              color={"#0B0C0E"}
              style={{ marginLeft: "8px" }}
            />
          ) : (
            <ShortArrow
              width={19}
              height={11}
              color={"#0B0C0E"}
              style={{ marginLeft: "8px" }}
            />
          )}
        </IconWrap>
      </OpenPositionButton>
    </RowStart>
  );
}
