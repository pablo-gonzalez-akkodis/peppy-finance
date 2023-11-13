import { Address } from "@wagmi/core";

export interface MuonResponseType {
  nodeSignature: Address;
  uPnl: string;
  price: string;
  timestamp: number;
}
