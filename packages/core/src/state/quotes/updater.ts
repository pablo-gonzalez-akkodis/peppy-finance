import { useEffect, useMemo } from "react";
import { AppThunkDispatch, useAppDispatch } from "..";
import find from "lodash/find";
import isEqual from "lodash/isEqual";

import {
  useGetPendingIds,
  useGetPositions,
  useGetQuoteByIds,
} from "../../hooks/useQuotes";
import {
  addQuoteToHistory,
  removeQuote,
  setPendings,
  setPositions,
} from "./actions";
import {
  useAddQuotesToListenerCallback,
  useListenersQuotes,
  usePendingsQuotes,
  usePositionsQuotes,
} from "./hooks";
import { QuoteStatus } from "../../types/quote";
import usePrevious from "../../lib/hooks/usePrevious";
import { autoRefresh } from "../../utils/retry";
import { getHistory } from "./thunks";
import { useActiveAccountAddress } from "../user/hooks";
import useWagmi from "../../lib/hooks/useWagmi";

export function QuotesUpdater(): null {
  const dispatch = useAppDispatch();
  const thunkDispatch: AppThunkDispatch = useAppDispatch();
  const account = useActiveAccountAddress();
  const { chainId } = useWagmi();

  const { pendingIds } = useGetPendingIds();

  const { quotes: pendings } = useGetQuoteByIds(pendingIds);
  const { positions } = useGetPositions();

  useEffect(() => {
    if (account && chainId)
      return autoRefresh(
        () =>
          thunkDispatch(
            getHistory({ account, chainId, first: 8, skip: 0, ItemsPerPage: 7 })
          ),
        3000
      );
  }, [account, chainId, thunkDispatch]);

  useEffect(() => {
    dispatch(setPositions({ quotes: positions ?? [] }));
  }, [positions, dispatch]);

  useEffect(() => {
    if (pendingIds.length === pendings.length)
      dispatch(setPendings({ quotes: pendings }));
  }, [pendings, pendingIds, dispatch]);

  return null;
}

/* TODO
1- remove opened position
*/
export function UpdaterListeners(): null {
  const dispatch = useAppDispatch();
  const { chainId } = useWagmi();
  const addQuoteToListenerCallback = useAddQuotesToListenerCallback();

  const { quotes: pendings } = usePendingsQuotes();
  const { quotes: positions } = usePositionsQuotes();

  const pendingIds = useMemo(() => {
    return pendings.map((q) => q.id);
  }, [pendings]);

  const prevPendingIds = usePrevious(pendingIds);
  const prevPositions = usePrevious(positions);

  const listeners = useListenersQuotes();

  const { quotes: listenersQuotes } = useGetQuoteByIds(listeners);

  //we don't need add quote to positions because we are getting all live through usePositionsQuotes
  useEffect(() => {
    for (let i = 0; i < listenersQuotes.length; i++) {
      const quote = listenersQuotes[i];
      if (quote.quoteStatus === QuoteStatus.OPENED) {
        dispatch(removeQuote({ id: quote.id }));
      }
      if (
        (quote.quoteStatus === QuoteStatus.CANCELED ||
          quote.quoteStatus === QuoteStatus.LIQUIDATED ||
          quote.quoteStatus === QuoteStatus.CLOSED) &&
        chainId
      ) {
        dispatch(addQuoteToHistory({ quote, chainId }));
        dispatch(removeQuote({ id: quote.id }));
      }
    }
  }, [listenersQuotes, dispatch, chainId]);

  useEffect(() => {
    if (!isEqual(prevPendingIds, pendingIds)) {
      const unpendingIds = prevPendingIds?.filter(
        (id) => !pendingIds.includes(id)
      );
      if (!unpendingIds?.length) return;
      for (let i = 0; i < unpendingIds?.length; i++) {
        addQuoteToListenerCallback(unpendingIds[i]);
      }
    }
  }, [prevPendingIds, pendingIds, addQuoteToListenerCallback]);

  useEffect(() => {
    if (!isEqual(prevPositions, positions)) {
      const unPositionsId = prevPositions
        ?.filter((id) => !find(positions, { id }))
        .map((p) => p.id);
      if (!unPositionsId?.length) return;
      for (let i = 0; i < unPositionsId?.length; i++) {
        addQuoteToListenerCallback(unPositionsId[i]);
      }
    }
  }, [prevPositions, positions, addQuoteToListenerCallback]);

  return null;
}
