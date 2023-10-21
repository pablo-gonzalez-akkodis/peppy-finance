import { createAction } from "@reduxjs/toolkit";
import { AbisType, ChainType } from "./reducer";

export const setChains = createAction<{
  chains: ChainType[];
  V3_CHAIN_IDS: number[];
  Abis: AbisType;
}>("chains/setChains");
