import { Token, WETH9 } from "@uniswap/sdk-core";
import { duplicateTokenByAddressMap } from "../utils/token";
import {
  USDC_ADDRESS,
  WRAPPED_NATIVE_ADDRESS,
  COLLATERAL_ADDRESS,
  COLLATERAL_DECIMALS,
  COLLATERAL_SYMBOL,
} from "./addresses";
import { SupportedChainId } from "./chains";

/* =====================================
                             TOKENS
===================================== */

export const USDC_TOKEN = duplicateTokenByAddressMap(
  USDC_ADDRESS,
  6,
  "USDC",
  "USDC"
);

export const COLLATERAL_TOKEN = duplicateTokenByAddressMap(
  COLLATERAL_ADDRESS,
  6,
  COLLATERAL_SYMBOL,
  COLLATERAL_SYMBOL,
  COLLATERAL_DECIMALS
);

//todo: remove it
export const TOKEN_SHORTHANDS: {
  [shorthand: string]: { [chainId in SupportedChainId]?: string };
} = {
  USDC: {
    [SupportedChainId.MAINNET]: USDC_TOKEN[SupportedChainId.MAINNET].address,
    [SupportedChainId.ARBITRUM]: USDC_TOKEN[SupportedChainId.ARBITRUM].address,
    [SupportedChainId.BASE]: USDC_TOKEN[SupportedChainId.BASE].address,
    [SupportedChainId.POLYGON]: USDC_TOKEN[SupportedChainId.POLYGON].address,
    [SupportedChainId.RINKEBY]: USDC_TOKEN[SupportedChainId.RINKEBY].address,
  },
};

/* =====================================
                             WRAPPED TOKENS
===================================== */
export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token | undefined } =
  {
    ...(WETH9 as Record<SupportedChainId, Token>),

    [SupportedChainId.ARBITRUM]: new Token(
      SupportedChainId.ARBITRUM,
      WRAPPED_NATIVE_ADDRESS[SupportedChainId.ARBITRUM],
      18,
      "WETH",
      "Wrapped Ether"
    ),
    [SupportedChainId.BASE]: new Token(
      SupportedChainId.BASE,
      WRAPPED_NATIVE_ADDRESS[SupportedChainId.BASE],
      18,
      "WETH",
      "Wrapped Ether"
    ),
    [SupportedChainId.POLYGON]: new Token(
      SupportedChainId.POLYGON,
      WRAPPED_NATIVE_ADDRESS[SupportedChainId.POLYGON],
      18,
      "WMATIC",
      "Wrapped MATIC"
    ),
    [SupportedChainId.FANTOM]: new Token(
      SupportedChainId.FANTOM,
      WRAPPED_NATIVE_ADDRESS[SupportedChainId.FANTOM],
      18,
      "WFTM",
      "Wrapped Fantom"
    ),
    [SupportedChainId.BSC]: new Token(
      SupportedChainId.BSC,
      WRAPPED_NATIVE_ADDRESS[SupportedChainId.BSC],
      18,
      "WBNB",
      "Wrapped BNB"
    ),
    [SupportedChainId.BSC_TESTNET]: new Token(
      SupportedChainId.BSC_TESTNET,
      WRAPPED_NATIVE_ADDRESS[SupportedChainId.BSC_TESTNET],
      18,
      "tBNB",
      "test BNB"
    ),
  };
