import { Abi, Address, Narrow } from "viem";
import {
  UseContractReadConfig,
  useContractRead,
  useContractReads,
} from "wagmi";
import { useContract } from "./contract";

/**
 * TODO
 * 1-Memoizing inputs
 */

export type ContractType = {
  address?: Address;
  abi?: Abi;
  read?: Record<string, any>;
};

export function useSingleContractMultipleData(
  contract: ReturnType<typeof useContract>,
  functionName: string,
  callsData: Narrow<UseContractReadConfig["args"]>[],
  option?: UseContractReadConfig
) {
  const configs = callsData.map((args) => ({
    ...contract,
    functionName,
    args,
  }));
  return useContractReads({ contracts: configs, watch: true, ...{ option } });
}

export function useSingleContractMultipleMethods(
  contract: ReturnType<typeof useContract>,
  callsData?: {
    functionName: string;
    callInputs: Narrow<UseContractReadConfig["args"]>;
  }[],
  option?: UseContractReadConfig
) {
  const configs = callsData?.map(({ callInputs: args, functionName }) => ({
    ...contract,
    functionName,
    args,
  }));
  return useContractReads({ contracts: configs, watch: true, ...{ option } });
}

export function useSingleCallResult(
  contract: ReturnType<typeof useContract>,
  functionName: string,
  callInputs?: Narrow<UseContractReadConfig["args"]>,
  option?: UseContractReadConfig
) {
  return useContractRead({
    ...{ contract },
    functionName,
    args: [...[callInputs]],
    watch: true,
    ...{ option },
  });
}

// ReadContractConfig<TAbi, TFunctionName>["abi"] | undefined
// type ss = UseContractReadConfig<Abi>['abi']

// export function useSingleCallResult2<T extends Abi, F extends string | undefined>(
//   address: Address | undefined,
//   abi: UseContractReadConfig<T>['abi'] | undefined,
//   functionName: F,
//   callInputs?: Narrow<UseContractReadConfig<T>['args']>
// ) {
//   return useContractRead({ address, abi, functionName, args: [...[callInputs]] })
// }

export function useMultipleContractSingleData(
  addresses: string[],
  abi: UseContractReadConfig["abi"],
  functionName: string,
  callInputs: Narrow<UseContractReadConfig["args"]>,
  option?: UseContractReadConfig
) {
  // TODO: fix any type
  const configs = addresses.map((address, i) => ({
    address: address as `0x{string}`,
    abi,
    functionName,
    args: (callInputs && callInputs[i] ? callInputs[i] : []) as any,
  }));

  return useContractReads({ contracts: configs, watch: true, ...{ option } });
}
