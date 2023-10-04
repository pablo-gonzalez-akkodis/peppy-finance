import {
  OrderType,
  PositionType,
  InputField,
} from "@symmio-client/core/types/trade";

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
}
