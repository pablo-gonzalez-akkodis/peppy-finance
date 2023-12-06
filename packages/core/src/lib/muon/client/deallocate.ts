import { Address } from "viem";
import { DEFAULT_MUON_APP_NAME } from "../config";
import { MuonClient } from "./base";

export class DeallocateClient extends MuonClient {
  constructor(app?: string) {
    super({ APP: app ?? DEFAULT_MUON_APP_NAME, APP_METHOD: "uPnl_A" });
  }

  static createInstance(
    isEnabled: boolean,
    app?: string
  ): DeallocateClient | null {
    if (isEnabled) {
      return new DeallocateClient(app ?? DEFAULT_MUON_APP_NAME);
    }
    return null;
  }

  private _getRequestParams(
    account: string | null,
    chainId?: number,
    contractAddress?: string
  ): string[][] | Error {
    if (!account) return new Error("Param `account` is missing.");
    if (!chainId) return new Error("Param `chainId` is missing.");
    if (!contractAddress)
      return new Error("Param `contractAddress` is missing.");

    return [
      ["partyA", account],
      ["chainId", chainId.toString()],
      ["v3Contract", contractAddress],
    ];
  }

  public async getMuonSig(
    account: string | null,
    chainId?: number,
    contractAddress?: string
  ) {
    try {
      const requestParams = this._getRequestParams(
        account,
        chainId,
        contractAddress
      );
      if (requestParams instanceof Error)
        throw new Error(requestParams.message);
      console.info("Requesting data from Muon: ", requestParams);

      const response = await this._sendRequest(requestParams);
      console.info("Response from Muon: ", response);

      if (!response) {
        throw new Error("Error in response of Muon");
      }

      const timestamp: number = response["timestamp"];
      const upnl: string = response["uPnl"];
      const gatewaySignature: string = response["nodeSignature"];

      const signature = {
        reqId: "0x" as Address,
        timestamp: BigInt(timestamp),
        upnl: BigInt(upnl),
        gatewaySignature: gatewaySignature as Address,
        sigs: {
          owner: "0x0000000000000000000000000000000000000000" as Address,
          signature: BigInt("1"),
          nonce: "0x0000000000000000000000000000000000000000" as Address,
        },
      };

      return { success: true, signature };
    } catch (error) {
      console.error(error);
      console.log("Unable to get response from muon");
      return { success: false, error };
    }
  }
}
