import { createReducer } from "@reduxjs/toolkit";
import find from "lodash/find";
import unionBy from "lodash/unionBy";

import { QuotesState } from "./types";
import { Quote } from "@symmio-client/core/types/quote";

import { ApiState } from "@symmio-client/core/types/api";
import {
  addPending,
  addPosition,
  addQuote,
  addQuoteToHistory,
  removePosition,
  removeQuote,
  setHistory,
  setPendings,
  setPositions,
  setQuoteDetail,
} from "./actions";
import { getHistory } from "./thunks";

export const initialState: QuotesState = {
  history: {},
  pendings: [],
  positions: [],
  listeners: [],
  quoteDetail: null,
  historyState: ApiState.LOADING,
  hasMoreHistory: false,
};

export default createReducer(initialState, (builder) =>
  builder

    .addCase(addQuote, (state, { payload: { id } }) => {
      if (state.listeners.includes(id)) {
        console.log("Attempted to add an existing quote id.", id);
        return;
      }
      const listeners = state.listeners;
      listeners.push(id);
      state.listeners = listeners;
    })

    .addCase(setPendings, (state, { payload: { quotes } }) => {
      state.pendings = quotes;
    })

    .addCase(addPending, (state, { payload: { quote } }) => {
      const pendings = state.pendings as unknown as Quote[];

      if (find(pendings, { id: quote.id, quoteStatus: quote.quoteStatus })) {
        console.log("Attempted to add an existing pending.", quote.id);
        return;
      }

      pendings.push(quote);
      state.pendings = pendings;
    })

    .addCase(setPositions, (state, { payload: { quotes } }) => {
      state.positions = quotes;
    })

    .addCase(addPosition, (state, { payload: { quote } }) => {
      const positions = state.positions as unknown as Quote[];

      if (find(positions, { id: quote.id })) {
        const newQuotes = positions.filter((q) => q.id !== quote.id);
        newQuotes.push(quote);
        console.log(
          "Attempted to add an existing positing.",
          quote.id,
          positions,
          newQuotes
        );
        state.positions = newQuotes;
        return;
      }

      positions.push(quote);
      state.positions = positions;
    })

    .addCase(setHistory, (state, { payload: { quotes, chainId } }) => {
      state.history[chainId] = quotes;
    })

    .addCase(removePosition, (state, { payload: { quote } }) => {
      const positions = state.positions as unknown as Quote[];
      console.log("in the remove position", quote.id);
      if (!find(positions, { id: quote.id })) {
        console.log("Attempted to remove none existing quote id.", quote.id);
        return;
      }

      state.positions = positions.filter((q) => q.id !== quote.id);
    })
    .addCase(removeQuote, (state, { payload: { id } }) => {
      if (!state.listeners.includes(id)) {
        console.log("Attempted to remove none existing quote id.", id);
        return;
      }
      const quotes = state.listeners;
      state.listeners = quotes.filter((qid) => qid !== id);
    })

    .addCase(addQuoteToHistory, (state, { payload: { quote, chainId } }) => {
      const history = (state.history[chainId] as unknown as Quote[]) ?? [];

      if (find(history, { id: quote.id })) {
        console.log("Attempted to add an existing quote id.", quote.id);
        return;
      }
      history.push(quote);
      state.history[chainId] = history;
    })

    .addCase(setQuoteDetail, (state, { payload: { quote } }) => {
      state.quoteDetail = quote;
    })

    .addCase(getHistory.pending, (state) => {
      state.historyState = ApiState.LOADING;
    })

    .addCase(
      getHistory.fulfilled,
      (state, { payload: { quotes, hasMore, chainId } }) => {
        // state.history = unionBy(state.history, quotes, 'id')
        if (quotes && chainId) {
          const history = state.history[chainId];
          state.hasMoreHistory = hasMore;
          state.history[chainId] = unionBy(history, quotes, "id");
          state.historyState = ApiState.OK;
        }
      }
    )

    .addCase(getHistory.rejected, (state) => {
      state.historyState = ApiState.ERROR;
      console.error("Unable to fetch from The Graph Network");
    })
);
