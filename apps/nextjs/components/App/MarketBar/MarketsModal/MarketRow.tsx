import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import { Market } from "@symmio-client/core/types/market";

import { useActiveMarket } from "@symmio-client/core/state/trade/hooks";
import {
  useFavorites,
  useToggleUserFavoriteCallback,
} from "@symmio-client/core/state/user/hooks";

import { RowEnd, RowStart } from "components/Row";
import { Star } from "components/Icons";

const Row = styled(RowStart)<{ active: boolean }>`
  z-index: 0;
  background: ${({ theme, active }) => (active ? theme.bg3 : "inherit")};
  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.bg3};
  }
`;

const StarWrap = styled.div`
  width: 36px;
  height: 36px;
  padding: 10px;
  border-radius: 4px;
  background: ${({ theme }) => theme.black2};
`;

const Text = styled.div<{ active?: boolean; width?: string }>`
  font-weight: 500;
  font-size: 14px;
  height: 44px;
  padding: 14px;

  width: ${({ width }) => width ?? "100%"};
  color: ${({ theme, active }) => (active ? theme.primaryBlue : theme.text1)};

  ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 12px;
  
    `};
`;

export default function MarketRow({
  market,
  onDismiss,
}: {
  market: Market;
  onDismiss: () => void;
}) {
  const router = useRouter();
  const toggleFavorite = useToggleUserFavoriteCallback(market.symbol);
  const activeMarket = useActiveMarket();

  const favorites = useFavorites();
  const isFavorite = favorites?.includes(market.symbol);

  const isActive = useMemo(
    () => market.symbol === activeMarket?.symbol,
    [market, activeMarket]
  );

  const onClick = useCallback(() => {
    router.push(`/trade/${market.name}`);
    onDismiss();
  }, [router, market.name, onDismiss]);

  return (
    <Row active={isActive}>
      <Text onClick={onClick} active={isActive} width={"90%"}>
        {market.symbol} / {market.asset}
      </Text>

      <RowEnd width={"10%"} style={{ marginRight: "12px" }}>
        <StarWrap onClick={toggleFavorite}>
          <Star
            size={16}
            isFavorite={isFavorite}
            style={{
              zIndex: 99,
            }}
          />
        </StarWrap>
      </RowEnd>
    </Row>
  );
}
