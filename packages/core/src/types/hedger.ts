import { Market } from "./market";

export interface OpenInterest {
  total: number;
  used: number;
}

export type Hedger = {
  id: string;
  apiUrl: string;
  baseUrl: string;
  webSocketUrl: string;
  webSocketUpnlUrl: string;
  webSocketNotificationUrl: string;
  defaultMarketId: number;
  markets: Market[];
  openInterest: OpenInterest;
  fetchData: boolean;
  clientName?: string;
};

export interface HedgerInfoMap {
  [chainId: number]: Hedger[];
}
