import { useMemo } from "react";
import { NativeCurrency, Token } from "@uniswap/sdk-core";

import { SupportedChainId } from "@symmio-client/core/constants/chains";
import { nativeOnChain } from "@symmio-client/core/utils/token";
import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";

export default function useNativeCurrency(): NativeCurrency | Token {
  const { chainId } = useActiveWagmi();
  return useMemo(
    () =>
      chainId
        ? nativeOnChain(chainId)
        : // display mainnet when not connected
          nativeOnChain(SupportedChainId.FANTOM),
    [chainId]
  );
}
