import { COLLATERAL_ADDRESS } from "@symmio-client/core/constants/addresses";
import { useToken } from "@symmio-client/core/lib/hooks/useTokens";
import { useSingleContractMultipleMethods } from "@symmio-client/core/lib/hooks/multicall";

import { useSupportedChainId } from "@symmio-client/core/lib/hooks/useSupportedChainId";
import { useTokenBalance } from "@symmio-client/core/lib/hooks/useCurrencyBalance";

import { fromWei } from "@symmio-client/core/utils/numbers";
import {
  getMultipleBN,
  getSingleWagmiResult,
} from "@symmio-client/core/utils/multicall";

import { useDiamondContract } from "@symmio-client/core/hooks/useContract";
import { UserPartyAStatDetail } from "@symmio-client/core/types/user";

//TODO why its not covered by useMemo
//we converted all BigNumbers to string to avoid spurious rerenders
export function usePartyAStats(
  account: string | null | undefined
): UserPartyAStatDetail {
  const isSupportedChainId = useSupportedChainId();
  const DiamondContract = useDiamondContract();

  const cToken = useToken(COLLATERAL_ADDRESS);

  const partyAStatsCallsFirstCall = isSupportedChainId
    ? !account
      ? []
      : [
          {
            functionName: "balanceOf",
            callInputs: [account],
          },
          {
            functionName: "partyAStats",
            callInputs: [account],
          },
        ]
    : [];

  const partyAStatsCallsSecondCall = isSupportedChainId
    ? !account
      ? []
      : [
          {
            functionName: "getBalanceLimitPerUser",
            callInputs: [],
          },
          {
            functionName: "withdrawCooldownOf",
            callInputs: [account],
          },
          {
            functionName: "coolDownsOfMA",
            callInputs: [],
          },
        ]
    : [];

  const cBalance =
    useTokenBalance(account ?? undefined, cToken ?? undefined)?.toExact() ||
    "0";

  const {
    data: firstData,
    isLoading: isFirstCallLoading,
    isError: isFirstCallError,
  } = useSingleContractMultipleMethods(
    DiamondContract,
    partyAStatsCallsFirstCall,
    {
      watch: true,
      enabled: partyAStatsCallsFirstCall.length > 0,
    }
  );

  const {
    data: secondData,
    isLoading: isSecondCallLoading,
    isError: isSecondCallError,
  } = useSingleContractMultipleMethods(
    DiamondContract,
    partyAStatsCallsSecondCall,
    {
      watch: true,
      enabled: partyAStatsCallsSecondCall.length > 0,
    }
  );

  const loading = isFirstCallLoading || isSecondCallLoading;
  const isError = isFirstCallError || isSecondCallError;

  const multipleBNResult = getMultipleBN(firstData?.[1]?.result);

  return {
    collateralBalance: cBalance,

    accountBalance: fromWei(getSingleWagmiResult(firstData, 0)),
    liquidationStatus:
      getSingleWagmiResult<boolean[]>(firstData, 1)?.[0] ?? false,

    accountBalanceLimit: fromWei(getSingleWagmiResult(secondData, 0)),
    withdrawCooldown: getSingleWagmiResult(secondData, 1)?.toString() ?? "0",
    cooldownMA: getMultipleBN(secondData?.[2]?.result)[0]?.toString() ?? "0",
    allocatedBalance: fromWei(multipleBNResult[1]),
    lockedCVA: fromWei(multipleBNResult[2]),
    lockedMM: fromWei(multipleBNResult[3]),
    lockedLF: fromWei(multipleBNResult[4]),
    totalLocked: fromWei(multipleBNResult[5]),
    totalPendingLocked: fromWei(multipleBNResult[9]),
    positionsCount: multipleBNResult[10]?.toNumber() ?? 0,
    pendingCount: multipleBNResult[11]?.toNumber() ?? 0,
    nonces: multipleBNResult[12]?.toNumber() ?? 0,
    quotesCount: (multipleBNResult[13]?.toNumber() ?? 75) + 5,
    loading,
    isError,
  };
}
