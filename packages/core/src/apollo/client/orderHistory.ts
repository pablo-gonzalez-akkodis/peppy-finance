import { SupportedChainId } from "../../constants/chains";
import { createApolloClient } from "./index";

const polygonClient = createApolloClient(
  `https://api.thegraph.com/subgraphs/name/${getSubgraphName(
    SupportedChainId.POLYGON
  )}`
);

export function getOrderHistoryApolloClient(chainId: SupportedChainId) {
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
      return "symmiograph/symmiomain_polygon_8_2";
    default:
      console.error(`${chainId} is not a supported subgraph network`);
      return null;
  }
}
