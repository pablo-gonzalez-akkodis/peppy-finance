import { useCallback, useMemo } from "react";
import BigNumber from "bignumber.js";

import {
  createTransactionCallback,
  TransactionCallbackState,
} from "@symmio-client/core/utils/web3";
import { formatPrice } from "@symmio-client/core/utils/numbers";
import { COLLATERAL_TOKEN } from "@symmio-client/core/constants/tokens";
import { getTokenWithFallbackChainId } from "@symmio-client/core/utils/token";
import { TransferTab } from "@symmio-client/core/types/transfer";

import { useActiveAccount } from "@symmio-client/core/state/user/hooks";
import { useTransactionAdder } from "@symmio-client/core/state/transactions/hooks";
import {
  TransactionType,
  TransferCollateralTransactionInfo,
} from "@symmio-client/core/state/transactions/types";

import { DeallocateCollateralClient } from "@symmio-client/core/lib/muon";
import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import { useSupportedChainId } from "@symmio-client/core/lib/hooks/useSupportedChainId";
import {
  useDiamondContract,
  useMultiAccountContract,
} from "@symmio-client/core/hooks/useContract";
import { useDeallocateSign } from "@symmio-client/core/hooks/useDeallocateSign";
import { ConstructCallReturnType } from "@symmio-client/core/types/web3";
import { Address, encodeFunctionData } from "viem";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

export function useTransferCollateral(
  typedAmount: string,
  activeTab: TransferTab
): {
  state: TransactionCallbackState;
  callback: null | (() => Promise<any>);
  error: string | null;
} {
  const { account, chainId } = useActiveWagmi();
  const DiamondContract = useDiamondContract();
  const MultiAccountContract = useMultiAccountContract();
  const activeAccount = useActiveAccount();
  const isSupportedChainId = useSupportedChainId();
  const collateralCurrency = getTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );
  const addTransaction = useTransactionAdder();
  const addRecentTransaction = useAddRecentTransaction();

  // const userExpertMode = useExpertMode()
  const fakeSignature = useDeallocateSign();

  const getSignature = useCallback(async () => {
    if (!DeallocateCollateralClient) {
      return { signature: fakeSignature };
    }
    if (!chainId || !DiamondContract || !activeAccount) {
      throw new Error("Missing muon params");
    }

    const result = await DeallocateCollateralClient.getMuonSig(
      activeAccount.accountAddress,
      chainId,
      DiamondContract?.address
    );
    const { success, signature, error } = result;
    if (success === false || !signature) {
      throw new Error(`Unable to fetch Muon signature: ${error}`);
    }
    return { signature };
  }, [DiamondContract, activeAccount, chainId, fakeSignature]);

  const methodName = useMemo(() => {
    return activeTab === TransferTab.DEPOSIT
      ? "depositAndAllocateForAccount"
      : activeTab === TransferTab.DEALLOCATE
      ? "deallocate"
      : activeTab === TransferTab.WITHDRAW
      ? "withdrawFromAccount"
      : "";
  }, [activeTab]);

  const constructCall = useCallback(async (): ConstructCallReturnType => {
    try {
      if (
        !account ||
        !activeAccount ||
        !DiamondContract ||
        !MultiAccountContract ||
        !collateralCurrency ||
        !typedAmount ||
        !isSupportedChainId
      ) {
        throw new Error("Missing dependencies.");
      }
      const amount = new BigNumber(typedAmount)
        .shiftedBy(collateralCurrency.decimals)
        .toFixed();
      const collateralShiftAmount = `1e${collateralCurrency.decimals}`;

      if (activeTab === TransferTab.DEPOSIT) {
        const args = [activeAccount.accountAddress as Address, BigInt(amount)];
        const functionName = "depositAndAllocateForAccount";

        return {
          args,
          functionName,
          config: {
            account,
            to: MultiAccountContract.address,
            data: encodeFunctionData({
              abi: MultiAccountContract.abi,
              functionName,
              args,
            }),
            value: BigInt(0),
          },
        };
      } else if (activeTab === TransferTab.DEALLOCATE) {
        const fixedAmount = formatPrice(
          typedAmount,
          collateralCurrency.decimals
        );
        const amount = new BigNumber(fixedAmount).times(1e18).toFixed();

        const { signature } = await getSignature();

        if (!signature) {
          throw new Error(`Unable to fetch Muon signature`);
        }

        const diamondArgs = [BigInt(amount), signature] as const;

        const calldata = encodeFunctionData({
          abi: DiamondContract.abi,
          functionName: "deallocate",
          args: [...diamondArgs],
        });

        const args = [activeAccount.accountAddress as Address, [calldata]];
        const functionName = "_call";

        return {
          args,
          functionName,
          config: {
            account,
            value: BigInt(0),
            to: MultiAccountContract.address,
            data: encodeFunctionData({
              abi: MultiAccountContract.abi,
              functionName,
              args,
            }),
          },
        };
      } else if (activeTab === TransferTab.WITHDRAW) {
        const fixedAmount = formatPrice(
          typedAmount,
          collateralCurrency.decimals
        );
        const amount = new BigNumber(fixedAmount)
          .times(collateralShiftAmount)
          .toFixed();
        const args = [activeAccount.accountAddress as Address, BigInt(amount)];
        const functionName = "withdrawFromAccount";
        return {
          args,
          functionName,
          config: {
            account,
            to: MultiAccountContract.address,
            data: encodeFunctionData({
              abi: MultiAccountContract.abi,
              functionName,
              args,
            }),
            value: BigInt(0),
          },
        };
      }

      return {
        args: [],
        functionName: "",
        config: {
          account,
          to: MultiAccountContract.address,
          data: "0x",
          value: BigInt(0),
        },
      };
    } catch (error) {
      throw new Error(error);
    }
  }, [
    account,
    activeAccount,
    DiamondContract,
    MultiAccountContract,
    collateralCurrency,
    typedAmount,
    isSupportedChainId,
    activeTab,
    getSignature,
  ]);

  return useMemo(() => {
    if (
      !account ||
      !activeAccount ||
      !chainId ||
      !DiamondContract ||
      !MultiAccountContract ||
      !collateralCurrency
    ) {
      return {
        state: TransactionCallbackState.INVALID,
        callback: null,
        error: "Missing dependencies",
      };
    }

    const txInfo = {
      type: TransactionType.TRANSFER_COLLATERAL,
      transferType: activeTab,
      accountName: activeAccount.name,
      amount: typedAmount,
      accountAddress: activeAccount.accountAddress,
    } as TransferCollateralTransactionInfo;

    const summary = `${txInfo.amount} ${collateralCurrency?.symbol} ${txInfo.transferType}`;

    return {
      state: TransactionCallbackState.VALID,
      error: null,
      callback: () =>
        createTransactionCallback(
          methodName === "deallocate" ? "_call" : methodName,
          MultiAccountContract,
          constructCall,
          addTransaction,
          addRecentTransaction,
          txInfo,
          summary
        ),
    };
  }, [
    account,
    activeAccount,
    chainId,
    DiamondContract,
    MultiAccountContract,
    collateralCurrency,
    activeTab,
    typedAmount,
    methodName,
    constructCall,
    addTransaction,
    addRecentTransaction,
  ]);
}
