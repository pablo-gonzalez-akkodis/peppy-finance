import React from "react";
import Image from "next/legacy/image";
import styled from "styled-components";
import { useDetectAdBlock } from "adblock-detect-react";

import LOADING_CHART from "/public/static/images/etc/LoadChart.svg";

import { useActiveMarket } from "@symmio/frontend-sdk/state/trade/hooks";

import { Card } from "components/Card";
import { AlphaLottie } from "components/Icons";
import TVChart from "components/App/Chart/TVChart";
import { RowCenter } from "components/Row";

const Wrapper = styled(Card)`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  border-radius: 10px;
  position: relative;
  background: rgba(233, 232, 237, 0.3) !important;
  box-shadow: 0px 0px 3px 0px rgba(254, 251, 224, 0.2) inset;
  backdrop-filter: blur(15px);
  justify-content: center;
`;

const AdBlockText = styled(RowCenter)`
  width: 100%;
  font-size: 16px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text1};
`;

const WarningText = styled.span`
  font-size: 16px;
  margin: 0px 4px;
  color: ${({ theme }) => theme.warning};
`;

const LoadChartImage = styled.div`
  text-align: center;
`;

export default function Chart() {
  const adBlockDetected = useDetectAdBlock();
  const market = useActiveMarket();

  return (
    <Wrapper>
      {adBlockDetected ? (
        <>
          <LoadChartImage>
            <Image
              src={LOADING_CHART}
              alt={"load_chart"}
              width={182}
              height={184}
            />
          </LoadChartImage>
          <AdBlockText>Cannot load chart</AdBlockText>
          <AdBlockText>
            (The chart can not be loaded while your
            <WarningText>ad blocker</WarningText> is ON)
          </AdBlockText>
        </>
      ) : !market ? (
        <AlphaLottie />
      ) : (
        <TVChart symbol={`BINANCE:${market?.name}.P`} />
      )}
    </Wrapper>
  );
}
