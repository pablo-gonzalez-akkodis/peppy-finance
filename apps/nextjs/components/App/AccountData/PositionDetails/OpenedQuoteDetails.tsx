import { useTheme } from "styled-components";
import React, { useEffect, useState } from "react";

import useActiveWagmi from "@symmio/frontend-sdk/lib/hooks/useActiveWagmi";

import { useCollateralToken } from "@symmio/frontend-sdk/constants/tokens";
import { Quote, QuoteStatus } from "@symmio/frontend-sdk/types/quote";
import { PositionType } from "@symmio/frontend-sdk/types/trade";
import { formatTimestamp } from "@symmio/frontend-sdk/utils/time";
import { useGetTokenWithFallbackChainId } from "@symmio/frontend-sdk/utils/token";
import {
  formatAmount,
  toBN,
  formatCurrency,
} from "@symmio/frontend-sdk/utils/numbers";

import { useMarketData } from "@symmio/frontend-sdk/state/hedger/hooks";
import { useMarket } from "@symmio/frontend-sdk/hooks/useMarkets";
import useBidAskPrice from "@symmio/frontend-sdk/hooks/useBidAskPrice";
import {
  useLockedMargin,
  useQuoteLeverage,
  useQuoteSize,
  useQuoteUpnlAndPnl,
} from "@symmio/frontend-sdk/hooks/useQuotes";
import { useNotionalValue } from "@symmio/frontend-sdk/hooks/useTradePage";

import { RowEnd, Row as RowComponent } from "components/Row";
import ClosePendingDetails from "./ClosedSizeDetails/ClosePendingDetails";
import ClosedAmountDetails from "./ClosedSizeDetails/ClosedAmountDetails";
import { LongArrow, ShortArrow } from "components/Icons";
import BlinkingPrice from "components/App/FavoriteBar/BlinkingPrice";
import { PositionActionButton } from "components/Button";
import {
  Wrapper,
  MarketName,
  Leverage,
  QuoteData,
  PositionInfoBox,
  TopWrap,
  PositionPnl,
  ContentWrapper,
  DataWrap,
  Label,
  Value,
  Row,
  Chevron,
  RowPnl,
  FlexColumn,
} from "components/App/AccountData/PositionDetails/styles";
import PositionDetailsNavigator from "./PositionDetailsNavigator";

// const ShareOnTwitterButton = styled(RowEnd)`
//   width: 40%;
//   height: 20px;
//   font-size: 10px;
//   font-weight: 500;
//   border-radius: 2px;
//   cursor: pointer;
//   padding: 4px 4px 4px 8px;
//   color: ${({ theme }) => theme.text0};
//   background: ${({ theme }) => theme.twitter};
// `

