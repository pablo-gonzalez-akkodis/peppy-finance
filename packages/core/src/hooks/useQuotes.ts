import { useMemo } from "react";

import { useSingleContractMultipleMethods } from "../lib/hooks/multicall";
import { OrderType, PositionType } from "../types/trade";
import { Quote, QuoteStatus } from "../types/quote";
import { BN_ZERO, fromWei, toBN } from "../utils/numbers";

import {
  useAccountPartyAStat,
  useActiveAccountAddress,
} from "../state/user/hooks";
import {
  NotificationDetails,
  NotificationType,
} from "../state/notifications/types";
import { usePartialFillNotifications } from "../state/notifications/hooks";

import { useDiamondContract } from "./useContract";
import { useMarket } from "./useMarkets";
import { useSupportedChainId } from "../lib/hooks/useSupportedChainId";
import useBidAskPrice from "./useBidAskPrice";
import { Market } from "../types/market";

export function getPositionTypeByIndex(x: number): PositionType {
  return PositionType[
    Object.keys(PositionType).find(
      (key, index) => index === x
    ) as keyof typeof PositionType
  ];
}

export function getQuoteStateByIndex(x: number): QuoteStatus {
  return QuoteStatus[
    Object.keys(QuoteStatus).find(
      (key, index) => index === x
    ) as keyof typeof QuoteStatus
  ];
}

export function sortQuotesByModifyTimestamp(a: Quote, b: Quote) {
  return Number(b.statusModifyTimestamp) - Number(a.statusModifyTimestamp);
}

export function useGetPositions(): {
  positions: Quote[] | undefined;
  loading: boolean;
} {
  const isSupportedChainId = useSupportedChainId();
  const activeAccountAddress = useActiveAccountAddress();

  const { positionsCount } = useAccountPartyAStat(activeAccountAddress);

  const DiamondContract = useDiamondContract();

  const [start, size] = [0, positionsCount + 1];
  const calls = useMemo(
    () =>
      isSupportedChainId
        ? activeAccountAddress
          ? [
              {
                functionName: "getPartyAOpenPositions",
                callInputs: [activeAccountAddress, start, size],
              },
            ]
          : []
        : [],
    [isSupportedChainId, activeAccountAddress, start, size]
  );

  const {
    data: quoteResults,
    isLoading: isQuoteLoading,
    isSuccess: isQuoteSuccess,
  } = useSingleContractMultipleMethods(DiamondContract, calls);

  const quotesValue = useMemo(
    () =>
      isQuoteSuccess &&
      quoteResults?.[0]?.status === "success" &&
      Array.isArray(quoteResults[0].result)
        ? quoteResults[0].result
        : [],
    [isQuoteSuccess, quoteResults]
  );

  const quotes: Quote[] = useMemo(() => {
    return (
      quotesValue
        ?.filter((quote) => quote[0]?.toString() !== "0") //remove garbage outputs
        .map((quote) => toQuote(quote))
        .sort(sortQuotesByModifyTimestamp) || []
    );
  }, [quotesValue]);

  return useMemo(
    () => ({
      positions: quotes.length > 0 ? quotes : undefined,
      loading: isQuoteLoading,
    }),
    [isQuoteLoading, quotes]
  );
}

export function useGetQuoteByIds(ids: number[]): {
  quotes: Quote[];
  loading: boolean;
} {
  const DiamondContract = useDiamondContract();
  const isSupportedChainId = useSupportedChainId();

  const calls = useMemo(
    () =>
      isSupportedChainId
        ? ids.map((id) => ({ functionName: "getQuote", callInputs: [id] }))
        : [],
    [ids, isSupportedChainId]
  );

  const {
    data: quoteResults,
    isLoading,
    isSuccess,
  } = useSingleContractMultipleMethods(DiamondContract, calls);

  const quotesValue = useMemo(
    () =>
      isSuccess &&
      quoteResults !== undefined &&
      quoteResults?.[0]?.status === "success"
        ? quoteResults?.map((qs) =>
            qs.result
              ? qs.result["id"]
                ? qs.result
                : qs.result[0]
                ? qs.result[0]
                : null
              : null
          )
        : [],
    [isSuccess, quoteResults]
  );

  const quotes: Quote[] = useMemo(() => {
    return quotesValue
      .filter((quote) => quote)
      .map((quote) => toQuote(quote))
      .sort(sortQuotesByModifyTimestamp);
  }, [quotesValue]);

  return useMemo(
    () => ({
      quotes,
      loading: isLoading,
    }),
    [isLoading, quotes]
  );
}

