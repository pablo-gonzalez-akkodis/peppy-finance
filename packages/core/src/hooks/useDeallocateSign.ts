import { useMemo } from "react";

import { toWei } from "../utils/numbers";

import { useAccountUpnl } from "../state/user/hooks";
import { Address } from "viem";

export function useDeallocateSign() {
  const { upnl } = useAccountUpnl() || {};
  const timestamp = Math.floor(Date.now() / 1000);

  return useMemo(
    () => ({
      reqId: "0x" as Address,
      timestamp: BigInt(timestamp),
      upnl: toWei(upnl),
      gatewaySignature: "0x" as Address,
      sigs: {
        owner: "0x0000000000000000000000000000000000000000" as Address,
        signature: BigInt("1"),
        nonce: "0x0000000000000000000000000000000000000000" as Address,
      },
    }),
    [timestamp, upnl]
  );
}
