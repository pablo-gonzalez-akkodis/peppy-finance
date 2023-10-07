import { useMemo } from "react";
import { Abi, getContract } from "viem";
import { Address, WalletClient, usePublicClient, useWalletClient } from "wagmi";
import { AddressZero } from "../../constants/misc";
import useWagmi from "./useWagmi";

export function useContract<T extends Abi>(
  addressOrAddressMap:
    | string
    | { [chainId: number]: string }
    | null
    | undefined,
  ABI?: T
): any {
  const { chainId } = useWagmi();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address || address === AddressZero) return null;
    try {
      return getContract({
        address: address as Address,
        abi: ABI,
        publicClient,
        walletClient: (walletClient as WalletClient) ?? publicClient,
      });
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [addressOrAddressMap, ABI, chainId, walletClient, publicClient]);
}
