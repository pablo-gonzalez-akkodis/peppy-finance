import React from "react";
import { useFundingRateData } from "@symmio-client/core/state/hedger/hooks";
import { useActiveMarket } from "@symmio-client/core/state/trade/hooks";
import { formatAmount, toBN } from "@symmio-client/core/utils/numbers";
import { getRemainingTime } from "@symmio-client/core/utils/time";

export default function MarketFundingRate() {
  const activeMarket = useActiveMarket();
  const { name } = activeMarket || {};
  const fundingRate = useFundingRateData(name);
  const { diff, hours, minutes, seconds } = getRemainingTime(
    fundingRate?.next_funding_time || 0
  );

  return (
    <React.Fragment>
      {fundingRate && !toBN(fundingRate?.next_funding_rate).isNaN()
        ? `${formatAmount(
            toBN(fundingRate?.next_funding_rate).times(100)
          )}% after ${
            diff > 0 &&
            ` ${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          }`
        : "-"}
    </React.Fragment>
  );
}
