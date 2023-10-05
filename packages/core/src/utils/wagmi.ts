import { configureChains, createConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  rabbyWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  safeWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { APP_CHAINS } from "../constants/chains";
import { APP_NAME } from "../constants/misc";

export const getWagmiConfig = () => {
  if (!process.env.NEXT_PUBLIC_INFURA_KEY) {
    throw new Error("NEXT_PUBLIC_INFURA_KEY not provided");
  }

  if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
    throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID not provided");
  }

  //TODO  use our rpcUrls like bellow
  /**
   [
    jsonRpcProvider({
      rpc: (chain) => ({ http: getRpcUrl(chain.id as SupportedChainId) }),
    }),
    publicProvider(),
  ],
   */
  const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
  const { chains, publicClient } = configureChains(
    APP_CHAINS,
    [
      infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY }),
      publicProvider(),
    ],
    {
      batch: { multicall: true },
      retryCount: 5,
      pollingInterval: 2_000,
      stallTimeout: 2_000,
    }
  );

  // const { connectors } = getDefaultWallets({
  //   appName: APP_NAME,
  //   projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  //   chains,
  // })

  const connectors = connectorsForWallets([
    {
      groupName: "Popular",

      wallets: [
        injectedWallet({ chains }),
        metaMaskWallet({ projectId, chains }),
        rabbyWallet({ chains }),
        walletConnectWallet({ projectId, chains }),
      ],
    },
    {
      groupName: "Others",
      wallets: [
        coinbaseWallet({ chains, appName: APP_NAME }),
        rainbowWallet({ projectId, chains }),
        safeWallet({ chains }),
      ],
    },
  ]);

  return {
    wagmiConfig: createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    }),
    chains,
    initialChain: chains[0],
  };
};
