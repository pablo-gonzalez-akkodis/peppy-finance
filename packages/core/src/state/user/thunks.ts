import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBalanceHistoryApolloClient } from "@symmio-client/core/apollo/client/balanceHistory";
import {
  BALANCE_CHANGES_DATA,
  TOTAL_DEPOSITS_AND_WITHDRAWALS,
} from "@symmio-client/core/apollo/queries";
import { makeHttpRequest } from "@symmio-client/core/utils/http";
import { BalanceHistoryData, DepositWithdrawalsData } from "./types";
import { BALANCE_HISTORY_ITEMS_NUMBER } from "@symmio-client/core/constants/misc";

export const getIsWhiteList = createAsyncThunk(
  "user/getWalletWhitelist",
  async (payload: any) => {
    const { baseUrl: hedgerUrl, account, clientName } = payload;

    if (!hedgerUrl) {
      throw new Error("hedgerUrl is empty");
    }
    if (!account) {
      throw new Error("account is empty");
    }

    const { href: isWhiteListUrl } = new URL(
      `/check_in-whitelist/${account}/${clientName}`,
      hedgerUrl
    );

    let isWhiteList: null | boolean = null;
    try {
      const [whiteListRes] = await Promise.allSettled([
        makeHttpRequest(isWhiteListUrl),
      ]);
      if (whiteListRes.status === "fulfilled") {
        isWhiteList = whiteListRes.value;
      }
    } catch (error) {
      isWhiteList = false;
      console.error(error, " happened in check-in-whitelist");
    }

    return { isWhiteList };
  }
);

export const getBalanceHistory = createAsyncThunk(
  "user/getBalanceHistory",
  async ({
    account,
    chainId,
    skip,
    first,
  }: {
    account: string | null | undefined;
    chainId: number | undefined;
    skip: number;
    first: number;
  }) => {
    if (!account) {
      throw new Error("account is undefined");
    }
    if (!chainId) {
      throw new Error("chainId is empty");
    }

    try {
      const client = getBalanceHistoryApolloClient(chainId);
      if (!client) return {};
      let hasMore = true;

      const {
        data: { balanceChanges },
      } = await client.query<{
        balanceChanges: BalanceHistoryData[];
      }>({
        query: BALANCE_CHANGES_DATA,
        variables: { account: account.toLowerCase(), first, skip },
        fetchPolicy: "no-cache",
      });

      if (balanceChanges.length !== BALANCE_HISTORY_ITEMS_NUMBER) {
        hasMore = false;
      }

      return { result: balanceChanges, hasMore };
    } catch (error) {
      console.error(error);
      throw new Error(`Unable to query balance history data from Client`);
    }
  }
);

export const getTotalDepositsAndWithdrawals = createAsyncThunk(
  "user/getTotalDepositsAndWithdrawals",
  async ({
    account,
    chainId,
  }: {
    account: string | null | undefined;
    chainId: number | undefined;
  }) => {
    if (!account) {
      throw new Error("account is undefined");
    }
    if (!chainId) {
      throw new Error("chainId is empty");
    }

    try {
      const client = getBalanceHistoryApolloClient(chainId);
      if (!client) return { result: null };

      const {
        data: { accounts },
      } = await client.query<{ accounts: DepositWithdrawalsData[] }>({
        query: TOTAL_DEPOSITS_AND_WITHDRAWALS,
        variables: { id: account.toLowerCase() },
        fetchPolicy: "no-cache",
      });

      if (accounts.length) return { result: accounts[0] };
      return { result: null };
    } catch (error) {
      console.error(error);
      throw new Error(`Unable to query Deposits And Withdrawals from Client`);
    }
  }
);
