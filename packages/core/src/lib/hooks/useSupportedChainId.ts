import { useMemo } from "react";

import { V3_CHAIN_IDS } from "@symmio-client/core/constants/chains";
import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";

// Allow user to connect any chain globally, but restrict unsupported ones if needed
export function useSupportedChainId() {
  const { chainId, account } = useActiveWagmi();
  return useMemo(() => {
    if (!chainId || !account) return false;
    return V3_CHAIN_IDS.includes(chainId);
  }, [chainId, account]);
}
