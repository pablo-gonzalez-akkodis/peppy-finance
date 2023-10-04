import { useUserAccounts } from "./useAccounts";

export function myHook() {
  console.log("sampleTest", useUserAccounts());
}
