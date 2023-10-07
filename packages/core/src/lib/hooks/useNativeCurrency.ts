import { useMemo } from "react";
import { NativeCurrency, Token } from "@uniswap/sdk-core";

import { SupportedChainId } from "../../constants/chains";
import { nativeOnChain } from "../../utils/token";
import useActiveWagmi from "./useActiveWagmi";

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
