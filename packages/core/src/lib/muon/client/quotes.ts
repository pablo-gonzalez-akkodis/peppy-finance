import { toWei } from "../../../utils/numbers";
import { DEFAULT_MUON_APP_NAME } from "../config";
import { MuonClient } from "./base";
import { Address } from "viem";

export class QuotesClient extends MuonClient {
  constructor(app?: string) {
    super({
      APP: app ?? DEFAULT_MUON_APP_NAME,
      APP_METHOD: "uPnl_A_withSymbolPrice",
    });
  }

  static createInstance(isEnabled: boolean, app?: string): QuotesClient | null {
    if (isEnabled) {
      return new QuotesClient(app ?? DEFAULT_MUON_APP_NAME);
    }
    return null;
  }

  private _getRequestParams(
    account: string | null,
    chainId?: number,
    contractAddress?: string,
    marketId?: number
  ): string[][] | Error {
    if (!account) return new Error("Param `account` is missing.");
    if (!chainId) return new Error("Param `chainId` is missing.");
    if (!contractAddress)
      return new Error("Param `contractAddress` is missing.");
    if (!marketId) return new Error("Param `marketId` is missing.");

    return [
      ["partyA", account],
      ["chainId", chainId.toString()],
      ["symmio", contractAddress],
      ["symbolId", marketId.toString()],
    ];
  }

  public async getMuonSig(
    account: string | null,
    chainId?: number,
    contractAddress?: string,
    marketId?: number
  ) {
    // TODO: add return type
    try {
      const requestParams = this._getRequestParams(
        account,
        chainId,
        contractAddress,
        marketId
      );
      if (requestParams instanceof Error) {
        return {
          success: false,
          error: requestParams,
        };
      }
      console.info("Requesting data from Muon: ", requestParams);

      const { result, success } = await this._sendRequest(requestParams);
      console.info("Response from Muon: ", result);

      if (!success) {
        return {
          success: false,
          error: new Error("Error in response of Muon"),
        };
      }

      const reqId = result["reqId"] as Address;
      const timestamp = BigInt(result["data"]["timestamp"]);
      const upnl = BigInt(result["data"]["result"]["uPnl"]);
      const price = BigInt(result["data"]["result"]["price"]);
      const gatewaySignature = result["nodeSignature"] as Address;

      const signature = BigInt(result["signatures"][0]["signature"]);
      const owner = result["signatures"][0]["owner"] as Address;
      const nonce = result["data"]["init"]["nonceAddress"] as Address;

      const generatedSignature = [
        reqId,
        timestamp,
        upnl,
        price ? price : toWei(0),
        gatewaySignature,
        [signature, owner, nonce],
      ];

      return { success: true, signature: generatedSignature };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    }
  }
}
