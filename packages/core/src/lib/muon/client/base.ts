import { makeHttpRequest } from "../../../utils/http";

export class MuonClient {
  public APP: string;
  public APP_METHOD: string;

  constructor({ APP, APP_METHOD }: { APP: string; APP_METHOD: string }) {
    this.APP = APP;
    this.APP_METHOD = APP_METHOD;
  }

  public async _sendRequest(baseUrl: string, requestParams: string[][]) {
    const MuonURL = new URL(baseUrl);
    MuonURL.searchParams.set("app", this.APP);
    MuonURL.searchParams.append("method", this.APP_METHOD);
    requestParams.forEach((param) => {
      MuonURL.searchParams.append(`params[${param[0]}]`, param[1]);
    });

    try {
      const response = await makeHttpRequest<{ result: any; success: boolean }>(
        MuonURL.href
      );
      return response;
    } catch (error) {
      console.error(`Error during request to ${baseUrl}:`, error);
      throw error;
    }
  }
}
