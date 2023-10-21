import { useEffect } from "react";
import { useSetSdkConfig } from "@symmio-client/core/state/chains/hooks";

import { contractInfo } from "constants/chains/addresses";
import { ClientChain } from "constants/chains/chains";
import { AbisInfo } from "constants/chains/abi";

export default function EmptyComponent() {
  const setConfigCallBack = useSetSdkConfig();

  useEffect(() => {
    setConfigCallBack({
      chains: contractInfo,
      V3_CHAIN_IDS: ClientChain,
      Abis: AbisInfo,
    });
  }, [setConfigCallBack]);

  return <></>;
}
