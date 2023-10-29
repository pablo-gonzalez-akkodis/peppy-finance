import { SupportedChainId } from "./chains";

export const UNDER_MAINTENANCE = false;

export const AddressZero = "0x0000000000000000000000000000000000000000";
export const MAX_UINT256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

// transaction popup dismissal amounts
export const DEFAULT_TXN_DISMISS_MS = 25000;
export const L2_TXN_DISMISS_MS = 5000;

export const DEFAULT_PRECISION = 2;

export const GLOBAL_MULTI_ACCOUNTABLE_PAUSED = false;
export const CHECK_IS_WHITE_LIST = true;

export const MARKET_PRICE_COEFFICIENT = 1.07;

// this for limit orders price constraint
export const PRICE_RANGE_BOUNDS_BY_CHAIN_ID: {
  [chainId: number]: { lowerBound: number; upperBound: number };
} = {
  [SupportedChainId.FANTOM]: { lowerBound: 0.999, upperBound: 1.001 },
  [SupportedChainId.BSC]: { lowerBound: 0.9994, upperBound: 1.0006 },
  [SupportedChainId.BSC_TESTNET]: { lowerBound: 0.999, upperBound: 1.001 },
  [SupportedChainId.BASE]: { lowerBound: 0.999, upperBound: 1.001 },
};
export const DEFAULT_PRICE_RANGE_BOUND = {
  lowerBound: 0.999,
  upperBound: 1.001,
};

export const MARKET_ORDER_DEADLINE = 300; // 5 minutes
export const LIMIT_ORDER_DEADLINE = 311040120; // 10 years

export const MAX_LEVERAGE_VALUE = 40;
export const MIN_LEVERAGE_VALUE = 1;

export const MAX_PENDINGS_POSITIONS_NUMBER = 10;
export const BALANCE_HISTORY_ITEMS_NUMBER = 10;
