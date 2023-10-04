import React, { useCallback } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import { Market } from "@symmio-client/core/types/market";

import { useFavoriteMarkets } from "@symmio-client/core/hooks/useMarkets";

import { Row, RowCenter } from "components/Row";
import { GradientStar } from "components/Icons";
import BlinkingPrice from "components/App/FavoriteBar/BlinkingPrice";

const Wrapper = styled(Row)`
  min-height: 46px;
  border-radius: 4px;
  background: ${({ theme }) => theme.bg0};
`;

const FavoritesWrap = styled(Row)`
  height: 100%;
  padding: 8px;
  position: relative;
  width: 0px;
  z-index: 1;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1 1 0%;
  border-radius: 4px;
  margin-left: 12px;
  background: ${({ theme }) => theme.bg0};
`;

const Item = styled(RowCenter)`
  min-width: 180px;
  width: unset;
  height: 30px;
  padding: 8px 12px;
  margin: 0px 7.5px;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.bg5};
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 130px;
  `};
`;

const Empty = styled(RowCenter)`
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
`;

const Name = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  white-space: nowrap;
  margin-right: 8px;
  margin-top: 1px;
  color: ${({ theme }) => theme.text1};
`;

export default function FavoriteBar() {
  const favorites = useFavoriteMarkets();

  return (
    <Wrapper>
      <GradientStar
        style={{
          zIndex: 99,
          marginLeft: "16px",
        }}
      />
      <FavoritesWrap>
        {favorites.length > 0 ? (
          favorites.map((favorite, index) => (
            <FavoriteItem market={favorite} key={index} />
          ))
        ) : (
          <Empty>There are no markets in your Favorites List</Empty>
        )}
      </FavoritesWrap>
    </Wrapper>
  );
}

function FavoriteItem({ market }: { market: Market }) {
  const router = useRouter();

  const onClick = useCallback(() => {
    router.push(`/trade/${market.name}`);
  }, [router, market]);

  return (
    <Item onClick={onClick}>
      <Name>
        {market.symbol} / {market.asset}
      </Name>
      <BlinkingPrice market={market} />
    </Item>
  );
}
