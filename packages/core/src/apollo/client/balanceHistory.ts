import { SupportedChainId } from "../../constants/chains";
import { createApolloClient } from "./index";

// ANALYTICS SUBGRAPH

const polygonClient = createApolloClient(
  `${getSubgraphName(SupportedChainId.POLYGON)}`
);

const bscClient = createApolloClient(
  `${getSubgraphName(SupportedChainId.BSC)}`
);

export function getBalanceHistoryApolloClient(chainId: SupportedChainId) {
  switch (chainId) {
    case SupportedChainId.POLYGON:
      return polygonClient;
    case SupportedChainId.BSC:
      return bscClient;

    default:
      console.error(`${chainId} is not a supported subgraph network`);
      return null;
  }
}

export function getSubgraphName(chainId: SupportedChainId) {
  switch (chainId) {
    case SupportedChainId.POLYGON:
      return "https://api.thegraph.com/subgraphs/name/symmiograph/symmioanalytics_polygon_8_2";
    case SupportedChainId.BSC:
      return "https://api.thegraph.com/subgraphs/name/symmiograph/symmioanalytics_bnb_8_2";

    default:
      console.error(`${chainId} is not a supported subgraph network`);
      return null;
  }
}
