import { useCollateralToken } from "@symmio-client/core/constants/tokens";
import { PositionType } from "@symmio-client/core/types/trade";
import { toBN } from "@symmio-client/core/utils/numbers";
import { useGetTokenWithFallbackChainId } from "@symmio-client/core/utils/token";

import useTradePage from "@symmio-client/core/hooks/useTradePage";
import useBidAskPrice from "@symmio-client/core/hooks/useBidAskPrice";
import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";

import {
  useActiveMarket,
  usePositionType,
  useSetLimitPrice,
} from "@symmio-client/core/state/trade/hooks";

import { CustomInputBox2 } from "components/InputBox";

export default function LimitPricePanel(): JSX.Element | null {
  const { chainId } = useActiveWagmi();
  const { price } = useTradePage();
  const market = useActiveMarket();
  const positionType = usePositionType();
  const setLimitPrice = useSetLimitPrice();
  const COLLATERAL_TOKEN = useCollateralToken();
  const collateralCurrency = useGetTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );
  const { ask, bid } = useBidAskPrice(market?.name, market?.pricePrecision);

  const lastMarketPrice = (() => {
    if (positionType === PositionType.LONG) {
      return ask;
    } else {
      return bid;
    }
  })();

  const balanceTitle = (() => {
    if (positionType === PositionType.LONG) {
      return "Ask Price:";
    } else {
      return "Bid Price:";
    }
  })();

  return (
    <>
      <CustomInputBox2
        value={price}
        onChange={setLimitPrice}
        precision={market?.pricePrecision}
        title="Price"
        symbol={collateralCurrency?.symbol}
        balanceDisplay={toBN(lastMarketPrice).toFormat()}
        balanceExact={lastMarketPrice}
        balanceTitle={balanceTitle ?? "Offer Price:"}
      />
    </>
  );
}
