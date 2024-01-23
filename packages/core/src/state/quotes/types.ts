import { ApiState } from "../../types/api";
import { Quote } from "../../types/quote";

export interface QuotesState {
  history: { [chainId: number]: Quote[] };
  pendings: Quote[];
  positions: Quote[];
  listeners: number[];
  quoteDetail: Quote | null;
  historyState: ApiState;
  hasMoreHistory?: boolean;
}

export interface SubGraphData {
  orderTypeOpen: number;
  partyAmm: string;
  partyBmm: string;
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
  requestedOpenPrice: string;
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
    partyAmm: string;
    partyBmm: string;
    timeStamp: string;
  };
}
