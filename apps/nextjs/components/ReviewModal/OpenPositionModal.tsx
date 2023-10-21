import React, { useCallback, useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";
import toast from "react-hot-toast";

import { titleCase } from "@symmio-client/core/utils/string";
import { BN_ZERO, toBN } from "@symmio-client/core/utils/numbers";
import {
  DEFAULT_PRECISION,
  MARKET_ORDER_DEADLINE,
} from "@symmio-client/core/constants/misc";
import { useCollateralToken } from "@symmio-client/core/constants/tokens";
import { OrderType, PositionType } from "@symmio-client/core/types/trade";
import { getTokenWithFallbackChainId } from "@symmio-client/core/utils/token";

import { useLeverage } from "@symmio-client/core/state/user/hooks";
import { usePositionType } from "@symmio-client/core/state/trade/hooks";
import { ApplicationModal } from "@symmio-client/core/state/application/reducer";
import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import {
  useActiveMarket,
  useOrderType,
} from "@symmio-client/core/state/trade/hooks";
import { useIsHavePendingTransaction } from "@symmio-client/core/state/transactions/hooks";
import {
  useModalOpen,
  useToggleOpenPositionModal,
} from "@symmio-client/core/state/application/hooks";

import { useSentQuoteCallback } from "@symmio-client/core/callbacks/useSendQuote";
import useTradePage, {
  useLockedValues,
  useNotionalValue,
} from "@symmio-client/core/hooks/useTradePage";

import Column from "components/Column";
import { RowCenter } from "components/Row";
import InfoItem from "components/InfoItem";
import { MainButton, PrimaryButton } from "components/Button";
import { DisplayLabel } from "components/InputLabel";
import { ModalHeader, Modal } from "components/Modal";
import ErrorButton from "components/Button/ErrorButton";
import {
  DotFlashing,
  LongArrow,
  LottieCloverfield,
  ShortArrow,
} from "components/Icons";

const Wrapper = styled(Column)`
  gap: 16px;
  padding: 12px;
  overflow-y: scroll;
  height: auto;
`;

const AwaitingWrapper = styled(Column)`
  padding: 24px 0;
`;

const SummaryWrap = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text2};
  margin: 20px auto;
  max-width: 350px;
  text-align: center;
`;

const ConfirmWrap = styled(SummaryWrap)`
  font-size: 14px;
  margin: 0;
  margin-top: 20px;
`;

const LabelsWrapper = styled(Column)`
  gap: 12px;
`;

const OpenPositionButton = styled(PrimaryButton)<{ longOrShort: boolean }>`
  background: ${({ longOrShort, theme }) =>
    longOrShort ? theme.hoverLong : theme.hoverShort};

  &:focus,
  &:hover {
    background: ${({ longOrShort, theme }) =>
      longOrShort ? theme.hoverLong : theme.hoverShort};
  }
`;

const Data = styled(RowCenter)`
  width: 100%;
  padding: 5px;
  font-size: 12px;
  margin-left: 10px;
  color: ${({ theme }) => theme.text1};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 16px;
  `};
`;

const Separator = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.border2};
`;

const IconWrap = styled.div`
  position: absolute;
  right: 10px;
`;

export default function OpenPositionModal({
  data,
  summary,
}: {
  summary?: string;
  data?: string;
}) {
  const theme = useTheme();
  const { chainId } = useActiveWagmi();
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const isPendingTxs = useIsHavePendingTransaction();

  const orderType = useOrderType();
  const market = useActiveMarket();
  const userLeverage = useLeverage();
  const positionType = usePositionType();
  const toggleModal = useToggleOpenPositionModal();
  const modalOpen = useModalOpen(ApplicationModal.OPEN_POSITION);
  const COLLATERAL_TOKEN = useCollateralToken();
  const collateralCurrency = getTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );

  const { price, formattedAmounts, state } = useTradePage();

  const [symbol, asset, pricePrecision] = useMemo(
    () =>
      market
        ? [market.symbol, market.asset, market.pricePrecision]
        : ["", "", DEFAULT_PRECISION],
    [market]
  );

  const quantityAsset = useMemo(
    () =>
      toBN(formattedAmounts[1]).isNaN() ? BN_ZERO : toBN(formattedAmounts[1]),
    [formattedAmounts]
  );

  const notionalValue = useNotionalValue(quantityAsset.toString(), price);
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

  const { callback: tradeCallback, error: tradeCallbackError } =
    useSentQuoteCallback();

  const onTrade = useCallback(async () => {
    if (!tradeCallback) {
      toast.error(tradeCallbackError);
      return;
    }

    let error = "";
    try {
      setAwaitingConfirmation(true);
      await tradeCallback();
      setAwaitingConfirmation(false);
      toggleModal();
    } catch (e) {
      if (e instanceof Error) {
        error = e.message;
      } else {
        console.debug(e);

        error = "An unknown error occurred.";
      }
    }
    if (error) console.log(error);
    toggleModal();
    setAwaitingConfirmation(false);
  }, [toggleModal, tradeCallback, tradeCallbackError]);

  function getActionButtons(): JSX.Element | null {
    if (isPendingTxs) {
      return (
        <MainButton disabled>
          Transacting <DotFlashing />
        </MainButton>
      );
    }

    if (state) {
      return (
        <ErrorButton state={state} disabled={true} exclamationMark={true} />
      );
    }

    return (
      <OpenPositionButton
        onClick={() => onTrade()}
        longOrShort={positionType === PositionType.LONG}
      >
        {`${titleCase(positionType)} ${symbol}`}
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
    );
  }

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
      { title: "Platform Fee:", value: tradingFee },
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
    <Modal
      isOpen={modalOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      <ModalHeader
        onClose={toggleModal}
        title={`${positionType} ${symbol}-${asset}`}
        positionType={positionType}
      />
      {awaitingConfirmation ? (
        <AwaitingWrapper>
          <RowCenter>
            <LottieCloverfield />
          </RowCenter>

          <RowCenter>
            <SummaryWrap>{summary}</SummaryWrap>
          </RowCenter>

          <RowCenter>
            <ConfirmWrap>Confirm this transaction in your wallet</ConfirmWrap>
          </RowCenter>
        </AwaitingWrapper>
      ) : (
        <Wrapper>
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
          {data && (
            <>
              <Separator />
              <Data>{data}</Data>
            </>
          )}

          {!awaitingConfirmation && getActionButtons()}
        </Wrapper>
      )}
    </Modal>
  );
}
