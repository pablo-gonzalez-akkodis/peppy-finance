import React from "react";
import styled from "styled-components";

import MarketsTable from "./MarketsTable";
import WrapperBanner from "components/Banner";

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  border-radius: 4px;
`;

const TableWrapper = styled.div`
  position: relative;
  margin-top: 60px;
  z-index: 9;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 15px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 20px;
  `}
`;

export default function Markets() {
  return (
    <Container>
      <WrapperBanner />
      <TableWrapper className="boxStyling">
        <MarketsTable />
      </TableWrapper>
    </Container>
  );
}