export default function OpenedQuoteDetails({
  quote,
  platformFee,
  buttonText,
  disableButton,
  expired,
  onClickButton,
  mobileVersion = false,
}: {
  quote: Quote;
  platformFee: string;
  buttonText?: string;
  disableButton?: boolean;
  expired?: boolean;
  onClickButton?: (event: React.MouseEvent<HTMLDivElement>) => void;
  mobileVersion: boolean;
}): JSX.Element {
  const theme = useTheme();
  const { chainId } = useActiveWagmi();
  const {
    id,
    positionType,
    marketId,
    openedPrice,
    quoteStatus,
    avgClosedPrice,
    createTimestamp,
    modifyTimestamp,
  } = quote;
  const market = useMarket(marketId);
  const { symbol, name, asset } = market || {};
  const { ask: askPrice, bid: bidPrice } = useBidAskPrice(market);
  const COLLATERAL_TOKEN = useCollateralToken();
  const collateralCurrency = useGetTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );
  const marketData = useMarketData(name);
  const quoteSize = useQuoteSize(quote);
  const leverage = useQuoteLeverage(quote);
  const lockedAmount = useLockedMargin(quote);
  const notionalValue = useNotionalValue(quoteSize, marketData?.markPrice || 0);
  const closePositionValue = toBN(avgClosedPrice).times(quoteSize);
  const [upnl, pnl] = useQuoteUpnlAndPnl(
    quote,
    marketData?.markPrice || 0,
    undefined,
    undefined
  );
  const [expanded, setExpanded] = useState(!mobileVersion);
  // const [sharePositionModal, togglePositionModal] = useState(false)
  useEffect(() => {
    if (!mobileVersion) {
      setExpanded(true);
    }
  }, [mobileVersion]);
  function getPnlData(value: string) {
    const valueBN = toBN(value);
    const valuePercent = valueBN
      .div(quoteSize)
      .div(openedPrice)
      .times(leverage)
      .times(100)
      .toFixed(2);
    if (!marketData?.markPrice) return ["-", "-", theme.text0];
    if (valueBN.isGreaterThan(0))
      return [`+ $${formatAmount(valueBN)}`, valuePercent, theme.green1];
    else if (valueBN.isLessThan(0))
      return [
        `- $${formatAmount(Math.abs(valueBN.toNumber()))}`,
        valuePercent,
        theme.red1,
      ];
    return [`$${formatAmount(valueBN)}`, valuePercent, theme.text1];
  }

  const [uPnl, upnlPercent, upnlColor] = getPnlData(upnl);
  const [PNL, PNLPercent, PNLColor] = getPnlData(pnl);

  return (
    <>
      <TopWrap
        onClick={() => {
          if (mobileVersion) {
            setExpanded(!expanded);
          }
        }}
        mobileVersion={mobileVersion}
        expand={expanded}
      >
        <FlexColumn flex={buttonText ? 2 : 4} alignItems={"flex-start"}>
          <PositionInfoBox>
            <RowComponent width={"initial"}>
              <MarketName>
                <div>
                  {symbol}-{asset}
                </div>
                <div>-Q{id}</div>
              </MarketName>
              <Leverage>{leverage}x</Leverage>
              <QuoteData>
                {positionType}
                {positionType === PositionType.LONG ? (
                  <LongArrow width={16} height={12} color={theme.green1} />
                ) : (
                  <ShortArrow width={16} height={12} color={theme.red1} />
                )}
              </QuoteData>
            </RowComponent>
            {!mobileVersion && <PositionDetailsNavigator />}
          </PositionInfoBox>
          {/* {quoteStatus === QuoteStatus.CLOSED && (
          <ShareOnTwitterButton onClick={() => togglePositionModal(!sharePositionModal)}>
            <RowStart>Share on Twitter</RowStart>
            <RowEnd width={'23%'}>
              <Image src={TWITTER_ICON} width={19} height={16} alt={`twitter_icon`} />
            </RowEnd>
          </ShareOnTwitterButton>
        )} */}

          {mobileVersion &&
            (quoteStatus === QuoteStatus.CLOSED ? ( // fix this - write ueseMemo
              <RowPnl>
                <Label>PNL:</Label>
                <PositionPnl color={PNLColor}>{`${PNL} (${Math.abs(
                  Number(PNLPercent)
                )}%)`}</PositionPnl>
              </RowPnl>
            ) : (
              <RowPnl>
                <Label>uPNL:</Label>
                <PositionPnl color={upnlColor}>
                  {uPnl === "-"
                    ? uPnl
                    : `${uPnl} (${Math.abs(Number(upnlPercent))}%)`}
                </PositionPnl>
              </RowPnl>
            ))}
        </FlexColumn>
        {mobileVersion && (
          <FlexColumn flex={1} alignItems={"flex-end"}>
            {buttonText && (
              <PositionActionButton
                expired={expired}
                disabled={disableButton}
                onClick={onClickButton}
              >
                {buttonText}
              </PositionActionButton>
            )}
            <Chevron open={expanded} />
          </FlexColumn>
        )}
      </TopWrap>

      {expanded && (
        <Wrapper>
          <ClosePendingDetails quote={quote} />

          <DataWrap>
            {quoteStatus === QuoteStatus.CLOSED ? (
              <Row>
                <Label>PNL:</Label>
                <RowEnd>
                  <PositionPnl color={PNLColor}>{`${PNL} (${Math.abs(
                    Number(PNLPercent)
                  )}%)`}</PositionPnl>
                </RowEnd>
              </Row>
            ) : (
              <Row>
                <Label>uPNL:</Label>
                <RowEnd>
                  <PositionPnl color={upnlColor}>
                    {uPnl === "-"
                      ? uPnl
                      : `${uPnl} (${Math.abs(Number(upnlPercent))}%)`}
                  </PositionPnl>
                </RowEnd>
              </Row>
            )}
            {quoteStatus === QuoteStatus.CLOSED ? (
              <Row>
                <Label>Position Value:</Label>
                <Value>
                  {closePositionValue.isEqualTo(0)
                    ? "-"
                    : `${formatCurrency(closePositionValue)} ${
                        collateralCurrency?.symbol
                      }`}
                </Value>
              </Row>
            ) : (
              <Row>
                <Label>Position Value:</Label>
                <Value>
                  {toBN(notionalValue).isEqualTo(0)
                    ? "-"
                    : `${formatCurrency(notionalValue)} ${
                        collateralCurrency?.symbol
                      }`}
                </Value>
              </Row>
            )}
            <Row>
              <Label>Position Size:</Label>
              <Value>{`${formatAmount(quoteSize)} ${symbol}`}</Value>
            </Row>

            <Row>
              <Label>Open Price</Label>
              <Value>{`${formatAmount(openedPrice)} ${
                collateralCurrency?.symbol
              }`}</Value>
            </Row>

            {quoteStatus === QuoteStatus.CLOSED ? (
              <Row>
                <Label>Closed Price:</Label>
                <Value>{`${formatAmount(avgClosedPrice)} ${
                  collateralCurrency?.symbol
                }`}</Value>
              </Row>
            ) : (
              <>
                {positionType === PositionType.LONG ? (
                  <Row>
                    <Label>Bid Price:</Label>
                    <Value>
                      {/* `${formatCurrency(bidPrice)} ${collateralCurrency?.symbol}` */}
                      {bidPrice === "0" ? (
                        "-"
                      ) : (
                        <BlinkingPrice
                          data={bidPrice}
                          textSize={mobileVersion ? "12px" : "14px"}
                        />
                      )}
                    </Value>
                  </Row>
                ) : (
                  <Row>
                    <Label>Ask Price:</Label>
                    <Value>
                      {/* `${formatCurrency(askPrice)} ${collateralCurrency?.symbol}` */}
                      {askPrice === "0" ? (
                        "-"
                      ) : (
                        <BlinkingPrice
                          data={askPrice}
                          textSize={mobileVersion ? "12px" : "14px"}
                        />
                      )}
                    </Value>
                  </Row>
                )}
              </>
            )}
          </DataWrap>
          <ClosedAmountDetails quote={quote} />
          <ContentWrapper>
            <Row>
              <Label>Created Time:</Label>
              <Value>{formatTimestamp(createTimestamp * 1000)}</Value>
            </Row>
            {quoteStatus === QuoteStatus.CLOSED ? (
              <Row>
                <Label>Close Time:</Label>
                <Value>{formatTimestamp(modifyTimestamp * 1000)}</Value>
              </Row>
            ) : (
              <Row>
                <Label>Last modified Time:</Label>
                <Value>{formatTimestamp(modifyTimestamp * 1000)}</Value>
              </Row>
            )}
            <Row>
              <Label>Locked Amount:</Label>
              <Value>{`${formatAmount(lockedAmount, 6, true)} ${
                collateralCurrency?.symbol
              }`}</Value>
            </Row>
            <Row>
              <Label>Platform Fee:</Label>
              <Value>{`${formatAmount(platformFee, 6, true)} ${
                collateralCurrency?.symbol
              }`}</Value>
            </Row>
          </ContentWrapper>
        </Wrapper>
      )}

      {/* <SharePositionModal
        title={'Share on twitter'}
        quote={quote}
        isOpen={sharePositionModal}
        toggleModal={togglePositionModal}
      /> */}
    </>
  );
}
