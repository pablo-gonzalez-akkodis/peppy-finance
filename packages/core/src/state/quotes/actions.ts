import { Quote } from "../../types/quote";
import * as toolkitRaw from "@reduxjs/toolkit/dist/redux-toolkit.cjs.production.min.js";
const { createAction } = ((toolkitRaw as any).default ??
  toolkitRaw) as typeof toolkitRaw;

export const addQuote = createAction<{ id: number }>("quotes/addQuote");
export const removeQuote = createAction<{ id: number }>("quotes/removeQuote");
export const removePosition = createAction<{ quote: Quote }>(
  "quotes/removePosition"
);
export const addQuoteToHistory = createAction<{
  quote: Quote;
  chainId: number;
}>("quotes/addQuoteToHistory");
export const setPendings = createAction<{ quotes: Quote[] }>(
  "quotes/setPendings"
);
export const addPending = createAction<{ quote: Quote }>("quotes/addPendings");
export const setPositions = createAction<{ quotes: Quote[] }>(
  "quotes/setPositions"
);
export const addPosition = createAction<{ quote: Quote }>("quotes/addPosition");
export const setHistory = createAction<{ quotes: Quote[]; chainId: number }>(
  "quotes/setHistory"
);
export const setQuoteDetail = createAction<{ quote: Quote | null }>(
  "quotes/setQuoteDetail"
);
