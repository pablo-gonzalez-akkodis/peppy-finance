import { StaticImageData } from "next/legacy/image";
import { SupportedChainId } from "./chains";

interface Info {
  chainId: string;
  chainName: string;
  label: string;
  logoUrl: StaticImageData;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
  blockExplorerUrl: string;
}

export const ChainInfo: { [chainId: number]: Info } = {
  [SupportedChainId.MAINNET]: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    label: "Ethereum",
    logoUrl: require("/public/static/images/networks/mainnet.svg"),
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl: "https://mainnet.infura.io/v3/",
    blockExplorerUrl: "https://etherscan.io",
  },
  [SupportedChainId.ROPSTEN]: {
    chainId: "0x3",
    chainName: "Ropsten Testnet",
    label: "Ropsten",
    logoUrl: require("/public/static/images/networks/mainnet.svg"),
    nativeCurrency: {
      name: "Ropsten Ether",
      symbol: "ropETH",
      decimals: 18,
    },
    rpcUrl: "https://ropsten.infura.io/v3/",
    blockExplorerUrl: "https://ropsten.etherscan.io",
  },
  [SupportedChainId.RINKEBY]: {
    chainId: "0x4",
    chainName: "Rinkeby Testnet",
    label: "Rinkeby",
    logoUrl: require("/public/static/images/networks/mainnet.svg"),
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl: "https://rinkeby.infura.io/v3/",
    blockExplorerUrl: "https://rinkeby.etherscan.io",
  },
  [SupportedChainId.BSC]: {
    chainId: "0x38",
    chainName: "BNB Smart Chain",
    label: "BNB",
    logoUrl: require("/public/static/images/networks/binance.svg"),
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrl: "https://bsc-dataseed1.binance.org",
    blockExplorerUrl: "https://bscscan.com",
  },
  [SupportedChainId.BSC_TESTNET]: {
    chainId: "0x61",
    chainName: "Binance Smart Chain Testnet",
    label: "Test BSC",
    logoUrl: require("/public/static/images/networks/binance.svg"),
    nativeCurrency: {
      name: "tBNB",
      symbol: "tBNB",
      decimals: 18,
    },
    rpcUrl: "https://bsc-testnet.public.blastapi.io",
    // rpcUrl: 'https://data-seed-prebsc-1-s3.binance.org:8545/',
    blockExplorerUrl: "https://testnet.bscscan.com/",
  },
  [SupportedChainId.POLYGON]: {
    chainId: "0x89",
    chainName: "Matic Mainnet",
    label: "Polygon",
    logoUrl: require("/public/static/images/networks/polygon.svg"),
    nativeCurrency: {
      name: "MATIC",
      symbol: "Matic",
      decimals: 18,
    },
    rpcUrl: "https://polygon-rpc.com",
    blockExplorerUrl: "https://polygonscan.com",
  },
  [SupportedChainId.FANTOM]: {
    chainId: "0xfa",
    chainName: "Fantom Opera",
    label: "Fantom",
    logoUrl: require("/public/static/images/networks/fantom.svg"),
    nativeCurrency: {
      name: "FTM",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrl: "https://rpc.ftm.tools",
    blockExplorerUrl: "https://ftmscan.com",
  },
  [SupportedChainId.ARBITRUM]: {
    chainId: "0xA4B1",
    chainName: "Arbitrum",
    label: "Arbitrum",
    logoUrl: require("/public/static/images/networks/arbitrum.png"),
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    blockExplorerUrl: "https://arbiscan.io",
  },
  [SupportedChainId.BASE]: {
    chainId: "0x2105",
    chainName: "Base",
    label: "Base",
    logoUrl: require("/public/static/images/networks/base.png"),
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl: "https://mainnet.base.org",
    blockExplorerUrl: "https://basescan.org/",
  },
};

/**
 * Overloaded method for returning ChainInfo given a chainID
 * Return type varies depending on input type:
 * number | undefined -> returns ChainInfo | undefined
 * SupportedChainId -> returns L1ChainInfo | L2ChainInfo
 * SupportedL1ChainId -> returns L1ChainInfo
 * SupportedL2ChainId -> returns L2ChainInfo
 */
export function getChainInfo(chainId: any): any {
  if (chainId) {
    return ChainInfo[chainId] ?? undefined;
  }
  return undefined;
}
