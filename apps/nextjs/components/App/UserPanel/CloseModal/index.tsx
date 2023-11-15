import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";
import toast from "react-hot-toast";
import BigNumber from "bignumber.js";

import { WEB_SETTING } from "@symmio-client/core/config";
import { Quote } from "@symmio-client/core/types/quote";
import { makeHttpRequest } from "@symmio-client/core/utils/http";
import { PriceRange } from "@symmio-client/core/state/hedger/types";
import {
  ErrorState,
  OrderType,
  PositionType,
} from "@symmio-client/core/types/trade";
import {
  BN_ZERO,
  formatAmount,
  toBN,
  formatPrice,
} from "@symmio-client/core/utils/numbers";
import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import { MARKET_PRICE_COEFFICIENT } from "@symmio-client/core/constants/misc";
import { useCollateralToken } from "@symmio-client/core/constants/tokens";
import { useGetTokenWithFallbackChainId } from "@symmio-client/core/utils/token";
import { calculateString, calculationPattern } from "utils/calculationalString";

import {
  useAccountPartyAStat,
  useAccountUpnl,
  useActiveAccount,
} from "@symmio-client/core/state/user/hooks";
import { useMarketData } from "@symmio-client/core/state/hedger/hooks";

import { useMarket } from "@symmio-client/core/hooks/useMarkets";
import { getAppNameHeader } from "@symmio-client/core/state/hedger/thunks";

import {
  useClosingLastMarketPrice,
  useQuoteUpnlAndPnl,
  useQuoteLeverage,
} from "@symmio-client/core/hooks/useQuotes";
import { useHedgerInfo } from "@symmio-client/core/state/hedger/hooks";
import { useIsHavePendingTransaction } from "@symmio-client/core/state/transactions/hooks";

import { useClosePosition } from "@symmio-client/core/callbacks/useClosePosition";
import { useAppName } from "@symmio-client/core/state/chains/hooks";

import ConnectWallet from "components/ConnectWallet";
import { TabModal } from "components/Tab";
import { Modal, ModalHeader } from "components/Modal";
import { CustomInputBox2 } from "components/InputBox";
import { PrimaryButton } from "components/Button";
import { DotFlashing } from "components/Icons";
import MarketClosePanel from "./MarketClose";
import LimitClose from "./LimitClose";
import Column from "components/Column";
import InfoItem, { DataRow, Label } from "components/InfoItem";
import { PnlValue } from "components/App/UserPanel/Common";
import GuidesDropDown from "components/App/UserPanel/CloseModal/GuidesDropdown";
import ErrorButton from "components/Button/ErrorButton";

const Wrapper = styled(Column)`
  padding: 12px;
  padding-top: 0;
  & > * {
    &:nth-child(2) {
      margin-top: 16px;
    }
    &:nth-child(3) {
      margin-top: 16px;
    }
    &:nth-child(4) {
      margin-top: 20px;
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`;

