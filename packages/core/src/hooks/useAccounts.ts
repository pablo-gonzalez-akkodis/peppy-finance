import { useEffect, useMemo, useState } from "react";
import { Address, useContractRead } from "wagmi";

import { Account } from "@symmio-client/core/types/user";
import { useMultiAccountContract } from "./useContract";
import { useIsWhiteList } from "@symmio-client/core/state/user/hooks";
import { useSupportedChainId } from "@symmio-client/core/lib/hooks/useSupportedChainId";
import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";

export function useUserAccounts() {
  const { account } = useActiveWagmi();
  const MultiAccountContract = useMultiAccountContract();
  const isSupportedChainId = useSupportedChainId();
  const { accountLength } = useAccountsLength();

  const {
    data: accounts,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useContractRead({
    address: MultiAccountContract?.address,
    abi: MultiAccountContract?.abi,
    functionName: "getAccounts",
    args: [account as Address, BigInt(0), BigInt(accountLength)],
    watch: true,
    enabled: Boolean(account) && Boolean(accountLength) && isSupportedChainId,
  });

  const accountsUnsorted = useMemo(() => {
    if (!accounts || !isSuccess || isError) return [];
    return accounts.map(
      (acc: any) =>
        ({
          accountAddress: acc.accountAddress.toString(),
          name: acc.name,
        } as Account)
    );
  }, [accounts, isError, isSuccess]);

  return useMemo(
    () => ({
      accounts: accountsUnsorted,
      isLoading,
      isError,
      error,
    }),
    [accountsUnsorted, error, isError, isLoading]
  );
}

export function useAccountsLength(): {
  accountLength: number;
  loading: boolean;
} {
  const isSupportedChainId = useSupportedChainId();

  const { account } = useActiveWagmi();
  const MultiAccountContract = useMultiAccountContract();

  const { data, isLoading, isSuccess, isError } = useContractRead({
    address: MultiAccountContract?.address,
    abi: MultiAccountContract?.abi,
    functionName: "getAccountsLength",
    args: [account as Address],
    watch: true,
    enabled: Boolean(account) && isSupportedChainId,
  });

  return useMemo(
    () => ({
      accountLength: isSuccess ? Number(data) : 0,
      loading: isLoading,
      isError,
    }),
    [data, isError, isLoading, isSuccess]
  );
}

export function useIsAccountWhiteList() {
  const { account } = useActiveWagmi();
  const [whitelist, setWhitelist] = useState<null | boolean>(null);
  const getWhiteList = useIsWhiteList(account);

  useEffect(() => {
    getWhiteList()
      .then((res) => {
        setWhitelist(res);
      })
      .catch((e) => {
        console.log(e);
        setWhitelist(null);
      });
  }, [getWhiteList]);

  return whitelist;
}
