import { SupportedChainId } from "../../constants/chains";
import { createApolloClient } from "./index";

const polygonClient = createApolloClient(
  `https://api.thegraph.com/subgraphs/name/${getSubgraphName(250)}`
);

export function getBalanceHistoryApolloClient(chainId: SupportedChainId) {
  switch (chainId) {
    case SupportedChainId.POLYGON:
      return polygonClient;

    default:
      console.error(`${chainId} is not a supported subgraph network`);
      return null;
  }
}

export function getSubgraphName(chainId: SupportedChainId) {
  switch (chainId) {
    case SupportedChainId.POLYGON:
      return "symmiograph/symmioanalytics_polygon_8_2";

    default:
      console.error(`${chainId} is not a supported subgraph network`);
      return null;
  }
}
