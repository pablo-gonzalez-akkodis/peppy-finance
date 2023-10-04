import { Quote } from "@symmio-client/core/types/quote";
import { PositionType } from "@symmio-client/core/types/trade";
import { BN_ZERO, toBN } from "@symmio-client/core/utils/numbers";

import { useHistoryQuotes } from "@symmio-client/core/state/quotes/hooks";

export function useMax20ClosedQuotes() {
  const { quotes: closed } = useHistoryQuotes();
  return closed.length <= 20 ? closed : closed.slice(0, 20);
}

export function useQuotesPnl(quotes: Quote[]) {
  if (!quotes.length) return [];

  const PNLsList: string[] = quotes.map((quote) => {
    const { avgClosedPrice, openedPrice, closedAmount, positionType } = quote;
    const pnl =
      toBN(avgClosedPrice)
        .minus(openedPrice)
        .times(closedAmount)
        .times(positionType === PositionType.SHORT ? -1 : 1)
        .toString() || BN_ZERO.toString();

    return pnl;
  });
  return PNLsList;
}
