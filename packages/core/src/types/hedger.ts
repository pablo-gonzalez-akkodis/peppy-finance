import { SupportedHedgerId } from "../constants/hedgers";
import { Market } from "./market";

export interface OpenInterest {
  total: number;
  used: number;
}

export type Hedger = {
  id: string | SupportedHedgerId;
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