export function useGetPendingIds(): {
  pendingIds: number[];
  loading: boolean;
} {
  const isSupportedChainId = useSupportedChainId();
  const activeAccountAddress = useActiveAccountAddress();

  const DiamondContract = useDiamondContract();

  const calls = useMemo(
    () =>
      isSupportedChainId
        ? activeAccountAddress
          ? [
              {
                functionName: "getPartyAPendingQuotes",
                callInputs: [activeAccountAddress],
              },
            ]
          : []
        : [],
    [activeAccountAddress, isSupportedChainId]
  );

  const {
    data: quoteResults,
    isLoading,
    isSuccess,
  } = useSingleContractMultipleMethods(DiamondContract, calls);

  const quoteIdsValue = useMemo(
    () =>
      isSuccess &&
      quoteResults?.[0]?.status === "success" &&
      Array.isArray(quoteResults[0].result)
        ? quoteResults[0].result
        : [],
    [isSuccess, quoteResults]
  );

  const quoteIds: number[] = useMemo(() => {
    return quoteIdsValue
      .map((quoteId) => toBN(quoteId.toString()).toNumber())
      .sort((a: number, b: number) => b - a);
  }, [quoteIdsValue]);

  return useMemo(
    () => ({
      pendingIds: quoteIds,
      loading: isLoading,
    }),
    [isLoading, quoteIds]
  );
}

export function useQuoteUpnlAndPnl(
  quote: Quote,
  currentPrice: string | number,
  quantityToClose?: string | number,
  closedPrice?: string | number
): string[] {
  const {
    openedPrice,
    positionType,
    avgClosedPrice,
    closedAmount,
    quoteStatus,
    quantity,
    liquidateAmount,
    liquidatePrice,
  } = quote;

  const pnl =
    toBN(closedPrice ?? avgClosedPrice)
      .minus(openedPrice)
      .times(quantityToClose ?? closedAmount)
      .times(positionType === PositionType.SHORT ? -1 : 1)
      .toString() || BN_ZERO.toString();

  const upnl =
    toBN(quantity)
      .minus(closedAmount)
      .times(toBN(currentPrice).minus(openedPrice))
      .times(positionType === PositionType.SHORT ? -1 : 1)
      .toString() || BN_ZERO.toString();

  if (
    quoteStatus === QuoteStatus.CLOSE_PENDING ||
    quoteStatus === QuoteStatus.CANCEL_CLOSE_PENDING ||
    quoteStatus === QuoteStatus.OPENED
  ) {
    return [upnl, pnl];
  } else if (quoteStatus === QuoteStatus.CLOSED) {
    return [BN_ZERO.toString(), pnl];
  } else if (quoteStatus === QuoteStatus.LIQUIDATED) {
    if (quantityToClose) return [BN_ZERO.toString(), pnl];

    const averagePrice = toBN(liquidatePrice)
      .times(liquidateAmount)
      .plus(toBN(avgClosedPrice).times(closedAmount))
      .div(quantity);
    return [
      BN_ZERO.toString(),
      toBN(averagePrice)
        .minus(openedPrice)
        .times(quantity)
        .times(positionType === PositionType.SHORT ? -1 : 1)
        .toString() || BN_ZERO.toString(),
    ];
  } else {
    return [BN_ZERO.toString(), BN_ZERO.toString()];
  }
}

export function useQuoteSize(quote: Quote): string {
  const { quoteStatus, quantity, closedAmount, marketId } = quote;
  const { quantityPrecision } = useMarket(marketId) || {};
  return useMemo(() => {
    if (
      quoteStatus === QuoteStatus.CLOSED ||
      quoteStatus === QuoteStatus.LIQUIDATED ||
      quoteStatus === QuoteStatus.CANCELED
    )
      return quantity;
    return toBN(quantity)
      .minus(closedAmount)
      .toFixed(quantityPrecision || 6);
  }, [closedAmount, quantity, quantityPrecision, quoteStatus]);
}

export function useQuoteLeverage(quote: Quote): string {
  const {
    orderType,
    quantity,
    marketPrice,
    requestedOpenPrice,
    quoteStatus,
    openedPrice,
    initialCVA,
    initialLF,
    initialPartyAMM,
  } = quote;

  const quoteSize = useQuoteSize(quote);
  const lockedMargin = useLockedMargin(quote);
  const initialLockedMargin = toBN(initialCVA)
    .plus(initialPartyAMM)
    .plus(initialLF)
    .toString();

  if (
    quoteStatus === QuoteStatus.OPENED ||
    quoteStatus === QuoteStatus.CLOSE_PENDING ||
    quoteStatus === QuoteStatus.CANCEL_CLOSE_PENDING
  ) {
    return toBN(quoteSize).times(openedPrice).div(lockedMargin).toFixed(0);
  } else if (
    quoteStatus === QuoteStatus.PENDING ||
    quoteStatus === QuoteStatus.LOCKED ||
    quoteStatus === QuoteStatus.CANCEL_PENDING
  ) {
    return toBN(quantity)
      .times(orderType === OrderType.LIMIT ? requestedOpenPrice : marketPrice)
      .div(lockedMargin)
      .toFixed(0);
  } else if (
    quoteStatus === QuoteStatus.CLOSED ||
    quoteStatus === QuoteStatus.LIQUIDATED
  ) {
    return toBN(quantity)
      .times(openedPrice)
      .div(initialLockedMargin)
      .toFixed(0);
  } else {
    return toBN(quantity)
      .times(orderType === OrderType.LIMIT ? requestedOpenPrice : marketPrice)
      .div(lockedMargin)
      .toFixed(0);
  }
}

