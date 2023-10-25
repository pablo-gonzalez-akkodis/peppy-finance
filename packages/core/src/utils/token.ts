import { Ether, NativeCurrency, Token, Currency } from "@uniswap/sdk-core";
import invariant from "tiny-invariant";

import { WRAPPED_NATIVE_CURRENCY } from "../constants/tokens";
import {
  FALLBACK_CHAIN_ID,
  SupportedChainId,
  SUPPORTED_CHAIN_IDS,
} from "../constants/chains";
import { AddressMap, DecimalMap, SymbolMap } from "./address";
import { useV3Ids } from "../state/chains/hooks";

export const NATIVE_CHAIN_ID = "NATIVE";
export const DEFAULT_ERC20_DECIMALS = 18;

export type TokenMap = {
  [chainId: number]: Token;
};

export type TokenAddressMap = {
  [chainId: number]: { [address: string]: Token };
};

export function duplicateTokenByChainId(
  address: string,
  decimals: number,
  name: string,
  symbol: string,
  chains: SupportedChainId[] = SUPPORTED_CHAIN_IDS
): TokenMap {
  return chains.reduce((acc: TokenMap, chainId: number) => {
    acc[chainId] = new Token(chainId, address, decimals, symbol, name);
    return acc;
  }, {});
}

//generate same tokens by given AddressMap
export function duplicateTokenByAddressMap(
  addressMap: AddressMap,
  decimals: number,
  symbol: SymbolMap,
  name: SymbolMap,
  decimalMap: DecimalMap = {}
): TokenMap {
  return Object.keys(addressMap)
    .map((chainId) => Number(chainId)) //convert string to number because of the object.keys() always returns string
    .reduce((acc: TokenMap, chainId: number) => {
      acc[chainId] = new Token(
        chainId,
        addressMap[chainId],
        decimalMap[chainId] ?? decimals,
        symbol[chainId],
        name[chainId]
      );
      return acc;
    }, {});
}

export function useGetTokenWithFallbackChainId(
  tokenMap: TokenMap,
  chainId: number | undefined
): Token {
  const v3_ids = useV3Ids();
  if (chainId && v3_ids.includes(chainId)) return tokenMap[chainId];
  return tokenMap[FALLBACK_CHAIN_ID];
}

export function isBSC(chainId: number): boolean {
  return (
    chainId === SupportedChainId.BSC || chainId === SupportedChainId.BSC_TESTNET
  );
}

export function isFTM(chainId: number): chainId is SupportedChainId.FANTOM {
  return chainId === SupportedChainId.FANTOM;
}

class BscNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }

  get wrapped(): Token {
    if (!isBSC(this.chainId)) throw new Error("Not bnb");
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId];
    invariant(wrapped instanceof Token);
    return wrapped;
  }

  public constructor(chainId: number) {
    if (!isBSC(chainId)) throw new Error("Not bnb");
    super(chainId, 18, "BNB", "BNB");
  }
}

class FtmNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }

  get wrapped(): Token {
    if (!isFTM(this.chainId)) throw new Error("Not FTM");
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId];
    invariant(wrapped instanceof Token);
    return wrapped;
  }

  public constructor(chainId: number) {
    if (!isFTM(chainId)) throw new Error("Not FTM");
    super(chainId, 18, "FTM", "FTM");
  }
}

class ExtendedEther extends Ether {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId];
    if (wrapped) return wrapped;
    throw new Error("Unsupported chain ID");
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {};

export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) {
    return cachedNativeCurrency[chainId];
  }
  let nativeCurrency: NativeCurrency | Token;

  if (isBSC(chainId)) {
    nativeCurrency = new BscNativeCurrency(chainId);
  } else if (isFTM(chainId)) {
    nativeCurrency = new FtmNativeCurrency(chainId);
  } else {
    nativeCurrency = ExtendedEther.onChain(chainId);
  }
  return (cachedNativeCurrency[chainId] = nativeCurrency);
}

export function getCombinedTokens(tokenList): TokenAddressMap {
  const combinedToken: TokenAddressMap = {};
  for (let i = 0; i < tokenList.length; i++) {
    const token = tokenList[i];
    const chains = Object.keys(token).map((c) => Number(c));
    for (let j = 0; j < chains.length; j++) {
      if (!combinedToken[chains[j]]) {
        combinedToken[chains[j]] = {};
      }
      const tokenMap = combinedToken[chains[j]];
      tokenMap[token[chains[j]].address] = token[chains[j]];
    }
  }

  return combinedToken;
}
