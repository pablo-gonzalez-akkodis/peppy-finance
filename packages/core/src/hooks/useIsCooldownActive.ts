import { getRemainingTime } from "@symmio-client/core/utils/time";
import { toBN } from "@symmio-client/core/utils/numbers";

import {
  useAccountPartyAStat,
  useActiveAccountAddress,
} from "@symmio-client/core/state/user/hooks";

export default function useIsCooldownActive() {
  const activeAccountAddress = useActiveAccountAddress();
  const { accountBalance, withdrawCooldown, cooldownMA } =
    useAccountPartyAStat(activeAccountAddress);
  const { diff } = getRemainingTime(
    toBN(withdrawCooldown).plus(cooldownMA).times(1000).toNumber()
  );

  return diff > 0 || toBN(accountBalance).isGreaterThan(0);
}
