import { useCallback } from "react";
import { useActiveAccountAddress } from "@symmio-client/core/state/user/hooks";
import { useMultiAccountContract, useDiamondContract } from "./useContract";
import { GLOBAL_MULTI_ACCOUNTABLE_PAUSED } from "@symmio-client/core/constants/misc";
import { Address, encodeFunctionData } from "viem";
import { ConstructCallReturnType } from "@symmio-client/core/types/web3";
import useWagmi from "@symmio-client/core/lib/hooks/useWagmi";
import { ContractFunctionRevertedError, BaseError } from "viem";
import { toast } from "react-hot-toast";

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
      const { config, args: preArgs, functionName } = call;

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
          toast.error(revertError.reason?.toString() || "");
        }
      }
      throw new Error(error);
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
