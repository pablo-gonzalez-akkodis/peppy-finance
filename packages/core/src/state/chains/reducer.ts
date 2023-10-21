import { createReducer } from "@reduxjs/toolkit";
import { setChains } from "./actions";

export interface ChainType {
  readonly COLLATERAL_SYMBOL: string;
  readonly COLLATERAL_DECIMALS: number;
  readonly COLLATERAL_ADDRESS: string;
  readonly DIAMOND_ADDRESS: string;
  readonly MULTI_ACCOUNT_ADDRESS: string;
  readonly PARTY_B_WHITELIST: string;
  readonly SIGNATURE_STORE_ADDRESS: string;
  readonly MULTICALL3_ADDRESS: string;
  readonly USDC_ADDRESS: string;
  readonly WRAPPED_NATIVE_ADDRESS: string;
  readonly BALANCE_HISTORY_SUBGRAPH_ADDRESS: string;
  readonly ORDER_HISTORY_SUBGRAPH_ADDRESS: string;
}

export interface AbisType {
  COLLATERAL_ABI: any;
  DIAMOND_ABI: any;
  ERC20_BYTES32_ABI: any;
  MULTICALL3_ABI: any;
  MULTI_ACCOUNT_ABI: any;
}

export interface ChainsState {
  readonly chains: { [chainId: number]: ChainType };
  readonly V3_CHAIN_IDS: number[];
  readonly Abis: AbisType;
}

const initialState: ChainsState = {
  chains: {},
  V3_CHAIN_IDS: [],
  Abis: {
    COLLATERAL_ABI: {},
    DIAMOND_ABI: {},
    ERC20_BYTES32_ABI: {},
    MULTICALL3_ABI: {},
    MULTI_ACCOUNT_ABI: {},
  },
};

export default createReducer(initialState, (builder) =>
  builder.addCase(setChains, (state, { payload }) => {
    const { chains, V3_CHAIN_IDS, Abis } = payload;
    state.chains = chains;
    state.V3_CHAIN_IDS = V3_CHAIN_IDS;
    state.Abis = { ...Abis };
  })
);
