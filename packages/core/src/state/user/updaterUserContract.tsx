import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import { useAccountPartyAStat, useActiveAccountAddress } from "./hooks";
import { usePartyAStats } from "@symmio-client/core/hooks/usePartyAStats";
import { useEffect, useState } from "react";
import { updateAccountPartyAStat } from "./actions";
import { useAppDispatch } from "@symmio-client/core/state";
import isEqual from "lodash/isEqual";

export function UpdaterUserContract(): null {
  const dispatch = useAppDispatch();
  //TODO: maybe there is better way?!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [time, setTime] = useState(0);
  const { account } = useActiveWagmi();
  const previousAccountPartyAStat = useAccountPartyAStat(account);
  const activeAccountAddress = useActiveAccountAddress();
  const previousActiveAccountPartyAStat =
    useAccountPartyAStat(activeAccountAddress);
  const accountPartyAStat = usePartyAStats(account);
  const activePartyAStat = usePartyAStats(activeAccountAddress);

  useEffect(() => {
    if (
      account !== undefined &&
      !isEqual(previousAccountPartyAStat, accountPartyAStat)
    ) {
      dispatch(
        updateAccountPartyAStat({ address: account, value: accountPartyAStat })
      );
    }
  }, [accountPartyAStat, account, dispatch]);

  useEffect(() => {
    if (
      activeAccountAddress &&
      !isEqual(previousActiveAccountPartyAStat, activePartyAStat)
    ) {
      dispatch(
        updateAccountPartyAStat({
          address: activeAccountAddress,
          value: activePartyAStat,
        })
      );
    }
  }, [activePartyAStat, activeAccountAddress, dispatch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return null;
}
