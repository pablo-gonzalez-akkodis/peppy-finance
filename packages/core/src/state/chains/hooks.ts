import { useCallback, useMemo } from "react";
import { AppState, useAppDispatch, useAppSelector } from "..";
import { setChains } from "./actions";
import { AbisType, ChainType } from "./reducer";

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

export function useSetSdkConfig(): ({ chains, V3_CHAIN_IDS, Abis }) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    ({
      chains,
      V3_CHAIN_IDS,
      Abis,
    }: {
      chains: ChainType[];
      V3_CHAIN_IDS: number[];
      Abis: AbisType;
    }) => {
      dispatch(
        setChains({
          chains,
          V3_CHAIN_IDS,
          Abis,
        })
      );
    },
    [dispatch]
  );
}
