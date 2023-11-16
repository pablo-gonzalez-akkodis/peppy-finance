import { useEffect, useMemo, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { JsonValue } from "react-use-websocket/dist/lib/types";

import useIsWindowVisible from "../lib/hooks/useIsWindowVisible";
import { useHedgerInfo } from "../state/hedger/hooks";
import { ConnectionStatus, FundingRateMap } from "../state/hedger/types";

export default function useFetchFundingRate(name?: string) {
  const { webSocketFundingRateUrl } = useHedgerInfo() || {};
  const windowVisible = useIsWindowVisible();
  const [fundingRate, setFundingRate] = useState({} as FundingRateMap);
  // TODO: check if active market is the same as quote market
  // const activeMarket = useActiveMarket()

  const url =
    !name || webSocketFundingRateUrl === "" || !webSocketFundingRateUrl
      ? null
      : webSocketFundingRateUrl;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url, {
    reconnectAttempts: 10,
    shouldReconnect: () => true,
    onOpen: () => {
      console.log("Funding Rate established.");
    },
    onClose: () => console.log("Funding Rate closed"),
    onError: (e) => console.log("Funding Rate has error ", e),
  });

  const connectionStatus = useMemo(() => {
    if (readyState === ReadyState.OPEN) {
      return ConnectionStatus.OPEN;
    } else {
      return ConnectionStatus.CLOSED;
    }
  }, [readyState]);

  // useEffect(() => {
  //   updateWebSocketStatus(connectionStatus)
  // }, [connectionStatus, updateWebSocketStatus])

  useEffect(() => {
    if (connectionStatus === ConnectionStatus.OPEN) {
      const json = {
        symbols: windowVisible ? [name] : [],
      };
      sendJsonMessage(json as unknown as JsonValue);
    }
  }, [connectionStatus, name, sendJsonMessage, windowVisible]);

  useEffect(() => {
    try {
      const lastMessage = lastJsonMessage as any;
      //don't update anything if user is idle instead of updating to empty prices
      if (!windowVisible) return;
      const response = lastMessage ?? {};
      setFundingRate(response as FundingRateMap);
    } catch (err) {
      console.log({ err });
    }
  }, [lastJsonMessage, connectionStatus, windowVisible]);

  return fundingRate;
}
