import { useMemo } from "react";
import { Token } from "@uniswap/sdk-core";
import BigNumber from "bignumber.js";

import { BN_TEN, toBN } from "@symmio-client/core/utils/numbers";

import { useERC20Contract } from "@symmio-client/core/hooks/useContract";
import { Address } from "viem";
import { useContractRead } from "wagmi";

interface UseERC20Allowance {
  token?: Token;
  owner: Address | undefined;
  spender: string | undefined;
  enabled?: boolean;
}

export function useERC20Allowance({
  token,
  owner,
  spender,
  enabled = true,
}: UseERC20Allowance): {
  tokenAllowance: BigNumber | undefined;
  isSyncing: boolean;
  refetch: ReturnType<typeof useContractRead>["refetch"];
} {
  const contract = useERC20Contract(token?.address);

  const { data, isLoading, refetch } = useContractRead({
    address: contract?.address,
    abi: contract?.abi,
    functionName: "allowance",
    args: [owner as Address, spender as Address],
    watch: true,
    enabled: Boolean(token && owner && spender && token.chainId && enabled),
    select: (data) => {
      if (token) {
        return toBN(data.toString()).div(BN_TEN.pow(token.decimals));
      }
    },
  });

  return useMemo(
    () => ({ tokenAllowance: data, isSyncing: isLoading, refetch }),
    [data, isLoading, refetch]
  );
}
