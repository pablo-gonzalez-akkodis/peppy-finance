import { AddressMap, DecimalMap, SymbolMap } from "../utils/address";
import { SupportedChainId } from "./chains";
import { Address } from "viem";

/* ###################################
                      CloverField
################################### */

export const COLLATERAL_SYMBOL: SymbolMap = {
  [SupportedChainId.FANTOM]: "lzUSDC",
  [SupportedChainId.BSC]: "USDT",
  [SupportedChainId.BSC_TESTNET]: "TDEI",
  [SupportedChainId.BASE]: "FDEI",
};

export const COLLATERAL_DECIMALS: DecimalMap = {
  [SupportedChainId.FANTOM]: 6,
  [SupportedChainId.BSC]: 18,
  [SupportedChainId.BSC_TESTNET]: 18,
  [SupportedChainId.BASE]: 18,
};

export const COLLATERAL_ADDRESS: AddressMap = {
  [SupportedChainId.FANTOM]: "0x28a92dde19D9989F39A49905d7C9C2FAc7799bDf",
  [SupportedChainId.BSC]: "0x55d398326f99059ff775485246999027b3197955",
  [SupportedChainId.BSC_TESTNET]: "0xA673321D0Cac866e5265D647790D4af37Cc0F93A",
  [SupportedChainId.BASE]: "0x581D11Fdf7a96b4dCcE51929AbAC914884b2Ce91",
};

export const DIAMOND_ADDRESS: AddressMap = {
  [SupportedChainId.FANTOM]: "0x762407bEd807184F90F3eDcF2D7Ac9CB9d8901c6",
  [SupportedChainId.BSC]: "0x059a8ad9FeFae3818bCCB5811d1Bf9688CA9137C",
  [SupportedChainId.BSC_TESTNET]: "0x52e2230cDb80EDEBDaDafcf24033608C9A636D7D",
  [SupportedChainId.BASE]: "0x52e2230cDb80EDEBDaDafcf24033608C9A636D7D",
};

export const MULTI_ACCOUNT_ADDRESS: AddressMap = {
  [SupportedChainId.FANTOM]: "0x0937bC09b8D073E4F1abE85470969475f714Ca6c",
  [SupportedChainId.BSC]: "0x10Acc15db0d432280bE4885DaE65e1cC76DA3C54",
  [SupportedChainId.BSC_TESTNET]: "0x50e5DB721FE6fFDD12a324f9d29EF5d077a395ed",
  [SupportedChainId.BASE]: "0x8Ccbc812394fDF26c58F3837aB419fbc315656C3",
};

export const PARTY_B_WHITELIST: { [chainId: number]: readonly Address[] } = {
  [SupportedChainId.FANTOM]: ["0x3eA3400D474B73941dda97d182a8aA80165f952e"],
  [SupportedChainId.BSC]: ["0x62ad8dE6740314677F06723a7A07797aE5082Dbb"],
  [SupportedChainId.BSC_TESTNET]: [
    "0x9a36a8e34412beF35c08f9b4ED7dC763b4E2c108",
  ],
  [SupportedChainId.BASE]: ["0xED85c23e307E0f40Cc38D6AA42fe25E0A5D07EA7"],
};

/* ###################################
                THIRD PARTY ADDRESS
################################### */

export const MULTICALL3_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: "0x1F98415757620B543A52E61c46B32eB19261F984",
  [SupportedChainId.ARBITRUM]: "0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB",
  [SupportedChainId.POLYGON]: "0x1F98415757620B543A52E61c46B32eB19261F984",
  [SupportedChainId.BSC]: "0x963Df249eD09c358A4819E39d9Cd5736c3087184",
  [SupportedChainId.FANTOM]: "0x8e7aceA52fE765D24FDC952400FC9Cf77ea0c8d9",
  [SupportedChainId.BSC_TESTNET]: "0x7C636D5611a6EA3B9eFA582ae0Db1DB93951446e",
  [SupportedChainId.BASE]: "0x66EC85c6d1971Ea15472754F733fA3F956a0Ec30",
};

/* ###################################
               TOKENS ADDRESS
################################### */

export const USDC_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [SupportedChainId.RINKEBY]: "0x49AC7cEDdb9464DA9274b164Cd6BA7129Da2C03E",
  [SupportedChainId.ARBITRUM]: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  [SupportedChainId.POLYGON]: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  [SupportedChainId.FANTOM]: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
  [SupportedChainId.BSC]: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  [SupportedChainId.BASE]: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
};

export const USDT_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
};

export const WRAPPED_NATIVE_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  [SupportedChainId.RINKEBY]: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  [SupportedChainId.ARBITRUM]: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  [SupportedChainId.POLYGON]: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  [SupportedChainId.FANTOM]: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
  [SupportedChainId.BSC]: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  [SupportedChainId.BSC_TESTNET]: "0x5b3e2bc1da86ff6235d9ead4504d598cae77dbcb",
  [SupportedChainId.BASE]: "0x4200000000000000000000000000000000000006",
};
