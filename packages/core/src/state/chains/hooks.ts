import { useCallback, useMemo } from "react";
import { AppState, useAppDispatch, useAppSelector } from "..";
import { setChains } from "./actions";
import { ChainsState } from "./reducer";

function compatibleWithLegacyStructure(chains, v3_ids, parameter_name) {
  return Object.keys(chains)
    .filter((key) => v3_ids.includes(parseInt(key)))
    .reduce((obj, key) => {
      obj[key] = chains[key][parameter_name];
      return obj;
    }, {});
}

export function useCollateralAddress() {
  const chains = useAppSelector((state: AppState) => state.chains.chains);
  const v3_ids = useAppSelector((state: AppState) => state.chains.V3_CHAIN_IDS);

  return useMemo(() => {
    return compatibleWithLegacyStructure(chains, v3_ids, "COLLATERAL_ADDRESS");
  }, [chains, v3_ids]);
}

export function useCollateralSymbol() {
  const chains = useAppSelector((state: AppState) => state.chains.chains);
  const v3_ids = useAppSelector((state: AppState) => state.chains.V3_CHAIN_IDS);

  return useMemo(() => {
    return compatibleWithLegacyStructure(chains, v3_ids, "COLLATERAL_SYMBOL");
  }, [chains, v3_ids]);
}

export function useCollateralDecimal() {
  const chains = useAppSelector((state: AppState) => state.chains.chains);
  const v3_ids = useAppSelector((state: AppState) => state.chains.V3_CHAIN_IDS);

  return useMemo(() => {
    return compatibleWithLegacyStructure(chains, v3_ids, "COLLATERAL_DECIMALS");
  }, [chains, v3_ids]);
}

export function useDiamondAddress() {
  const chains = useAppSelector((state: AppState) => state.chains.chains);
  const v3_ids = useAppSelector((state: AppState) => state.chains.V3_CHAIN_IDS);

  return useMemo(() => {
    return compatibleWithLegacyStructure(chains, v3_ids, "DIAMOND_ADDRESS");
  }, [chains, v3_ids]);
}

export function useMultiAccountAddress() {
  const chains = useAppSelector((state: AppState) => state.chains.chains);
  const v3_ids = useAppSelector((state: AppState) => state.chains.V3_CHAIN_IDS);

  return useMemo(() => {
    return compatibleWithLegacyStructure(
      chains,
      v3_ids,
      "MULTI_ACCOUNT_ADDRESS"
    );
  }, [chains, v3_ids]);
}

export function usePartyBWhitelistAddress() {
  const chains = useAppSelector((state: AppState) => state.chains.chains);
  const v3_ids = useAppSelector((state: AppState) => state.chains.V3_CHAIN_IDS);

  return useMemo(() => {
    return compatibleWithLegacyStructure(chains, v3_ids, "PARTY_B_WHITELIST");
  }, [chains, v3_ids]);
}

export function useMultiCallAddress() {
  const chains = useAppSelector((state: AppState) => state.chains.chains);
  const v3_ids = useAppSelector((state: AppState) => state.chains.V3_CHAIN_IDS);

  return useMemo(() => {
    return compatibleWithLegacyStructure(chains, v3_ids, "MULTICALL3_ADDRESS");
  }, [chains, v3_ids]);
}

export function useUSDCAddress() {
  const chains = useAppSelector((state: AppState) => state.chains.chains);
  const v3_ids = useAppSelector((state: AppState) => state.chains.V3_CHAIN_IDS);

  return useMemo(() => {
    return compatibleWithLegacyStructure(chains, v3_ids, "USDC_ADDRESS");
  }, [chains, v3_ids]);
}

export function useV3Ids() {
  const v3_ids = useAppSelector((state: AppState) => state.chains.V3_CHAIN_IDS);
  return v3_ids;
}

export function useCollateralABI() {
  const collateral_abi = useAppSelector(
    (state: AppState) => state.chains.contract_ABIs.COLLATERAL_ABI
  );
  return collateral_abi;
}

export function useDiamondABI() {
  const diamond_abi = useAppSelector(
    (state: AppState) => state.chains.contract_ABIs.DIAMOND_ABI
  );
  return diamond_abi;
}

export function useERC20BYTES20ABI() {
  const erc20_abi = useAppSelector(
    (state: AppState) => state.chains.contract_ABIs.ERC20_BYTES32_ABI
  );
  return erc20_abi;
}

export function useMulticall3ABI() {
  const multicall3_abi = useAppSelector(
    (state: AppState) => state.chains.contract_ABIs.MULTICALL3_ABI
  );
  return multicall3_abi;
}

export function useMultiAccountABI() {
  const multiAccount_abi = useAppSelector(
    (state: AppState) => state.chains.contract_ABIs.MULTI_ACCOUNT_ABI
  );
  return multiAccount_abi;
}

export function useFallbackChainId() {
  const fallbackChainId = useAppSelector(
    (state: AppState) => state.chains.FALLBACK_CHAIN_ID
  );
  return fallbackChainId;
}

export function useHedgerAddress() {
  const hedgers = useAppSelector((state: AppState) => state.chains.hedgers);
  return hedgers;
}

export function useAppName() {
  const appName = useAppSelector((state: AppState) => state.chains.appName);
  return appName;
}

export function useSetSdkConfig(): ({
  chains,
  V3_CHAIN_IDS,
  contract_ABIs,
  FALLBACK_CHAIN_ID,
  hedgers,
  appName,
}: ChainsState) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    ({
      chains,
      V3_CHAIN_IDS,
      contract_ABIs,
      FALLBACK_CHAIN_ID,
      hedgers,
      appName,
    }: ChainsState) => {
      dispatch(
        setChains({
          chains,
          V3_CHAIN_IDS,
          contract_ABIs,
          FALLBACK_CHAIN_ID,
          hedgers,
          appName,
        })
      );
    },
    [dispatch]
  );
}
