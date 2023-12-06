import { toWei } from "../../../utils/numbers";
import { DEFAULT_MUON_APP_NAME } from "../config";
import { MuonClient } from "./base";
import { SchnorrerSign, SingleUpnlAndPriceSig } from "../../../types/muon";
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
      ["v3Contract", contractAddress],
      ["symbolId", marketId.toString()],
    ];
  }

  public async getMuonSig(
    account: string | null,
    chainId?: number,
    contractAddress?: string,
    marketId?: number
  ) {
    try {
      const requestParams = this._getRequestParams(
        account,
        chainId,
        contractAddress,
        marketId
      );
      if (requestParams instanceof Error)
        throw new Error(requestParams.message);
      console.info("Requesting data from Muon: ", requestParams);

      const response = await this._sendRequest(requestParams);
      console.info("Response from Muon: ", response);

      if (!"error") {
        throw new Error("Error in get Data From Muon");
      }

      const timestamp: number = response["timestamp"];
      const upnl: string = response["uPnl"];
      const price: string = response["price"];
      const gatewaySignature: Address = response["nodeSignature"];
      const signature = {
        reqId: "0x" as Address,
        timestamp: BigInt(timestamp),
        upnl: BigInt(toWei(upnl)),
        price: BigInt(price ? price : toWei(0)),
        gatewaySignature,
        sigs: {
          owner: "0x2408E836eBfcF135731Df4Cf357C10a7b65193bF" as Address,
          signature: BigInt("1"),
          nonce: "0x2408E836eBfcF135731Df4Cf357C10a7b65193bF" as Address,
        } as SchnorrerSign,
      } as SingleUpnlAndPriceSig;

      return { success: true, signature };
    } catch (error) {
      console.error(error);
      console.log("Unable to get response from muon");
      return { success: false, error };
    }
  }
}
