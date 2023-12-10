import { SupportedChainId } from "@symmio-client/core/constants/chains";
import { bsc, fantom, base, polygon, arbitrum, mainnet } from "wagmi/chains";

const supportedWagmiChain = {
  [SupportedChainId.FANTOM]: fantom,
  [SupportedChainId.BSC]: bsc,
  [SupportedChainId.BASE]: base,
  [SupportedChainId.POLYGON]: polygon,
  [SupportedChainId.ARBITRUM]: arbitrum,
  [SupportedChainId.MAINNET]: mainnet,
};

function getWagmiChain(supportChainList: number[]) {
  return supportChainList.map((chainId) => supportedWagmiChain[chainId]);
}

export const ClientChain = [SupportedChainId.BSC];

export const APP_CHAINS = getWagmiChain(ClientChain);

export const FALLBACK_CHAIN_ID = SupportedChainId.BSC;
