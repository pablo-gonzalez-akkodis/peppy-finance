import { SupportedChainId } from "@symmio/frontend-sdk/constants/chains";
import {
  bsc,
  fantom,
  base,
  polygon,
  arbitrum,
  mainnet,
  mantle,
} from "wagmi/chains";
import { FrontEndsName } from "./addresses";

const supportedWagmiChain = {
  [SupportedChainId.FANTOM]: fantom,
  [SupportedChainId.BSC]: bsc,
  [SupportedChainId.BASE]: base,
  [SupportedChainId.POLYGON]: polygon,
  [SupportedChainId.ARBITRUM]: arbitrum,
  [SupportedChainId.MAINNET]: mainnet,
  [SupportedChainId.MANTLE]: mantle,
};

function getWagmiChain(supportChainList: number[]) {
  return supportChainList.map((chainId) => supportedWagmiChain[chainId]);
}

export const ClientChain = [SupportedChainId.BSC];

export const APP_CHAINS = getWagmiChain(ClientChain);

export const FALLBACK_CHAIN_ID = SupportedChainId.BSC;
export const FALLBACK_FE_NAME = FrontEndsName.ALPHA;
