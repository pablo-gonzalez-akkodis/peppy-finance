import { useMemo } from "react";

import { useMultiAccountContract } from "./useContract";
import { useSupportedChainId } from "../lib/hooks/useSupportedChainId";
import { useSingleContractMultipleMethods } from "../lib/hooks/multicall";
import { useActiveAccountAddress } from "../state/user/hooks";

export function useIsAccessDelegated(
  target: string,
  selector: string
): boolean {
  const account = useActiveAccountAddress();
  const isSupportedChainId = useSupportedChainId();
  const Contract = useMultiAccountContract();

  const calls = isSupportedChainId
    ? account && target && selector
      ? [
          {
            functionName: "delegatedAccesses",
            callInputs: [account, target, selector],
          },
        ]
      : []
    : [];

  const { data: accessResult } = useSingleContractMultipleMethods(
    Contract,
    calls,
    { enabled: calls.length > 0 }
  );

  return useMemo(
    () =>
      accessResult && accessResult[0]
        ? (accessResult[0].result as boolean)
        : false,
    [accessResult]
  );
}
