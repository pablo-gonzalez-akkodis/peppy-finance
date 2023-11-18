import { SupportedChainId } from "../../constants/chains";
import { createApolloClient } from "./index";

const fantomClient = createApolloClient(
  `https://api.thegraph.com/subgraphs/name/${getSubgraphName(
    SupportedChainId.FANTOM
  )}`
);
const bscClient = createApolloClient(
  `https://api.thegraph.com/subgraphs/name/${getSubgraphName(
    SupportedChainId.BSC
  )}`
);
const bscTestnetClient = createApolloClient(
  `https://api.thegraph.com/subgraphs/name/${getSubgraphName(
    SupportedChainId.BSC_TESTNET
  )}`
);
const polygonClient = createApolloClient(
  `https://api.thegraph.com/subgraphs/name/${getSubgraphName(
    SupportedChainId.POLYGON
  )}`
);

export function getOrderHistoryApolloClient(chainId: SupportedChainId) {
  switch (chainId) {
    case SupportedChainId.POLYGON:
      return polygonClient;
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
    case SupportedChainId.POLYGON:
      return "symmiograph/symmioanalytics_polygon_8_2";
    case SupportedChainId.FANTOM:
      return "navid-fkh/symmio_fantom";
    case SupportedChainId.BSC:
      return "navid-fkh/symmio_bsc";
    case SupportedChainId.BSC_TESTNET:
      return "navid-fkh/symmio_bsc";
    default:
      console.error(`${chainId} is not a supported subgraph network`);
      return null;
  }
}
