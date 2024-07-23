import styled from "styled-components";

import { useActiveMarket } from "@symmio/frontend-sdk/state/trade/hooks";
import useBidAskPrice from "@symmio/frontend-sdk/hooks/useBidAskPrice";

import { Name, Value } from ".";
import Column from "components/Column";
import { RowEnd } from "components/Row";
import BlinkingPrice from "components/App/FavoriteBar/BlinkingPrice";

const MarginColumn = styled(Column)`
  margin-left: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium` 
      margin-right: 5px;
      margin-left: unset;
  `};
`;

const MarketInfos = styled(RowEnd)`
  gap: 10px;
  flex: 1;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    gap: 10px;
  justify-content: center;
    flex-direction: row-reverse;
    width:100%;
  `};
`;

const MarketDepth = styled(RowEnd)`
  gap: 20px;
  width: unset;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: flex-start;

  `};
`;

export default function MarketDepths() {
  const activeMarket = useActiveMarket();
  const { ask, bid, spread } = useBidAskPrice(activeMarket);

  return (
    <MarketInfos>
      <MarginColumn>
        <Name textAlign={"center"} textAlignMedium={"center"}>
          Spread(bps)
        </Name>
        <Value textAlign={"center"} textAlignMedium={"center"}>
          {spread}
        </Value>
      </MarginColumn>
      <MarketDepth>
        <Column>
          <Name textAlign={"center"}>Bid</Name>
          <BlinkingPrice data={bid} textSize={"12px"} textAlign={"center"} />
        </Column>
        <Column>
          <Name textAlign={"center"}>Ask</Name>
          <BlinkingPrice data={ask} textSize={"center"} textAlign={"center"} />
        </Column>
      </MarketDepth>
    </MarketInfos>
  );
}
