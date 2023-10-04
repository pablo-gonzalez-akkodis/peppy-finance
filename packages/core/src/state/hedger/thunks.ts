import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeHttpRequest } from "@symmio-client/core/utils/http";
import { Market } from "@symmio-client/core/types/market";
import { OpenInterest } from "@symmio-client/core/types/hedger";
import {
  DepthResponse,
  ErrorMessages,
  MarketDepthData,
  MarketDepthMap,
  MarketNotionalCap,
  MarketsInfo,
  PriceRange,
} from "./types";

export const getMarkets = createAsyncThunk(
  "hedger/getAllApi",
  async (hedgerUrl: string | undefined) => {
    if (!hedgerUrl) {
      throw new Error("hedgerUrl is empty");
    }

    const { href: marketsUrl } = new URL(`contract-symbols`, hedgerUrl);
    const { href: openUrl } = new URL(`open-interest`, hedgerUrl);
    const { href: errorMessagesUrl } = new URL(`error_codes`, hedgerUrl);

    let count = 0;
    let markets: Market[] = [];
    let errorMessages: ErrorMessages = {};
    const openInterest: OpenInterest = { used: 0, total: 0 };

    try {
      const [marketsRes, openRes, errorMessagesRes] = await Promise.allSettled([
        makeHttpRequest(marketsUrl),
        makeHttpRequest(openUrl),
        makeHttpRequest(errorMessagesUrl),
      ]);

      if (marketsRes.status === "fulfilled") {
        if (marketsRes.value.symbols) {
          markets = marketsRes.value.symbols.map((market: any) => ({
            id: market.symbol_id,
            name: market.name,
            symbol: market.symbol,
            asset: market.asset,
            pricePrecision: market.price_precision,
            quantityPrecision: market.quantity_precision,
            isValid: market.is_valid,
            minAcceptableQuoteValue: market.min_acceptable_quote_value,
            minAcceptablePortionLF: market.min_acceptable_portion_lf,
            tradingFee: market.trading_fee,
            maxLeverage: market.max_leverage,
            maxNotionalValue: market.max_notional_value,
          }));
          count = marketsRes.value.count;
        }

        if (openRes.status === "fulfilled") {
          openInterest.total = openRes.value.total_cap;
          openInterest.used = openRes.value.used;
        }
        if (errorMessagesRes.status === "fulfilled") {
          errorMessages = errorMessagesRes.value;
        }
      }
    } catch (error) {
      console.error(error, "happened in getHedgerMarkets");
    }

    return { markets, count, openInterest, errorMessages };
  }
);

export const getNotionalCap = createAsyncThunk(
  "hedger/getNotionalCap",
  async ({
    hedgerUrl,
    market,
    preNotional,
  }: {
    hedgerUrl: string | undefined;
    market: Market | undefined;
    preNotional?: MarketNotionalCap;
  }) => {
    if (!hedgerUrl) {
      throw new Error("hedgerUrl is empty");
    }
    if (!market) {
      throw new Error("market is empty");
    }

    const { href: notionalCapUrl } = new URL(
      `notional_cap/${market.name}`,
      hedgerUrl
    );

    const notionalCap: MarketNotionalCap = { name: "", totalCap: -1, used: -1 };

    // add this part to have previous value if api doesn't working
    if (
      preNotional &&
      preNotional.name === market.name &&
      preNotional.totalCap !== -1
    ) {
      notionalCap.name = preNotional.name;
      notionalCap.used = preNotional.used;
      notionalCap.totalCap = preNotional.totalCap;
    }

    try {
      const [notionalCapRes] = await Promise.allSettled([
        makeHttpRequest(notionalCapUrl),
      ]);

      if (notionalCapRes.status === "fulfilled") {
        notionalCap.name = market.name;
        notionalCap.used = notionalCapRes.value.used;
        notionalCap.totalCap = notionalCapRes.value.total_cap;
      }
    } catch (error) {
      console.error(error, "happened in getNotionalCap");
    }

    return { notionalCap };
  }
);

export const getPriceRange = createAsyncThunk(
  "hedger/getPriceRange",
  async ({
    hedgerUrl,
    market,
  }: {
    hedgerUrl: string | undefined;
    market: Market | undefined;
  }) => {
    if (!hedgerUrl) {
      throw new Error("hedgerUrl is empty");
    }
    if (!market) {
      throw new Error("market is empty");
    }

    const { href: priceRangeUrl } = new URL(
      `price-range/${market.name}`,
      hedgerUrl
    );

    const priceRange: PriceRange = { name: "", minPrice: -1, maxPrice: -1 };

    try {
      const [priceRangeRes] = await Promise.allSettled([
        makeHttpRequest(priceRangeUrl),
      ]);

      if (priceRangeRes.status === "fulfilled") {
        priceRange.name = market.name;
        priceRange.minPrice = priceRangeRes.value.min_price;
        priceRange.maxPrice = priceRangeRes.value.max_price;
      }
    } catch (error) {
      console.error(error, "happened in getPriceRange");
    }

    return { priceRange };
  }
);

export const getMarketsDepth = createAsyncThunk(
  "hedger/getMarketsDepth",
  async (apiUrl: string | undefined) => {
    if (!apiUrl) {
      throw new Error("Url is empty");
    }
    const depths: MarketDepthMap = {};
    const { href: marketDepthUrl } = new URL(
      `fapi/v1/ticker/bookTicker`,
      apiUrl
    );

    try {
      const [marketDepths] = await Promise.allSettled([
        makeHttpRequest(marketDepthUrl),
      ]);

      if (marketDepths.status === "fulfilled") {
        marketDepths.value.forEach((depth: DepthResponse) => {
          const newDepth = {
            bestAskPrice: depth.askPrice,
            bestAskQuantity: depth.askQty,
            bestBidPrice: depth.bidPrice,
            bestBidQuantity: depth.bidQty,
          } as MarketDepthData;
          depths[depth.symbol] = newDepth;
        });
      }
    } catch (error) {
      console.error(error, "happened in getMarketsDepth");
      return { depths: {} };
    }
    return { depths };
  }
);

export const getMarketsInfo = createAsyncThunk(
  "hedger/getMarketsInfo",
  async (hedgerUrl: string | undefined) => {
    if (!hedgerUrl) {
      throw new Error("hedgerUrl is empty");
    }
    const { href: marketsInfoUrl } = new URL(`get_market_info`, hedgerUrl);
    const marketsInfo: MarketsInfo = {};
    try {
      const [marketsInfoRes] = await Promise.allSettled([
        makeHttpRequest(marketsInfoUrl),
      ]);
      if (marketsInfoRes.status === "fulfilled") {
        Object.entries(marketsInfoRes.value).forEach((localMarketEntry) => {
          const [marketName, marketInfoValue]: [
            marketName: string,
            marketInfoValue: any
          ] = localMarketEntry;
          marketsInfo[marketName] = {
            price: marketInfoValue.price.toString(),
            priceChangePercent: marketInfoValue.price_change_percent.toString(),
            tradeVolume: marketInfoValue.trade_volume.toString(),
            notionalCap: marketInfoValue.notional_cap.toString(),
          };
        });
      }
    } catch (error) {
      console.error(error, "happened in getMarketsInfo");
    }

    return { marketsInfo };
  }
);
