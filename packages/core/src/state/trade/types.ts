import { OrderType, PositionType, InputField } from "../../types/trade";

export interface TradeState {
  marketId: number | undefined;
  inputField: InputField;
  orderType: OrderType;
  positionType: PositionType;
  limitPrice: string;
  typedValue: string;
  cva: string | undefined;
  mm: string | undefined;
  lf: string | undefined;
  isActiveStopLoss: boolean;
  stopLossPrice: string;
}

export interface GetLockedParamUrlResponse {
  cva: string;
  mm: string;
  lf: string;
  leverage: string;
}
