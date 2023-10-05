import { prepareSendTransaction, sendTransaction } from "@wagmi/core";
import { UserRejectedRequestError } from "viem";
import { ContractFunctionRevertedError, BaseError } from "viem";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

import { useTransactionAdder } from "../state/transactions/hooks";
import { TransactionInfo } from "../state/transactions/types";
import { useContract } from "../lib/hooks/contract";
import { ConstructCallReturnType } from "../types/web3";
import { toBN } from "./numbers";

export function calculateGasMargin(value: bigint): bigint {
  return BigInt(toBN(value.toString()).times(12_000).div(10_000).toFixed(0));
}

export enum TransactionCallbackState {
  INVALID = "INVALID",
  PENDING = "PENDING",
  VALID = "VALID",
}

export async function createTransactionCallback(
  functionName: string,
  Contract: NonNullable<ReturnType<typeof useContract>>,
  constructCall: () => ConstructCallReturnType,
  addTransaction: ReturnType<typeof useTransactionAdder>,
  addRecentTransaction: ReturnType<typeof useAddRecentTransaction>,
  txInfo: TransactionInfo,
  summary?: string,
  isMultiAccount?: boolean

  // expertMode?: ReturnType<typeof useExpertMode>
) {
  console.log(
    `on${functionName.charAt(0).toUpperCase() + functionName.slice(1)} Callback`
  );
  try {
    const { args, config } = await constructCall();
    console.log({ args, config });

    const gas: bigint = await Contract.estimateGas[
      isMultiAccount ? "_call" : functionName
    ](args);
    const request = await prepareSendTransaction(config);
    const data = await sendTransaction({
      ...request,
      gas: calculateGasMargin(gas),
    });
    addTransaction(data.hash, txInfo, summary);
    addRecentTransaction({
      hash: data.hash,
      description: summary || "-------",
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log({ error });
      if (error instanceof BaseError) {
        if (error.cause instanceof UserRejectedRequestError) {
          console.log({ error });
          // toast.error("Transaction rejected.");
        } else if (error.cause instanceof ContractFunctionRevertedError) {
          console.log({ error });
          // toast.error(`${error.cause.reason}`);
        } else {
          console.log({ error });
          // toast.error(`${error.shortMessage}`);
        }
      } else {
        console.error("constructCall error :", error.message);
      }
    } else {
      console.error("Unexpected error. Could not construct calldata. ", error);
    }
  }
}
