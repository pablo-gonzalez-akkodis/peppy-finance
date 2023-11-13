import { makeHttpRequest } from "../../../utils/http";
import { MUON_BASE_URL } from "../config";
import { MuonResponseType } from "./types";

export class MuonClient {
  readonly baseURL: string = MUON_BASE_URL;
  public APP: string;
  public APP_METHOD: string;

  constructor({ APP, APP_METHOD }: { APP: string; APP_METHOD: string }) {
    this.APP = APP;
    this.APP_METHOD = APP_METHOD;
  }

  public async _sendRequest(requestParams: string[][]) {
    const MuonURL = new URL(this.baseURL);
    MuonURL.searchParams.set("app", this.APP);
    MuonURL.searchParams.append("method", this.APP_METHOD);
    requestParams.forEach((param) => {
      MuonURL.searchParams.append(`params[${param[0]}]`, param[1]);
    });

    const response = await makeHttpRequest<MuonResponseType>(MuonURL.href);
    if (!response) throw new Error("Couldn't send Request");
    return response;
  }
}
