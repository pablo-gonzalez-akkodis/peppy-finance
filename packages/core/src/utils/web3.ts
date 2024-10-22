import {
  prepareSendTransaction,
  sendTransaction,
  waitForTransaction,
} from "@wagmi/core";
import { UserRejectedRequestError, parseEther } from "viem";
import { ContractFunctionRevertedError, BaseError } from "viem";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

import { useTransactionAdder } from "../state/transactions/hooks";
import { TransactionInfo } from "../state/transactions/types";
import { useContract } from "../lib/hooks/contract";
import { ConstructCallReturnType } from "../types/web3";
import { toBN } from "./numbers";
import { WEB_SETTING } from "../config";
import { useExpertMode } from "../state/user/hooks";

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
  isMultiAccount?: boolean,
  expertMode?: ReturnType<typeof useExpertMode>
) {
  let call: any;
  try {
    if (WEB_SETTING.notAllowedMethods.includes(functionName)) {
      throw new Error(`${functionName} not allowed`);
    }

    call = await constructCall();
    const gas: bigint = await Contract.estimateGas[
      isMultiAccount ? "_call" : functionName
    ](call.args);
    const request = await prepareSendTransaction(call.config);
    const data = await sendTransaction({
      ...request,
      gas: calculateGasMargin(gas),
    });
    await waitForTransaction({
      hash: data?.hash,
      onReplaced: (replace) => {
        data.hash = replace.transaction.hash;
      },
    });
    addTransaction(data.hash, txInfo, summary);
    addRecentTransaction({
      hash: data.hash,
      description: summary || "-------",
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error", { error });

      if (expertMode && error) {
        console.log(
          "Proceeding with transaction despite the error due to expert mode"
        );

        const config = call.config;
        const tx = !config.value
          ? { from: config.account, to: config.to, data: config.data }
          : {
              from: config.account,
              to: config.to,
              data: config.data,
              value: parseEther(config.value),
            };
        const data = await sendTransaction(tx);
        addTransaction(data.hash, txInfo, summary);
        addRecentTransaction({
          hash: data.hash,
          description: summary || "-------",
        });
        return data;
      }

      if (error instanceof BaseError) {
        if (error instanceof UserRejectedRequestError) {
          // TODO: error.cause
          console.log("UserRejectedRequestError", { error });
          // TODO: handle error in client
        } else if (error instanceof ContractFunctionRevertedError) {
          // TODO: error.cause
          console.log("ContractFunctionRevertedError", { error });
          // TODO: handle error in client
        } else {
          console.log("Error Else", { error });
          // TODO: handle error in client
        }
      } else {
        console.error("constructCall error :", error.message);
      }
    } else {
      console.error("Unexpected error. Could not construct calldata. ", error);
    }
  }
}
