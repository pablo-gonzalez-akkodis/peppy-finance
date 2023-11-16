import { createAction } from "@reduxjs/toolkit";

import {
  ConnectionStatus,
  MarketDataMap,
  MarketDepthMap,
  MarketDepthData,
  MarketNotionalCap,
  FundingRateMap,
} from "./types";

export const updateWebSocketStatus = createAction<{ status: ConnectionStatus }>(
  "hedger/updateWebSocketStatus"
);
export const updateHedgerId = createAction<{ id: string }>(
  "hedger/updateHedgerId"
);
export const updatePrices = createAction<{ prices: MarketDataMap }>(
  "hedger/updatePrices"
);
export const updateDepths = createAction<{ depths: MarketDepthMap }>(
  "hedger/updateDepths"
);
export const updateDepth = createAction<{
  name: string;
  depth: MarketDepthData;
}>("hedger/updateDepth");
export const updateNotionalCap = createAction<{
  notionalCap: MarketNotionalCap;
}>("hedger/updateNotionalCap");

// TODO: Is it better to save all symbols or only the symbol for active market?
export const updateFundingRates = createAction<{
  fundingRates: FundingRateMap;
}>("hedger/updateFundingRates");
