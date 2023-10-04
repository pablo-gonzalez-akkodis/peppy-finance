import { useCallback, useMemo } from "react";
import {
  AppThunkDispatch,
  useAppDispatch,
  useAppSelector,
} from "@symmio-client/core/state";

import {
  MarketDataMap,
  MarketData,
  ConnectionStatus,
  MarketDepthData,
  MarketsInfo,
} from "./types";
import { updateWebSocketStatus, updatePrices, updateDepth } from "./actions";
import {
  DEFAULT_HEDGER,
  getHedgerInfo,
} from "@symmio-client/core/constants/hedgers";
import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import { useSupportedChainId } from "@symmio-client/core/lib/hooks/useSupportedChainId";
import useDebounce from "@symmio-client/core/lib/hooks/useDebounce";
import { getMarketsInfo } from "./thunks";
import { ApiState } from "@symmio-client/core/types/api";

export function useMarketsStatus(): ApiState {
  const marketsStatus: ApiState = useAppSelector(
    (state) => state.hedger.marketsStatus
  );
  return marketsStatus;
}

export function useSetWebSocketStatus() {
  const dispatch = useAppDispatch();
  return useCallback(
    (status: ConnectionStatus) => {
      dispatch(updateWebSocketStatus({ status }));
    },
    [dispatch]
  );
}

export function useHedgerInfo() {
  const { chainId } = useActiveWagmi();
  const isSupportedChainId = useSupportedChainId();
  const debouncedChainId = useDebounce(isSupportedChainId, 3000);
  return useMemo(
    () => (debouncedChainId ? getHedgerInfo(chainId) : DEFAULT_HEDGER),
    [chainId, debouncedChainId]
  );
}

export function useWebSocketUrl() {
  const hedger = useHedgerInfo();
  return useMemo(() => (hedger ? hedger.webSocketUrl : null), [hedger]);
}

export function useWebSocketStatus() {
  const webSocketStatus = useAppSelector(
    (state) => state.hedger.webSocketStatus
  );
  return webSocketStatus;
}

export function useMarkets() {
  const markets = useAppSelector((state) => state.hedger.markets);
  return markets;
}

export function useErrorMessages() {
  const errorMessages = useAppSelector((state) => state.hedger.errorMessages);
  return errorMessages;
}

export function useMarketNotionalCap() {
  const marketNotionalCap = useAppSelector(
    (state) => state.hedger.marketNotionalCap
  );
  const marketNotionalCapStatus = useAppSelector(
    (state) => state.hedger.marketNotionalCapStatus
  );
  return { marketNotionalCap, marketNotionalCapStatus };
}

export function useMarketOpenInterest() {
  const openInterest = useAppSelector((state) => state.hedger.openInterest);
  return openInterest;
}

export function usePrices() {
  const prices = useAppSelector((state) => state.hedger.prices);
  return prices;
}

export function useMarketPriceRange() {
  const priceRange = useAppSelector((state) => state.hedger.priceRange);
  return priceRange;
}

export function useMarketData(name: string | undefined): MarketData | null {
  const prices = useAppSelector((state) => state.hedger.prices);
  return name ? prices[name] : null;
}

export function useMarketDepth(
  name: string | undefined
): MarketDepthData | null {
  const depths = useAppSelector((state) => state.hedger.depths);
  return name ? depths[name] : null;
}

export function useMarketsInfo(): MarketsInfo {
  const marketsInfo = useAppSelector((state) => state.hedger.marketsInfo);
  return marketsInfo;
}

export function useSetPrices() {
  const dispatch = useAppDispatch();
  return useCallback(
    (prices: MarketDataMap) => {
      dispatch(updatePrices({ prices }));
    },
    [dispatch]
  );
}

export function useSetDepth() {
  const dispatch = useAppDispatch();
  return useCallback(
    (depth: MarketDepthData, name: string) => {
      dispatch(updateDepth({ name, depth }));
    },
    [dispatch]
  );
}

export function useSetMarketsInfo() {
  const hedger = useHedgerInfo();
  const { baseUrl } = hedger || {};
  const dispatch: AppThunkDispatch = useAppDispatch();

  return useCallback(() => {
    dispatch(getMarketsInfo(baseUrl));
  }, [baseUrl, dispatch]);
}
