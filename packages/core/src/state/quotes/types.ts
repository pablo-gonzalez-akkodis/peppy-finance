import { ApiState } from "@symmio-client/core/types/api";
import { Quote } from "@symmio-client/core/types/quote";

export interface QuotesState {
  history: { [chainId: number]: Quote[] };
  pendings: Quote[];
  positions: Quote[];
  listeners: number[];
  quoteDetail: Quote | null;
  historyState: ApiState;
  hasMoreHistory?: boolean;
}

export interface InitialSubGraphData {
  mm: string;
  lf: string;
  cva: string;
  partyA: string;
  quoteId: string;
  quoteStatus: number;
  timeStamp: string;
}

export interface SubGraphData {
  orderTypeOpen: number;
  mm: string;
  lf: string;
  cva: string;
  partyA: string;
  partyB: string;
  quoteId: string;
  quoteStatus: number;
  symbol: string;
  positionType: number;
  quantity: string;
  orderTypeClose: number;
  openedPrice: string;
  price: string;
  closedPrice: string;
  quantityToClose: string;
  closePrice: string;
  deadline: string;
  partyBsWhiteList: string[];
  symbolId: string;
  timeStamp: string;
  marketPrice: string;
  fillAmount: string;
  closedAmount: string;
  averageClosedPrice: string;
  liquidateAmount: string;
  liquidatePrice: string;
  initialData: {
    cva: string;
    lf: string;
    mm: string;
    timeStamp: string;
  };
}