const MainButton = styled(PrimaryButton).attrs({
  height: "48px",
})`
  border-radius: 8px;
  font-weight: 700;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 18px;
  gap: 16px;
`;
interface FetchPriceRangeResponseType {
  max_price: number;
  min_price: number;
}
export default function CloseModal({
  modalOpen,
  toggleModal,
  quote,
}: {
  modalOpen: boolean;
  toggleModal: () => void;
  quote: Quote | null;
}) {
  const theme = useTheme();
  const { chainId } = useActiveWagmi();
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [activeTab, setActiveTab] = useState(OrderType.LIMIT);
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
  const [awaitingCloseConfirmation, setAwaitingCloseConfirmation] =
    useState(false);
  const isPendingTxs = useIsHavePendingTransaction();
  const appName = useAppName();

  const { accountAddress: account } = useActiveAccount() || {};
  const { CVA, partyAMM, LF, openedPrice, marketId, positionType } =
    quote || {};
  const COLLATERAL_TOKEN = useCollateralToken();
  const collateralCurrency = useGetTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );

  const market = useMarket(marketId);
  const {
    name: marketName,
    symbol,
    quantityPrecision,
    pricePrecision,
    minAcceptableQuoteValue,
  } = market || {};
  const correctOpenPrice = formatPrice(openedPrice ?? "0", pricePrecision);
  const marketData = useMarketData(marketName);
  const { upnl } = useAccountUpnl() || {};
  const { markPrice } = marketData || {};
  const { baseUrl, fetchData } = useHedgerInfo() || {};
  const [calculationMode, setCalculationMode] = useState(false);
  const [calculationLoading, setCalculationLoading] = useState(false);
  const markPriceBN = useMemo(
    () => toBN(markPrice ?? "0").toString(),
    [markPrice]
  );
  const lastMarketPrice = useClosingLastMarketPrice(quote, market);

  const { allocatedBalance, lockedCVA, lockedLF } =
    useAccountPartyAStat(account);

  const leverage = useQuoteLeverage(quote ?? ({} as Quote));
  const [marketUpnlBN] = useQuoteUpnlAndPnl(
    quote ?? ({} as Quote),
    markPriceBN,
    undefined,
    undefined
  );
  const [, limitPnl] = useQuoteUpnlAndPnl(
    quote || ({} as Quote),
    marketData?.markPrice || 0,
    size,
    price
  );

  useEffect(() => {
    async function fetchPriceRange() {
      try {
        if (fetchData && marketName && baseUrl) {
          const { href: priceRangeUrl } = new URL(
            `price-range/${marketName}`,
            baseUrl
          );
          const tempResponse =
            await makeHttpRequest<FetchPriceRangeResponseType>(
              priceRangeUrl,
              getAppNameHeader(appName)
            );
          if (!tempResponse) return;
          const priceRangeRes = tempResponse;

          const priceRange: PriceRange = {
            name: marketName,
            minPrice: priceRangeRes.min_price,
            maxPrice: priceRangeRes.max_price,
          };
          setPriceRange(priceRange);
          return;
        }
        setPriceRange(null);
      } catch (err) {
        setPriceRange(null);
      }
    }
    fetchPriceRange();
  }, [appName, baseUrl, fetchData, marketName]);

  const { callback: closeCallback, error } = useClosePosition(
    quote,
    activeTab,
    price,
    size
  );

  const quoteLockedMargin = useMemo(() => {
    return CVA && partyAMM && LF
      ? toBN(CVA).plus(partyAMM).plus(LF).toString()
      : BN_ZERO.toString();
  }, [CVA, LF, partyAMM]);

  const outOfRangePrice = useMemo(() => {
    // check limit price range)
    if (!priceRange || !quote) return false;
    const { name, maxPrice, minPrice } = priceRange;
    if (activeTab === OrderType.LIMIT && marketName === name) {
      if (quote.positionType === PositionType.LONG) {
        return toBN(price).isGreaterThan(maxPrice);
      } else {
        return toBN(price).isLessThan(minPrice);
      }
    }
    return false;
  }, [priceRange, marketName, quote, activeTab, price]);

  const balanceTitle = useMemo(() => {
    if (!quote) return;
    if (quote.positionType === PositionType.LONG) {
      return "Bid Price:";
    } else {
      return "Ask Price:";
    }
  }, [quote]);

  const availableAmount = useMemo(
    () =>
      quote && quantityPrecision !== null && quantityPrecision !== undefined
        ? toBN(quote.quantity)
            .minus(quote.closedAmount)
            .toFixed(quantityPrecision)
        : "0",
    [quote, quantityPrecision]
  );

  const postSolvencyValue = useMemo(() => {
    if (!quote) return BN_ZERO.toString();

    const { CVA, LF, positionType } = quote;

    if (activeTab === OrderType.LIMIT) {
      const priceBN = toBN(price);
      if (
        (positionType === PositionType.LONG &&
          priceBN.minus(markPriceBN).gt(0)) ||
        (positionType === PositionType.SHORT &&
          toBN(markPriceBN).minus(priceBN).gt(0))
      ) {
        return availableAmount;
      }
    }

    const quoteUnlockedAmount = toBN(CVA).plus(LF).div(availableAmount);
    const effectivePrice =
      activeTab === OrderType.MARKET
        ? toBN(markPriceBN).times(MARKET_PRICE_COEFFICIENT - 1)
        : toBN(markPriceBN).minus(price).abs();

    const numerator = toBN(lockedCVA)
      .plus(lockedLF)
      .minus(allocatedBalance)
      .minus(upnl);
    const denominator = quoteUnlockedAmount.minus(effectivePrice);
    if (denominator.isGreaterThanOrEqualTo(0)) return availableAmount;
    return formatPrice(
      BigNumber.min(numerator.div(denominator), availableAmount),
      quantityPrecision
    );
  }, [
    activeTab,
    allocatedBalance,
    availableAmount,
    lockedCVA,
    lockedLF,
    markPriceBN,
    price,
    quantityPrecision,
    quote,
    upnl,
  ]);

  const availableToClose = useMemo(() => {
    if (!minAcceptableQuoteValue) return BN_ZERO.toString();

    const amount = toBN(
      formatPrice(
        toBN(quoteLockedMargin)
          .minus(minAcceptableQuoteValue)
          .div(quoteLockedMargin)
          .times(availableAmount),
        quantityPrecision
      )
    );
    return amount.toString();
  }, [
    availableAmount,
    quoteLockedMargin,
    minAcceptableQuoteValue,
    quantityPrecision,
  ]);

  function getPnlData(value: string) {
    if (!quote) return [`$${formatAmount(value)}`, "0", theme.text1];
    const valueBN = toBN(value);
    const valuePercent = valueBN
      .div(availableAmount)
      .div(quote.openedPrice)
      .times(leverage)
      .times(100)
      .toFixed(2);

    if (valueBN.isGreaterThan(0))
      return [`+ $${formatAmount(valueBN)}`, valuePercent, theme.green1];
    else if (valueBN.isLessThan(0))
      return [
        `- $${formatAmount(Math.abs(valueBN.toNumber()))}`,
        valuePercent,
        theme.red1,
      ];
    return [`$${formatAmount(valueBN)}`, "0"];
  }

  const [limitValue, limitValuePercent, limitValueColor] = getPnlData(limitPnl);
  const [marketValue, marketValuePercent, marketValueColor] =
    getPnlData(marketUpnlBN);

  const state = useMemo(() => {
    if (toBN(availableAmount).isLessThan(size)) {
      return ErrorState.INSUFFICIENT_BALANCE;
    }

    if (outOfRangePrice) {
      return ErrorState.OUT_OF_RANGE_PRICE;
    }

    if (
      toBN(availableToClose).minus(size).lt(0) &&
      !toBN(size).isEqualTo(availableAmount)
    ) {
      return ErrorState.REMAINING_AMOUNT_UNDER_10;
    }

    if (toBN(postSolvencyValue).lt(size)) {
      return ErrorState.PARTIAL_CLOSE_WITH_SLIPPAGE;
    }

    return ErrorState.VALID;
  }, [
    availableAmount,
    size,
    outOfRangePrice,
    availableToClose,
    postSolvencyValue,
  ]);

  const closeModal = useCallback(() => {
    setSize("");
    setPrice("");
    toggleModal();
  }, [toggleModal]);

  const handleManage = useCallback(async () => {
    if (!closeCallback) {
      toast.error(error);
      return;
    }
    try {
      setAwaitingCloseConfirmation(true);
      await closeCallback();
      setAwaitingCloseConfirmation(false);
      closeModal();
    } catch (e) {
      setAwaitingCloseConfirmation(false);
      closeModal();
      console.error(e);
    }
  }, [closeCallback, error, closeModal]);

  function getActionButton(): JSX.Element | null {
    if (!chainId || !account) return <ConnectWallet />;
    else if (isPendingTxs) {
      return (
        <MainButton disabled>
          Transacting <DotFlashing />
        </MainButton>
      );
    } else if (awaitingCloseConfirmation) {
      return (
        <MainButton disabled>
          Awaiting Confirmation <DotFlashing />
        </MainButton>
      );
    } else if (state === ErrorState.PARTIAL_CLOSE_WITH_SLIPPAGE) {
      return <ErrorButton state={state} liquidationButton={true} />;
    } else if (state) {
      return (
        <ErrorButton state={state} exclamationMark={true} disabled={true} />
      );
    } else if (calculationLoading) {
      return (
        <MainButton disabled>
          calculating
          <DotFlashing />
        </MainButton>
      );
    } else if (calculationMode) {
      return <MainButton onClick={onEnterPress}>calculate Amount</MainButton>;
    }

    return (
      <MainButton height={"48px"} onClick={handleManage}>
        Close Position
      </MainButton>
    );
  }

  function onEnterPress() {
    setCalculationLoading(true);
    setCalculationMode(false);
    const tempPrice = price ? price : lastMarketPrice;
    const result = calculateString(
      size,
      availableAmount,
      quantityPrecision,
      tempPrice
    );
    setPrice(tempPrice);
    setSize(result);
    setCalculationLoading(false);
  }

  function onChangeAmount(value: string) {
    if (calculationPattern.test(value)) {
      setCalculationMode(true);
    } else if (calculationMode) {
      setCalculationMode(false);
    }
    setSize(value);
  }

  return (
    <Modal
      isOpen={quote ? modalOpen : false}
      onBackgroundClick={closeModal}
      onEscapeKeydown={closeModal}
    >
      <ModalHeader
        onClose={closeModal}
        title={"Close " + marketName + "-Q" + quote?.id}
        positionType={positionType}
      />
      <Wrapper>
        <TabModal
          tabOptions={Object.values(OrderType)}
          activeOption={activeTab}
          onChange={(tab: string) => setActiveTab(tab as OrderType)}
        />

        {activeTab === OrderType.LIMIT ? (
          <>
            <LimitClose
              symbol={collateralCurrency?.symbol}
              quote={quote}
              price={price}
              setPrice={setPrice}
              balanceTitle={balanceTitle}
              marketPrice={lastMarketPrice}
            />
            <CustomInputBox2
              title={"Amount"}
              symbol={symbol}
              precision={quantityPrecision}
              placeholder="0"
              balanceTitle={"Balance:"}
              balanceDisplay={formatAmount(availableAmount)}
              balanceExact={availableAmount}
              value={size}
              calculationEnabled={WEB_SETTING.calculationalInput}
              calculationMode={calculationMode}
              calculationLoading={calculationLoading}
              onChange={onChangeAmount}
              onEnterPress={onEnterPress}
            />
          </>
        ) : (
          <>
            <MarketClosePanel
              price={lastMarketPrice}
              symbol={collateralCurrency?.symbol}
            />
            <CustomInputBox2
              title={"Amount"}
              symbol={symbol}
              precision={quantityPrecision}
              placeholder="0"
              balanceTitle={"Balance:"}
              balanceDisplay={formatAmount(availableAmount)}
              balanceExact={availableAmount}
              value={size}
              calculationEnabled={WEB_SETTING.calculationalInput}
              calculationMode={calculationMode}
              calculationLoading={calculationLoading}
              onChange={onChangeAmount}
              onEnterPress={onEnterPress}
            />
          </>
        )}
        {!toBN(postSolvencyValue).isNaN() && (
          <GuidesDropDown
            symbol={symbol}
            setSize={setSize}
            setActiveTab={setActiveTab}
            notionalValue={formatPrice(
              toBN(markPriceBN).times(availableAmount),
              pricePrecision
            )}
            availableAmount={availableAmount}
            postSolvencyValue={postSolvencyValue}
            availableToClose={availableToClose}
          />
        )}

        <InfoWrapper>
          <DataRow>
            <Label>Estimated PNL:</Label>
            {activeTab === OrderType.MARKET ? (
              marketData ? (
                <PnlValue
                  color={marketValueColor}
                  style={{ fontSize: "12px" }}
                >{`${marketValue} (${Math.abs(
                  Number(marketValuePercent)
                )}%)`}</PnlValue>
              ) : (
                "-"
              )
            ) : toBN(limitPnl).isNaN() ? (
              "-"
            ) : (
              <PnlValue
                color={limitValueColor}
                style={{ fontSize: "12px" }}
              >{`${limitValue} (${Math.abs(
                Number(limitValuePercent)
              )}%)`}</PnlValue>
            )}
          </DataRow>
          <InfoItem
            label={"Open Price:"}
            amount={`$${toBN(correctOpenPrice).toFormat()}`}
          />
        </InfoWrapper>

        {getActionButton()}

        {/* <div>* This position cannot be market closed as it may result in direct account liquidation.</div> */}
      </Wrapper>
    </Modal>
  );
}
