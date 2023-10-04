import { useRef } from "react";
// import { Address } from "viem";
import useWagmi from "@symmio-client/core/lib/hooks/useWagmi";

/* export default function useActiveWagmi() {
  const context = useWagmi()
  const { account } = context
  const injectedAddress = useInjectedAddress()

  return useMemo(
    () => (injectedAddress && account ? { ...context, account: injectedAddress as Address } : context),
    [context, injectedAddress, account]
  )
} */

export default function useActiveWagmi() {
  const context = useWagmi();
  const activeContextRef = useRef(context);
  activeContextRef.current = context;

  return activeContextRef.current;
}