export function useQuoteFillAmount(quote: Quote): string | null {
  const { quoteStatus, orderType, id, statusModifyTimestamp } = quote;
  const partiallyFillNotifications: NotificationDetails[] =
    usePartialFillNotifications();
  let foundNotification: NotificationDetails | undefined | null;
  try {
    foundNotification = partiallyFillNotifications.find(
      (notification) =>
        notification.quoteId === id.toString() &&
        notification.notificationType === NotificationType.PARTIAL_FILL &&
        toBN(statusModifyTimestamp).lt(notification.modifyTime)
    );
  } catch (error) {
    foundNotification = null;
  }

  return useMemo(() => {
    if (
      quoteStatus === QuoteStatus.CLOSE_PENDING ||
      quoteStatus === QuoteStatus.CANCEL_CLOSE_PENDING
    ) {
      return orderType === OrderType.LIMIT &&
        foundNotification &&
        foundNotification.filledAmountClose
        ? toBN(foundNotification.filledAmountClose).toString()
        : null;
    } else if (
      quoteStatus === QuoteStatus.LOCKED ||
      quoteStatus === QuoteStatus.PENDING
    ) {
      return orderType === OrderType.LIMIT &&
        foundNotification &&
        foundNotification.filledAmountOpen
        ? toBN(foundNotification.filledAmountOpen).toString()
        : null;
    } else {
      return null;
    }
  }, [foundNotification, orderType, quoteStatus]);
}

export function useClosingLastMarketPrice(
  quote: Quote | null,
  market?: Market
): string {
  // market price for closing position

  const { bid, ask } = useBidAskPrice(market);

  if (quote) {
    if (quote.positionType === PositionType.LONG) {
      return bid;
    } else {
      return ask;
    }
  }

  return "0";
}

export function useOpeningLastMarketPrice(
  quote: Quote | null,
  market?: Market
): string {
  // market price for opening position
  const { bid, ask } = useBidAskPrice(market);

  if (quote)
    if (quote.positionType === PositionType.LONG) {
      return ask;
    } else {
      return bid;
    }

  return "0";
}

function toQuote(quote: any) {
  return {
    id: Number(quote[0].toString()),
    partyBsWhiteList: quote[1],
    marketId: Number(quote[2].toString()),
    positionType: getPositionTypeByIndex(Number(quote[3].toString())),
    orderType:
      Number(quote[4].toString()) === 1 ? OrderType.MARKET : OrderType.LIMIT,

    // Price of quote which PartyB opened in 18 decimals
    openedPrice: fromWei(quote[5].toString()),

    // Price of quote which PartyA requested in 18 decimals
    initialOpenedPrice: fromWei(quote[6].toString()),
    requestedOpenPrice: fromWei(quote[7].toString()),
    marketPrice: fromWei(quote[8].toString()),

    // Quantity of quote which PartyA requested in 18 decimals
    quantity: fromWei(quote[9].toString()),
    closedAmount: fromWei(quote[10].toString()),

    initialCVA: fromWei(quote[11][0].toString()),
    initialLF: fromWei(quote[11][1].toString()),
    initialPartyAMM: fromWei(quote[11][2].toString()),
    initialPartyBMM: fromWei(quote[11][3].toString()),

    CVA: fromWei(quote[12][0].toString()),
    LF: fromWei(quote[12][1].toString()),
    partyAMM: fromWei(quote[12][2].toString()),
    partyBMM: fromWei(quote[12][3].toString()),

    maxFundingRate: fromWei(quote[13].toString()),
    partyA: quote[14].toString(),
    partyB: quote[15].toString(),
    quoteStatus: getQuoteStateByIndex(Number(quote[16].toString())),
    avgClosedPrice: fromWei(quote[17].toString()),
    requestedCloseLimitPrice: fromWei(quote[18].toString()),
    quantityToClose: fromWei(quote[19].toString()),

    // handle partially open position
    parentId: quote[20].toString(),
    createTimestamp: Number(quote[21].toString()),
    statusModifyTimestamp: Number(quote[22].toString()),
    lastFundingPaymentTimestamp: Number(quote[23].toString()),
    deadline: Number(quote[24].toString()),
    tradingFee: Number(quote[25].toString()),
  } as Quote;
}

export function useLockedMargin(quote: Quote): string {
  return toBN(quote.CVA).plus(quote.partyAMM).plus(quote.LF).toString();
}
