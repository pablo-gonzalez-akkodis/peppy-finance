import { createAction } from "@reduxjs/toolkit";

import {
  SerializableTransactionReceipt,
  TransactionDetails,
  TransactionInfo,
} from "./types";

export const addTransaction = createAction<{
  chainId: number;
  from: string;
  hash: string;
  info: TransactionInfo;
  summary?: string;
}>("transactions/addTransaction");
export const clearAllTransactions = createAction<{ chainId: number }>(
  "transactions/clearAllTransactions"
);
export const finalizeTransaction = createAction<{
  chainId: number;
  hash: string;
  receipt: SerializableTransactionReceipt;
}>("transactions/finalizeTransaction");
export const checkedTransaction = createAction<{
  chainId: number;
  hash: string;
  blockNumber: number;
}>("transactions/checkedTransaction");

export const updateTransaction = createAction<
  TransactionDetails & { chainId: number }
>("transactions/updateTransaction");
