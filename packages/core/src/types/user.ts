export type Account = {
  accountAddress: string;
  name: string;
};

export type AccountUpnl = {
  upnl: number;
  timestamp: number;
  available_balance: number;
};

export type UserPartyAStatDetail = {
  collateralBalance: string;
  accountBalance: string;
  liquidationStatus: boolean;
  accountBalanceLimit: string;
  withdrawCooldown: string;
  cooldownMA: string;
  allocatedBalance: string;
  lockedCVA: string;
  lockedMM: string;
  lockedLF: string;
  totalLocked: string;
  totalPendingLocked: string;
  positionsCount: number;
  pendingCount: number;
  nonces: number;
  quotesCount: number;
  loading: boolean;
  isError: boolean;
};

export const initialUserPartyAStatDetail: UserPartyAStatDetail = {
  collateralBalance: "0",
  accountBalance: "0",
  liquidationStatus: false,
  accountBalanceLimit: "0",
  withdrawCooldown: "0",
  cooldownMA: "0",
  allocatedBalance: "0",
  lockedCVA: "0",
  lockedMM: "0",
  lockedLF: "0",
  totalLocked: "0",
  totalPendingLocked: "0",
  positionsCount: 0,
  pendingCount: 0,
  nonces: 0,
  quotesCount: 80,
  loading: false,
  isError: false,
};

export type UserPartyAStatType = {
  [key: string]: UserPartyAStatDetail;
};
