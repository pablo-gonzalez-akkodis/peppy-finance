import * as toolkitRaw from "@reduxjs/toolkit";
const { createAction } = ((toolkitRaw as any).default ??
  toolkitRaw) as typeof toolkitRaw;
import { TermsStatus } from "./types";
import { Account, AccountUpnl, UserPartyAStatDetail } from "../../types/user";
import { ConnectionStatus } from "../../types/api";

export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>(
  "user/updateMatchesDarkMode"
);
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>(
  "user/updateUserDarkMode"
);
export const updateUserExpertMode = createAction<{ userExpertMode: boolean }>(
  "user/updateUserExpertMode"
);
export const updateUserFavorites = createAction<string[]>(
  "user/updateUserFavorites"
);
export const updateUserLeverage = createAction<number>(
  "user/updateUserLeverage"
);
export const updateUserSlippageTolerance = createAction<{
  userSlippageTolerance: "auto";
}>("user/updateUserSlippageTolerance");
export const updateAccount = createAction<Account | null>("user/updateAccount");
export const updateAccountUpnl = createAction<AccountUpnl>(
  "user/updateAccountUpnl"
);

export const updateUpnlWebSocketStatus = createAction<{
  status: ConnectionStatus;
}>("user/updateUpnlWebSocketStatus");
export const updateAccountPartyAStat = createAction<{
  address: string;
  value: UserPartyAStatDetail;
}>("user/updateAccountPartyAStat");

export const updateAcceptTerms = createAction<TermsStatus>(
  "user/updateAcceptTerms"
);
