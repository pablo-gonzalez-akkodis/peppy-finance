import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

import { DEFAULT_HEDGER } from "@symmio-client/core/constants/hedgers";

import { useMarket } from "@symmio-client/core/hooks/useMarkets";

export default function Trade() {
  const router = useRouter();
  const defaultMarket = useMarket(DEFAULT_HEDGER?.defaultMarketId);
  const defaultSymbol = useMemo(
    () => (defaultMarket ? defaultMarket.name : "BTCUSDT"),
    [defaultMarket]
  );

  useEffect(() => {
    router.push(`/trade/${defaultSymbol}`);
  }, [defaultSymbol, router]);

  return null;
}
