import { useCallback } from "react";
import { useActiveAccountAddress } from "../state/user/hooks";
import { useMultiAccountContract, useDiamondContract } from "./useContract";
import { GLOBAL_MULTI_ACCOUNTABLE_PAUSED } from "../constants/misc";
import { Address, encodeFunctionData } from "viem";
import { ConstructCallReturnType } from "../types/web3";
import useWagmi from "../lib/hooks/useWagmi";
import { ContractFunctionRevertedError, BaseError } from "viem";

export function useMultiAccountable(
  constructCall: () => ConstructCallReturnType,
  disable?: boolean
) {
  const activeAccountAddress = useActiveAccountAddress();
  const { account } = useWagmi();
  const MultiAccountContract = useMultiAccountContract();
  const DiamondContract = useDiamondContract();

  return useCallback(async (): ConstructCallReturnType => {
    if (disable || GLOBAL_MULTI_ACCOUNTABLE_PAUSED)
      return await constructCall();

    let callData: any = null;
    try {
      if (
        !constructCall ||
        !activeAccountAddress ||
        !MultiAccountContract ||
        !DiamondContract ||
        !account
      ) {
        throw new Error("Missing in generating constructCall.");
      }

      const call = await constructCall();
      if ("error" in call) throw call;
      const { config, args: preArgs, functionName } = call;
      callData = { config, args: preArgs, functionName }; // Store the call data

      if (functionName) {
        // @ts-ignore
        await DiamondContract.simulate[functionName](preArgs, {
          account: activeAccountAddress as Address,
          value: config.value || BigInt(0),
        });
      }

      const args = [activeAccountAddress as Address, [config.data]];
      return {
        args,
        functionName,
        config: {
          account,
          to: MultiAccountContract.address,
          data: encodeFunctionData({
            abi: MultiAccountContract.abi,
            functionName: "_call",
            args,
          }),
          value: config.value || BigInt(0),
        },
      };
    } catch (error) {
      if (error instanceof BaseError) {
        const revertError = error.walk(
          (err) => err instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          console.log(revertError.reason?.toString() || "");
          throw error;
        }
      }
      if (error && typeof error === "string") throw new Error(error);

      if (callData) return { ...callData, error };

      throw new Error("error3");
    }
  }, [
    DiamondContract,
    MultiAccountContract,
    account,
    activeAccountAddress,
    constructCall,
    disable,
  ]);
}
