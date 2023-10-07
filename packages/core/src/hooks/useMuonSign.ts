import { useMemo } from "react";
import BigNumber from "bignumber.js";

import { toWei } from "../utils/numbers";
import {
  SingleUpnlAndPriceSig,
  SchnorrerSign,
} from "../types/muon";

import { useAccountUpnl } from "../state/user/hooks";
import { Address } from "viem";

// this sign is for send quote and request to close position

export function useSingleUpnlAndPriceSig(marketPrice: BigNumber) {
  const { upnl } = useAccountUpnl() || {};
  const timestamp = Math.floor(Date.now() / 1000);

  return useMemo(
    () =>
      ({
        reqId: "0x" as Address,
        timestamp: BigInt(timestamp),
        upnl: BigInt(toWei(upnl)),
        price: BigInt(marketPrice ? marketPrice.toString() : toWei(0)),
        gatewaySignature: "0x" as Address,
        sigs: {
          owner: "0x4a5dbc1F68F0E415c20b174cf09D1b4E1539CBD9" as Address,
          signature: BigInt("1"),
          nonce: "0x4a5dbc1F68F0E415c20b174cf09D1b4E1539CBD9" as Address,
        } as SchnorrerSign,
      } as SingleUpnlAndPriceSig),
    [upnl, marketPrice, timestamp]
  );
}
