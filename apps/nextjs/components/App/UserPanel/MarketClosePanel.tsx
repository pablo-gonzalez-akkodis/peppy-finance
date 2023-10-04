import React, { useState } from "react";
import styled from "styled-components";

import { formatAmount } from "@symmio-client/core/utils/numbers";

import { CustomInputBox2 } from "components/InputBox";
import { Quote } from "@symmio-client/core/types/quote";
import { useMarket } from "@symmio-client/core/hooks/useMarkets";
import { useMarketData } from "@symmio-client/core/state/hedger/hooks";
import { RowBetween, RowEnd } from "components/Row";
import { InnerCard } from "components/Card";
import { Column } from "components/Column";
import SlippageTolerance from "components/App/SlippageTolerance";

const Wrapper = styled(Column)`
  & > * {
    &:nth-child(2) {
      margin-top: 16px;
    }
    &:nth-child(3) {
      margin-top: 16px;
    }
    &:nth-child(4) {
      margin-top: 20px;
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`;

// const DefaultOptionButton = styled.div<{ active?: boolean }>`
//   padding: 4px 8px;
//   font-size: 12px;
//   width: 100px;
//   height: 28px;
//   border-radius: 4px;
//   white-space: nowrap;
//   display: inline-flex;
//   justify-content: flex-end;
//   background: ${({ theme }) => theme.bg4};
//   color: ${({ theme }) => theme.text1};
//   border: 1px solid ${({ theme }) => theme.bg6};

//   &:hover {
//     cursor: pointer;
//   }

//   ${({ theme }) => theme.mediaWidth.upToSmall`
//       // margin-right: 5px;
//       white-space: normal;
//   `}
// `
const PriceWrap = styled(InnerCard)`
  padding-top: 8px;
  & > * {
    &:last-child {
      height: 28px;
      margin-top: 12px;
    }
  }
`;

const Title = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 12px;
  font-weight: 400;
`;

export const InputAmount = styled.input.attrs({ type: "number" })<{
  active?: boolean;
}>`
  border: 0;
  outline: none;
  width: 100%;
  margin-right: 2px;
  margin-left: 2px;
  font-size: 12px;
  background: transparent;
  color: ${({ theme }) => theme.text0};

  appearance: textfield;

  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ${({ active, theme }) =>
    active &&
    `
    color: ${theme.text0};
  `}
`;

export default function MarketClosePanel({ quote }: { quote: Quote | null }) {
  const { name: marketName, symbol } = useMarket(quote?.marketId) || {};
  const { markPrice } = useMarketData(marketName) || {};
  const [closePrice, setClosePrice] = useState("");
  // const slippage = useSlippageTolerance()
  // const [amount, setAmount] = useState<string | number>(slippage)
  // const setSlippage = useSetSlippageToleranceCallback()

  // const handleMinAmount = useCallback(() => {
  //   if (amount && Number(amount) < 0) {
  //     setAmount(0)
  //   } else if (amount && Number(amount) > 0) {
  //     setSlippage(Number(amount))
  //   }
  // }, [amount, setAmount, setSlippage])

  // const handleCustomChange = useCallback(
  //   (e: any) => {
  //     const value = e.currentTarget.value
  //     if (value !== '' && Number(value) >= 0) {
  //       setAmount(value)
  //       setSlippage(Number(value))
  //     } else {
  //       setAmount(value)
  //     }
  //   },
  //   [setAmount, setSlippage]
  // )

  return (
    <Wrapper>
      <PriceWrap>
        <RowBetween>
          <Title>Market Price</Title>
          <div>{formatAmount(markPrice, 6)} fUSDT</div>
        </RowBetween>
        <RowBetween>
          <Title>Slippage</Title>
          <RowEnd>
            {/* <DefaultOptionButton active={true}>
              <InputAmount
                value={amount ? (Number(amount) >= 0 ? amount : '') : ''}
                active={true}
                onBlur={() => {
                  handleMinAmount()
                }}
                onChange={(e) => handleCustomChange(e)}
                placeholder={amount ? amount.toString() : '0.0'}
              />
              %
            </DefaultOptionButton> */}
            <SlippageTolerance />
          </RowEnd>
        </RowBetween>
      </PriceWrap>

      <CustomInputBox2
        title={"Size"}
        symbol={symbol}
        placeholder="0"
        balanceTitle={"Available:"}
        balanceDisplay={formatAmount(quote?.quantity, 8)}
        balanceExact={quote?.quantity}
        onChange={setClosePrice}
        value={closePrice}
      />
    </Wrapper>
  );
}
