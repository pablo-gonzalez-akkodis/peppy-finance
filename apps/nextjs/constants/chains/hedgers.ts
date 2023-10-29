import { SupportedChainId } from "@symmio-client/core/constants/chains";
import { Hedger, OpenInterest } from "@symmio-client/core/types/hedger";

export const DEFAULT_HEDGER = {
  apiUrl: "https://fapi.binance.com/",
  webSocketUrl: "wss://fstream.binance.com/stream",
  baseUrl: "https://alpha-hedger2.rasa.capital",
  webSocketUpnlUrl: "",
  webSocketNotificationUrl: "",
  defaultMarketId: 1,
  markets: [],
  openInterest: { total: 0, used: 0 },
  id: "Cloverfield",
  fetchData: false,
} as Hedger;

export const HedgerInfo = {
  [SupportedChainId.FANTOM]: [
    {
      apiUrl: "https://fapi.binance.com/",
      webSocketUrl: "wss://fstream.binance.com/stream",
      baseUrl: `https://hedger.deus.finance`,
      webSocketUpnlUrl: `wss://hedger.deus.finance/ws/upnl-ws`,
      webSocketNotificationUrl: `wss://hedger.deus.finance/ws/position-state-ws3`,
      defaultMarketId: 1,
      markets: [],
      openInterest: { total: 0, used: 0 } as OpenInterest,
      id: "symmio",
      fetchData: true,
      clientName: "THENA",
    },
  ],
  [SupportedChainId.BSC]: [
    {
      apiUrl: "https://fapi.binance.com/",
      webSocketUrl: "wss://fstream.binance.com/stream",
      baseUrl: `https://alpha-hedger2.rasa.capital`,
      webSocketUpnlUrl: `wss://alpha-hedger2.rasa.capital/ws/upnl-ws`,
      webSocketNotificationUrl: `wss://alpha-hedger2.rasa.capital/ws/position-state-ws3`,
      defaultMarketId: 1,
      markets: [],
      openInterest: { total: 0, used: 0 } as OpenInterest,
      id: "alpha-hedger2",
      fetchData: true,
      clientName: "THENA",
    },
  ],
  [SupportedChainId.NOT_SET]: [DEFAULT_HEDGER],
};
