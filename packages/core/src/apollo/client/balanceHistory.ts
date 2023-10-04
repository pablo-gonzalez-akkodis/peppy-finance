import { SupportedChainId } from "@symmio-client/core/constants/chains";
import { createApolloClient } from "./index";

const fantomClient = createApolloClient(
  `https://api.thegraph.com/subgraphs/name/${getSubgraphName(250)}`
);
const bscClient = createApolloClient(
  `https://api.thegraph.com/subgraphs/name/${getSubgraphName(56)}`
);
const bscTestnetClient = createApolloClient(
  `https://api.thegraph.com/subgraphs/name/${getSubgraphName(97)}`
);

export function getBalanceHistoryApolloClient(chainId: SupportedChainId) {
  switch (chainId) {
    case SupportedChainId.FANTOM:
      return fantomClient;
    case SupportedChainId.BSC:
      return bscClient;
    case SupportedChainId.BSC_TESTNET:
      return bscTestnetClient;
    default:
      console.error(`${chainId} is not a supported subgraph network`);
      return null;
  }
}

export function getSubgraphName(chainId: SupportedChainId) {
  switch (chainId) {
    case SupportedChainId.FANTOM:
      return "navid-fkh/symmetrical_fantom";
    case SupportedChainId.BSC:
      return "navid-fkh/symmetrical_bsc";
    case SupportedChainId.BSC_TESTNET:
      return "";
    default:
      console.error(`${chainId} is not a supported subgraph network`);
      return null;
  }
}
