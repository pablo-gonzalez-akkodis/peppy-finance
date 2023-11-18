import { useMemo } from "react";

import { useSignatureStoreContract } from "./useContract";
import { TermsStatus } from "../state/user/types";
import { useSupportedChainId } from "../lib/hooks/useSupportedChainId";
import { useSingleContractMultipleMethods } from "../lib/hooks/multicall";
import { WEB_SETTING } from "../config";
import { getSingleWagmiResult } from "../utils/multicall";

export function useCheckSignedMessage(account: string | undefined): {
  isTermsAccepted: TermsStatus;
} {
  const isSupportedChainId = useSupportedChainId();
  const Contract = useSignatureStoreContract();

  const calls =
    isSupportedChainId && WEB_SETTING.showSignModal
      ? account
        ? [
            {
              functionName: "hasCurrentVersionSignature",
              callInputs: [account],
            },
          ]
        : []
      : [];

  const { data: signResult } = useSingleContractMultipleMethods(
    Contract,
    calls,
    { enabled: calls.length > 0 }
  );

  const isTermsAccepted = useMemo(
    () =>
      signResult && getSingleWagmiResult(signResult)
        ? signResult[0].result
          ? TermsStatus.ACCEPTED
          : TermsStatus.NOT_ACCEPTED
        : TermsStatus.UNCLEAR,
    [signResult]
  );

  return useMemo(
    () => ({
      isTermsAccepted,
    }),
    [isTermsAccepted]
  );
}

export function useGetMessage(): string {
  const Contract = useSignatureStoreContract();
  const isSupportedChainId = useSupportedChainId();

  const calls =
    isSupportedChainId && WEB_SETTING.showSignModal
      ? [{ functionName: "getCurrentVersionMessage", callInputs: [] }]
      : [];

  const { data: messageResult } = useSingleContractMultipleMethods(
    Contract,
    calls,
    {
      enabled: calls.length > 0,
    }
  );

  const message = useMemo(
    () =>
      messageResult && messageResult[0]
        ? (messageResult[0].result as string)
        : "",
    [messageResult]
  );

  return message;
}
