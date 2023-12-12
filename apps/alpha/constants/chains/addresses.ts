import { SupportedChainId } from "@symmio-client/core/constants/chains";
import { ChainType } from "@symmio-client/core/state/chains/reducer";

export const BSCChain: ChainType = {
  // COLLATERAL
  COLLATERAL_SYMBOL: "USDT",
  COLLATERAL_DECIMALS: 18,
  COLLATERAL_ADDRESS: "0x55d398326f99059ff775485246999027b3197955",

  DIAMOND_ADDRESS: "0x059a8ad9FeFae3818bCCB5811d1Bf9688CA9137C",
  MULTI_ACCOUNT_ADDRESS: "0x75c539eFB5300234e5DaA684502735Fc3886e8b4",
  PARTY_B_WHITELIST: "0x62B0db9E73e17Bc090D80c2C0A2414B9A42037F3",

  SIGNATURE_STORE_ADDRESS: "0x6EA2EffEB3F0F2582DF5aD52cbe847FA50B628B2",
  MULTICALL3_ADDRESS: "0x963Df249eD09c358A4819E39d9Cd5736c3087184",
  USDC_ADDRESS: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  WRAPPED_NATIVE_ADDRESS: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",

  BALANCE_HISTORY_SUBGRAPH_ADDRESS:
    "https://api.thegraph.com/subgraphs/name/navid-fkh/symmetrical_bsc",
  ORDER_HISTORY_SUBGRAPH_ADDRESS:
    "https://api.thegraph.com/subgraphs/name/navid-fkh/symmio_bsc",
};

export const contractInfo: { [chainId: number]: ChainType } = {
  [SupportedChainId.BSC]: BSCChain,
};
