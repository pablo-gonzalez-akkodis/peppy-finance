import { useMemo } from "react";
import { Token, Currency } from "@uniswap/sdk-core";

import { FALLBACK_CHAIN_ID } from "../../constants/chains";
import { getCombinedTokens } from "../../utils/token";
import { useCurrencyFromMap, useTokenFromMapOrNetwork } from "./useCurrency";
import useActiveWagmi from "./useActiveWagmi";
import { AddressMap } from "../../utils/address";

export function useAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWagmi();
  return useMemo(() => {
    if (chainId) {
      const combinedTokens = getCombinedTokens();
      return combinedTokens[chainId] ?? {};
    }
    return {};
  }, [chainId]);
}

// undefined if invalid or does not exist
// null if loading or null was passed
// otherwise returns the token
export function useToken(
  addressOrAddressMap?: AddressMap | string | null
): Token | null | undefined {
  const { chainId } = useActiveWagmi();

  const tokenAddress = useMemo(() => {
    if (!addressOrAddressMap) {
      return null;
    }
    if (typeof addressOrAddressMap === "string") {
      return addressOrAddressMap;
    }
    return addressOrAddressMap[chainId ?? FALLBACK_CHAIN_ID] ?? null;
  }, [chainId, addressOrAddressMap]);

  return useTokenByAddress(tokenAddress);
}

export function useTokenByAddress(
  tokenAddress?: string | null
): Token | null | undefined {
  const tokens = useAllTokens();
  return useTokenFromMapOrNetwork(tokens, tokenAddress);
}

export function useCurrency(
  addressOrAddressMap?: AddressMap | string | null
): Currency | null | undefined {
  const { chainId } = useActiveWagmi();

  const tokenAddress = useMemo(() => {
    if (!addressOrAddressMap) {
      return null;
    }
    if (typeof addressOrAddressMap === "string") {
      return addressOrAddressMap;
    }
    return addressOrAddressMap[chainId ?? FALLBACK_CHAIN_ID] ?? null;
  }, [chainId, addressOrAddressMap]);

  return useCurrencyByAddress(tokenAddress);
}

export function useCurrencyByAddress(
  currencyId?: string | null
): Currency | null | undefined {
  const tokens = useAllTokens();
  return useCurrencyFromMap(tokens, currencyId);
}
