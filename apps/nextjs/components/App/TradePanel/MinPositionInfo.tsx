import { useMemo } from "react";
import BigNumber from "bignumber.js";

import { DEFAULT_PRECISION } from "@symmio-client/core/constants/misc";
import { useCollateralToken } from "@symmio-client/core/constants/tokens";
import {
  RoundMode,
  formatPrice,
  toBN,
} from "@symmio-client/core/utils/numbers";
import { useGetTokenWithFallbackChainId } from "@symmio-client/core/utils/token";
import { InputField } from "@symmio-client/core/types/trade";

import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import {
  useActiveMarket,
  useActiveMarketPrice,
  useSetTypedValue,
} from "@symmio-client/core/state/trade/hooks";

import InfoItem from "components/InfoItem";

export default function MinPositionInfo() {
  const { chainId } = useActiveWagmi();
  const setTypedValue = useSetTypedValue();
  const COLLATERAL_TOKEN = useCollateralToken();
  const collateralCurrency = useGetTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );

  const market = useActiveMarket();
  const marketPrice = useActiveMarketPrice();
  const [
    outputTicker,
    pricePrecision,
    quantityPrecision,
    minAcceptableQuoteValue,
  ] = useMemo(
    () =>
      market
        ? [
            market.symbol,
            market.pricePrecision,
            market.quantityPrecision,
            market.minAcceptableQuoteValue,
            market.maxLeverage,
          ]
        : ["", DEFAULT_PRECISION, DEFAULT_PRECISION, 10],
    [market]
  );
  const [minPositionValue, minPositionQuantity] = useMemo(() => {
    // find maximum quantity between min quote value & minimum value base on quantity precision
    const quantity = BigNumber.max(
      toBN(minAcceptableQuoteValue)
        .div(marketPrice)
        .toFixed(quantityPrecision, RoundMode.ROUND_UP),
      toBN(10)
        .pow(quantityPrecision * -1)
        .toFixed(quantityPrecision, RoundMode.ROUND_UP)
    );
    const value = toBN(quantity).times(marketPrice);

    if (value.isNaN()) return ["-", "-"];
    return [
      value.toFixed(pricePrecision, RoundMode.ROUND_UP),
      quantity.toFixed(quantityPrecision, RoundMode.ROUND_UP),
    ];
  }, [marketPrice, minAcceptableQuoteValue, pricePrecision, quantityPrecision]);

  return (
    <InfoItem
      label={"Minimum position size:"}
      balanceExact={formatPrice(
        minPositionValue,
        pricePrecision,
        false,
        RoundMode.ROUND_UP
      )}
      amount={`${minPositionValue} ${collateralCurrency?.symbol} (${
        toBN(minPositionQuantity).eq(0) ? "-" : minPositionQuantity
      } ${outputTicker})`}
      onClick={(value) => setTypedValue(value, InputField.PRICE)}
    />
  );
}
