import {
  RoundMode,
  formatPrice,
  toBN,
} from "@symmio-client/core/utils/numbers";
import {
  DEFAULT_PRICE_RANGE_BOUND,
  PRICE_RANGE_BOUNDS_BY_CHAIN_ID,
} from "@symmio-client/core/constants/misc";
import { useMarketDepth } from "@symmio-client/core/state/hedger/hooks";

import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import { useSupportedChainId } from "@symmio-client/core/lib/hooks/useSupportedChainId";

export default function useBidAskPrice(
  name?: string,
  pricePrecision?: number
): { ask: string; bid: string; spread: string } {
  const { chainId } = useActiveWagmi();
  const isSupportedChainId = useSupportedChainId();
  const marketDepth = useMarketDepth(name);
  const { lowerBound, upperBound } =
    chainId && isSupportedChainId
      ? PRICE_RANGE_BOUNDS_BY_CHAIN_ID[chainId]
      : DEFAULT_PRICE_RANGE_BOUND;

  if (!marketDepth) return { ask: "0", bid: "0", spread: "0" };

  const { bestAskPrice, bestBidPrice } = marketDepth;
  const bestAsk: string = formatPrice(
    toBN(bestAskPrice).times(upperBound),
    pricePrecision,
    false,
    RoundMode.ROUND_UP
  );
  const bestBid: string = formatPrice(
    toBN(bestBidPrice).times(lowerBound),
    pricePrecision,
    false,
    RoundMode.ROUND_DOWN
  );

  const diff = toBN(bestBid).minus(bestAsk).abs();
  const mean = toBN(bestBid).plus(bestAsk).div(2);
  const spread = diff.div(mean).times(10000).toFixed(4, RoundMode.ROUND_UP);

  return { ask: bestAsk, bid: bestBid, spread };
}
