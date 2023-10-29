import { OrderType, PositionType } from "./trade";

export enum QuoteStatus {
  PENDING = "PENDING",
  LOCKED = "LOCKED",
  CANCEL_PENDING = "CANCEL_PENDING",
  CANCELED = "CANCELED",
  OPENED = "OPENED",
  CLOSE_PENDING = "CLOSE_PENDING",
  CANCEL_CLOSE_PENDING = "CANCEL_CLOSE_PENDING",
  CLOSED = "CLOSED",
  LIQUIDATED = "LIQUIDATED",
  EXPIRED = "EXPIRED",
}

export type Quote = {
  id: number;
  partyBsWhiteList: string[];
  marketId: number;

  positionType: PositionType;
  orderType: OrderType;
  leverage: number;

  // Price of quote which PartyA requested in 18 decimals
  openedPrice: string;
  requestedOpenPrice: string;
  marketPrice: string;
  openSlippage: string;
  closeSlippage: string;
  quantity: string;
  // Quantity of quote which PartyA requested in 18 decimals
  closedAmount: string;
  initialCVA: string;
  initialMM: string;
  initialLF: string;
  CVA: string;
  MM: string;
  LF: string;
  maxInterestRate: string;
  //PartyA & PartyB address
  partyA: string;
  partyB: string;
  quoteStatus: QuoteStatus;
  avgClosedPrice: string;
  requestedCloseLimitPrice: string;
  quantityToClose: string;
  // for liquid positions
  liquidateAmount: string;
  liquidatePrice: string;
  // handle partially open positionType
  parentId: string;
  createTimestamp: number;
  modifyTimestamp: number;
  deadline: number;
};
