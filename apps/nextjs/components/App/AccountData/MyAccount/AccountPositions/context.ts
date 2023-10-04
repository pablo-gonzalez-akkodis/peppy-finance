import { IQuotesInfo } from "@symmio-client/core/types/quotesOverview";
import { createContext } from "react";

export const AccountPositionsContext = createContext<{
  marketQuotesInfo: IQuotesInfo;
  colors: string[];
}>({
  marketQuotesInfo: [],
  colors: [],
});
