import * as toolkitRaw from "@reduxjs/toolkit";
const { createReducer } = ((toolkitRaw as any).default ??
  toolkitRaw) as typeof toolkitRaw;
import { setChains } from "./actions";
import { HedgerInfoMap } from "../../types/hedger";
import { SupportedChainId } from "../../constants/chains";

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
  SIGNATURE_STORE_ABI: any;
}

export interface ChainsState {
  readonly chains: { [chainId: number]: ChainType };
  readonly V3_CHAIN_IDS: number[];
  readonly FALLBACK_CHAIN_ID: number;
  readonly contract_ABIs: AbisType;
  readonly hedgers: HedgerInfoMap;
  readonly appName: string;
}

const initialState: ChainsState = {
  chains: {},
  V3_CHAIN_IDS: [],
  FALLBACK_CHAIN_ID: 1,
  contract_ABIs: {
    COLLATERAL_ABI: {},
    DIAMOND_ABI: {},
    ERC20_BYTES32_ABI: {},
    MULTICALL3_ABI: {},
    MULTI_ACCOUNT_ABI: {},
    SIGNATURE_STORE_ABI: {},
  },
  hedgers: { [SupportedChainId.NOT_SET]: [] },
  appName: "",
};

export default createReducer(initialState, (builder) =>
  builder.addCase(setChains, (state, { payload }) => {
    const {
      chains,
      V3_CHAIN_IDS,
      contract_ABIs,
      FALLBACK_CHAIN_ID,
      hedgers,
      appName,
    } = payload;
    state.chains = chains;
    state.V3_CHAIN_IDS = V3_CHAIN_IDS;
    state.contract_ABIs = { ...contract_ABIs };
    state.FALLBACK_CHAIN_ID = FALLBACK_CHAIN_ID;
    state.hedgers = hedgers;
    state.appName = appName;
  })
);
