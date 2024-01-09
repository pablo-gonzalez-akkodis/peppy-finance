import { useEffect, useState } from "react";

import { ApiState } from "../types/api";
import { AppThunkDispatch, useAppDispatch } from "../state/declaration";

import { useHedgerInfo } from "../state/hedger/hooks";
import { MarketsInfo } from "../state/hedger/types";
import { getMarketsInfo } from "../state/hedger/thunks";
import { useAppName } from "../state/chains/hooks";
import { useMultiAccountContract } from "./useContract";

export function useAllMarketsData() {
  const [marketsInfo, setMarketsInfo] = useState<MarketsInfo>({});
  const [infoStatus, setInfoStatus] = useState<ApiState>(ApiState.OK);

  const appName = useAppName();
  const hedger = useHedgerInfo();
  const { baseUrl } = hedger || {};
  const MultiAccountContract = useMultiAccountContract();
  const dispatch: AppThunkDispatch = useAppDispatch();

  useEffect(() => {
    if (MultiAccountContract) {
      setInfoStatus(ApiState.LOADING);
      dispatch(
        getMarketsInfo({
          hedgerUrl: baseUrl,
          appName,
          multiAccountAddress: MultiAccountContract.address,
        })
      )
        .unwrap()
        .then((res) => {
          setMarketsInfo(res.marketsInfo);
          setInfoStatus(ApiState.OK);
        })
        .catch(() => {
          setMarketsInfo({});
          setInfoStatus(ApiState.ERROR);
        });
    }
  }, [baseUrl, dispatch, appName, MultiAccountContract]);

  return { marketsInfo, infoStatus };
}
