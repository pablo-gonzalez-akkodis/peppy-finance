import { SupportedChainId } from "../../constants/chains";
import { createApolloClient } from "./index";

const polygonClient = createApolloClient(
  `${getSubgraphName(SupportedChainId.POLYGON)}`
);

const bscClient = createApolloClient(
  `${getSubgraphName(SupportedChainId.BSC)}`
);

export function getOrderHistoryApolloClient(chainId: SupportedChainId) {
  switch (chainId) {
    case SupportedChainId.BSC:
      return bscClient;
    case SupportedChainId.POLYGON:
      return polygonClient;
    default:
      console.error(`${chainId} is not a supported subgraph network`);
      return null;
  }
}

export function getSubgraphName(chainId: SupportedChainId) {
  switch (chainId) {
    case SupportedChainId.BSC:
      return "https://api.studio.thegraph.com/query/62454/main_bnb_8_2/version/latest";
    case SupportedChainId.POLYGON:
      return "https://api.studio.thegraph.com/query/62454/main_bnb_8_2/version/latest";
    default:
      console.error(`${chainId} is not a supported subgraph network`);
      return null;
  }
}
