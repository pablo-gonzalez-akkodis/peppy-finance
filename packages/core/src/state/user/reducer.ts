import * as toolkitRaw from "@reduxjs/toolkit";
const { createReducer } = ((toolkitRaw as any).default ??
  toolkitRaw) as typeof toolkitRaw;
import { ApiState, ConnectionStatus } from "../../types/api";
import { TermsStatus, UserState } from "./types";

import {
  updateUserSlippageTolerance,
  updateMatchesDarkMode,
  updateUserDarkMode,
  updateUserExpertMode,
  updateUserFavorites,
  updateUserLeverage,
  updateAccount,
  updateAccountUpnl,
  updateUpnlWebSocketStatus,
  updateAccountPartyAStat,
  updateAcceptTerms,
} from "./actions";
import {
  getBalanceHistory,
  getIsWhiteList,
  getTotalDepositsAndWithdrawals,
} from "./thunks";

const currentTimestamp = () => new Date().getTime();

const activeAccountUpnlInitialState = {
  upnl: 0,
  timestamp: 0,
  available_balance: 0,
};

export const initialState: UserState = {
  matchesDarkMode: false,
  userDarkMode: true,
  userExpertMode: false,
  userSlippageTolerance: "auto",
  timestamp: currentTimestamp(),
  favorites: [],
  leverage: 1,
  activeAccount: null,
  upnlWebSocketStatus: ConnectionStatus.CLOSED,
  activeAccountUpnl: activeAccountUpnlInitialState,
  accountsPartyAStat: {},

  whiteListAccount: null,
  whiteListAccountState: ApiState.LOADING,

  balanceHistory: {},
  balanceHistoryState: ApiState.LOADING,
  hasMoreHistory: true,

  depositWithdrawalsData: null,
  depositWithdrawalsState: ApiState.LOADING,
  isTermsAccepted: TermsStatus.NOT_ACCEPTED,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateUserDarkMode, (state, action) => {
      state.userDarkMode = action.payload.userDarkMode;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateMatchesDarkMode, (state, action) => {
      state.matchesDarkMode = action.payload.matchesDarkMode;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateUserExpertMode, (state, action) => {
      state.userExpertMode = action.payload.userExpertMode;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateUserFavorites, (state, action) => {
      state.favorites = action.payload;
    })
    .addCase(updateUserLeverage, (state, action) => {
      state.leverage = action.payload;
    })
    .addCase(updateUserSlippageTolerance, (state, action) => {
      state.userSlippageTolerance = action.payload.userSlippageTolerance;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateAccount, (state, action) => {
      state.activeAccount = action.payload;
    })
    .addCase(updateAccountUpnl, (state, action) => {
      state.activeAccountUpnl = action.payload;
    })
    .addCase(updateUpnlWebSocketStatus, (state, { payload }) => {
      state.upnlWebSocketStatus = payload.status;
    })

    .addCase(updateAccountPartyAStat, (state, action) => {
      const result = state.accountsPartyAStat ?? {};
      const index = action.payload.address;
      result[index] = action.payload.value;
      state.accountsPartyAStat = result;
    })
    .addCase(getIsWhiteList.fulfilled, (state, { payload }) => {
      state.whiteListAccount = payload.isWhiteList;
      state.whiteListAccountState = ApiState.OK;
    })

    .addCase(getIsWhiteList.pending, (state) => {
      state.whiteListAccountState = ApiState.LOADING;
    })

    .addCase(getIsWhiteList.rejected, (state) => {
      state.whiteListAccount = false;
      state.whiteListAccountState = ApiState.ERROR;
    })

    .addCase(
      getBalanceHistory.fulfilled,
      (state, { payload: { hasMore, result } }) => {
        const history = { ...state.balanceHistory };
        if (!result) return;

        result.forEach((d) => {
          history[d.transaction] = d;
        });
        state.balanceHistory = history;
        state.hasMoreHistory = hasMore;
        state.balanceHistoryState = ApiState.OK;
      }
    )

    .addCase(getBalanceHistory.pending, (state) => {
      state.balanceHistoryState = ApiState.LOADING;
    })

    .addCase(getBalanceHistory.rejected, (state) => {
      state.hasMoreHistory = false;
      state.balanceHistoryState = ApiState.ERROR;
    })

    .addCase(
      getTotalDepositsAndWithdrawals.fulfilled,
      (state, { payload: { result } }) => {
        state.depositWithdrawalsData = result;
        state.depositWithdrawalsState = ApiState.OK;
      }
    )

    .addCase(getTotalDepositsAndWithdrawals.pending, (state) => {
      state.depositWithdrawalsState = ApiState.LOADING;
    })

    .addCase(getTotalDepositsAndWithdrawals.rejected, (state) => {
      state.depositWithdrawalsData = null;
      state.depositWithdrawalsState = ApiState.ERROR;
    })

    .addCase(updateAcceptTerms, (state, action) => {
      state.isTermsAccepted = action.payload;
    })
);
