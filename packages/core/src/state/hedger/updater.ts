import { useEffect, useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { JsonValue } from "react-use-websocket/dist/lib/types";

import { useAppDispatch, AppThunkDispatch } from "..";
import useIsWindowVisible from "../../lib/hooks/useIsWindowVisible";
import useActiveWagmi from "../../lib/hooks/useActiveWagmi";
import { useSupportedChainId } from "../../lib/hooks/useSupportedChainId";
import { autoRefresh, retry } from "../../utils/retry";

import { ApiState } from "../../types/api";
import {
  ConnectionStatus,
  MarketDataMap as PricesType,
  MarketData,
  PriceResponse,
} from "./types";
import {
  useWebSocketUrl,
  useSetWebSocketStatus,
  useSetPrices,
  useHedgerInfo,
  useMarketsStatus,
  useMarketNotionalCap,
  useSetDepth,
  useMarkets,
} from "./hooks";
import {
  getMarkets,
  getMarketsDepth,
  getNotionalCap,
  getPriceRange,
} from "./thunks";
import { useActiveMarket } from "../trade/hooks";
import { Hedger, HedgerWebsocketType } from "../../types/hedger";
import { Market } from "../../types/market";

export function HedgerUpdater(): null {
  const thunkDispatch: AppThunkDispatch = useAppDispatch();
  const hedger = useHedgerInfo();
  const { baseUrl, apiUrl, fetchData } = hedger || {};
  const activeMarket = useActiveMarket();
  const markets = useMarkets();

  usePriceWebSocket();
  useFetchMarkets(hedger, thunkDispatch);
  useFetchNotionalCap(hedger, thunkDispatch, activeMarket);

  //auto update per each 1 seconds
  useEffect(() => {
    return autoRefresh(() => thunkDispatch(getMarketsDepth(apiUrl)), 1);
  }, [thunkDispatch, apiUrl, markets]);

  //auto update price range per symbol, every 1 hours
  useEffect(() => {
    if (fetchData && activeMarket)
      return autoRefresh(
        () =>
          thunkDispatch(
            getPriceRange({ hedgerUrl: baseUrl, market: activeMarket })
          ),
        60 * 60
      );
  }, [thunkDispatch, baseUrl, activeMarket, fetchData]);

  return null;
}

function useFetchMarkets(
  hedger: Hedger | null,
  thunkDispatch: AppThunkDispatch
) {
  const marketsStatus = useMarketsStatus();
  const { chainId } = useActiveWagmi();
  const isSupported = useSupportedChainId();
  const { baseUrl } = hedger || {};

  //auto update per each 3000 seconds
  useEffect(() => {
    if (isSupported) thunkDispatch(getMarkets(baseUrl));
    else return autoRefresh(() => thunkDispatch(getMarkets(baseUrl)), 3000);
  }, [thunkDispatch, baseUrl, hedger, chainId, isSupported]);

  //if error occurs it will retry to fetch markets 5 times
  useEffect(() => {
    if (marketsStatus === ApiState.ERROR)
      retry(() => thunkDispatch(getMarkets(baseUrl)), {
        n: 5,
        minWait: 1000,
        maxWait: 10000,
      });
  }, [thunkDispatch, baseUrl, marketsStatus]);
}

function useFetchNotionalCap(
  hedger: Hedger | null,
  thunkDispatch: AppThunkDispatch,
  activeMarket?: Market
) {
  const { marketNotionalCap, marketNotionalCapStatus } = useMarketNotionalCap();
  const { baseUrl } = hedger || {};

  //auto update notional cap per symbol, every 1 hours
  useEffect(() => {
    if (activeMarket)
      return autoRefresh(
        () =>
          thunkDispatch(
            getNotionalCap({
              hedgerUrl: baseUrl,
              market: activeMarket,
              preNotional: marketNotionalCap,
            })
          ),
        60 * 60
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMarket, baseUrl, thunkDispatch]);

  //if error occurs it will retry to fetch markets 5 times
  useEffect(() => {
    if (activeMarket && marketNotionalCapStatus === ApiState.ERROR) {
      retry(
        () =>
          thunkDispatch(
            getNotionalCap({
              hedgerUrl: baseUrl,
              market: activeMarket,
              preNotional: marketNotionalCap,
            })
          ),
        {
          n: 5,
          minWait: 3000,
          maxWait: 10000,
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thunkDispatch, baseUrl, marketNotionalCapStatus, activeMarket]);
}

function usePriceWebSocket() {
  const windowVisible = useIsWindowVisible();
  const webSocketUrl = useWebSocketUrl();
  const updatePrices = useSetPrices();
  const updateDepth = useSetDepth();
  const updateWebSocketStatus = useSetWebSocketStatus();
  const markets = useMarkets();

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    webSocketUrl === "" ? null : webSocketUrl,
    {
      reconnectAttempts: 10,
      shouldReconnect: () => true,
      onOpen: () => {
        console.log("WebSocket connection established.");
      },
      onClose: () => console.log("WebSocket connection closed"),
      onError: (e) => console.log("WebSocket connection has error ", e),
    }
  );

  const connectionStatus = useMemo(() => {
    if (readyState === ReadyState.OPEN) {
      return ConnectionStatus.OPEN;
    } else {
      return ConnectionStatus.CLOSED;
    }
  }, [readyState]);

  useEffect(() => {
    updateWebSocketStatus(connectionStatus);
  }, [connectionStatus, updateWebSocketStatus]);

  useEffect(() => {
    if (connectionStatus === ConnectionStatus.OPEN) {
      const json = {
        method: windowVisible ? "SUBSCRIBE" : "UNSUBSCRIBE", // UNSUBSCRIBE websocket when user is idle
        params: ["!markPrice@arr@1s"],
        id: 1,
      };
      sendJsonMessage(json as unknown as JsonValue);
    }
  }, [connectionStatus, markets, sendJsonMessage, windowVisible]);

  useEffect(() => {
    try {
      const lastMessage = lastJsonMessage as HedgerWebsocketType;

      //don't update anything if user is idle instead of updating to empty prices
      if (!windowVisible) return;

      if (!lastMessage || isEmpty(lastMessage) || !lastMessage.data) {
        // return
        return updatePrices({});
      }

      if (lastMessage.stream === "!markPrice@arr@1s") {
        const updatedPrices: PricesType = {};
        lastMessage.data.forEach((price: PriceResponse) => {
          const newPrice = {
            fundingRate: price.r,
            nextFundingTime: price.T,
            markPrice: price.p,
            indexPrice: price.i,
          } as MarketData;
          updatedPrices[price.s] = newPrice;
        });
        updatePrices(updatedPrices);
      }
    } catch (err) {
      updatePrices({});
      console.log({ err });
    }
  }, [
    lastJsonMessage,
    updatePrices,
    connectionStatus,
    windowVisible,
    updateDepth,
  ]);
}
