import { useCallback, useMemo } from "react";
import { SiweMessage } from "siwe";
import { Address } from "viem";

import { makeHttpRequest } from "../utils/http";
import useActiveWagmi from "../lib/hooks/useActiveWagmi";

import { useHedgerInfo } from "../state/hedger/hooks";
import { useActiveAccountAddress } from "../state/user/hooks";
import { useFallbackChainId, usePartyBWhitelistAddress } from "../state/chains";

import { useSignMessage } from "../callbacks/useMultiAccount";
import { useIsAccessDelegated } from "./useIsAccessDelegated";

type NonceResponseType = {
  nonce: string;
};

type LoginResponseType = {
  access_token: string;
};

type InstantCloseResponseType =
  | {
      successful: string;
      message: string;
    }
  | {
      error_code: number;
      error_message: string;
      error_detail: string[];
    };

export default function useInstantClose(
  quantityToClose: string,
  closePrice: string | undefined,
  quoteId: number | undefined
) {
  const { account, chainId } = useActiveWagmi();
  const activeAddress = useActiveAccountAddress();
  const { baseUrl } = useHedgerInfo() || {};
  const { callback: signMessageCallback } = useSignMessage();

  const PARTY_B_WHITELIST = usePartyBWhitelistAddress();
  const FALLBACK_CHAIN_ID = useFallbackChainId();
  const partyBWhiteList = useMemo(
    () => [PARTY_B_WHITELIST[chainId ?? FALLBACK_CHAIN_ID]],
    [FALLBACK_CHAIN_ID, PARTY_B_WHITELIST, chainId]
  );

  const isAccessDelegated = useIsAccessDelegated(
    partyBWhiteList[0],
    "0x501e891f"
  );

  const onSignMessage = useCallback(
    async (message: string) => {
      if (!signMessageCallback || !message) return "";

      try {
        const sign = await signMessageCallback(message);

        return sign;
      } catch (e) {
        if (e instanceof Error) {
          console.error(e);
        } else {
          console.debug(e);
        }
        throw e;
      }
    },
    [signMessageCallback]
  );

  const getNonce = useCallback(async () => {
    const { href: nonceUrl } = new URL(`nonce/${activeAddress}`, baseUrl);
    const nonceResponse = await makeHttpRequest<NonceResponseType>(nonceUrl);
    if (nonceResponse) return nonceResponse.nonce;
    return "";
  }, [activeAddress, baseUrl]);

  const getAccessToken = useCallback(
    async (signature: string, expirationTime: string, issuedAt: string) => {
      const { href: loginUrl } = new URL(`siwe`, baseUrl);
      const body = JSON.stringify({
        account_address: `${activeAddress}`,
        expiration_time: expirationTime,
        issued_at: issuedAt,
        signature,
      });
      const response = await makeHttpRequest<LoginResponseType>(loginUrl, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body,
      });
      if (response) {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("expiration_time", expirationTime);
        localStorage.setItem("issued_at", issuedAt);
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("expiration_time");
        localStorage.removeItem("issued_at");
      }
    },
    [activeAddress, baseUrl]
  );

  const requestToClose = useCallback(
    async (quoteId: number, quantityToClose: string, closePrice: string) => {
      const { href: instantCloseUrl } = new URL("instant_close", baseUrl);
      const token = localStorage.getItem("access_token");
      const body = JSON.stringify({
        quote_id: quoteId,
        quantity_to_close: quantityToClose,
        close_price: closePrice,
      });

      const response = await makeHttpRequest<InstantCloseResponseType>(
        instantCloseUrl,
        {
          method: "POST",
          headers: [
            ["Content-Type", "application/json"],
            ["Authorization", `Bearer ${token}`],
          ],
          body,
        }
      );

      if (!response) throw new Error("Can't close");
      if ("successful" in response) {
        return "position closed";
      }
      if ("error_code" in response) {
        throw new Error(response.error_message);
      }
    },
    [baseUrl]
  );

  const cancelClose = useCallback(async () => {
    if (!quoteId) {
      throw new Error("quote id is required");
    }
    const { href: cancelCloseUrl } = new URL(
      `instant_close/${quoteId}`,
      baseUrl
    );
    const token = localStorage.getItem("access_token");
    const response = await makeHttpRequest<InstantCloseResponseType>(
      cancelCloseUrl,
      {
        method: "DELETE",
        headers: [
          ["Content-Type", "application/json"],
          ["Authorization", `Bearer ${token}`],
        ],
      }
    );
    if (!response) return "instant close canceled";
  }, [baseUrl, quoteId]);

  const instantClose = useCallback(async () => {
    try {
      if (account && chainId) {
        if (!quoteId || !closePrice) throw new Error("missing props");
        if (!quantityToClose) throw new Error("Amount is too low");

        const token = localStorage.getItem("access_token");
        const currentDate = new Date();
        const expiration_date = new Date(
          localStorage.getItem("expiration_time") ?? "0"
        );

        if (token && expiration_date > currentDate) {
          await requestToClose(quoteId, quantityToClose, closePrice);
        } else {
          const nonceRes = await getNonce();
          const { expirationTime, issuedAt, message } = createSiweMessage(
            account,
            `msg: ${activeAddress}`,
            chainId,
            nonceRes,
            "deus.finance",
            `https://deus.finance/`
          );

          const sign = await onSignMessage(message);
          if (sign) await getAccessToken(sign, expirationTime, issuedAt);
          await requestToClose(quoteId, quantityToClose, closePrice);
        }
      }
    } catch (error) {
      throw error;
    }
  }, [
    account,
    chainId,
    quoteId,
    closePrice,
    quantityToClose,
    requestToClose,
    getNonce,
    activeAddress,
    onSignMessage,
    getAccessToken,
  ]);

  return { instantClose, cancelClose, isAccessDelegated };
}

function createSiweMessage(
  address: Address,
  statement: string,
  chainId: number,
  nonce: string,
  domain: string,
  uri: string,
  version = "1"
) {
  const issuedAt = new Date().toISOString();
  const expirationTime = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now
  const message = new SiweMessage({
    domain,
    address,
    statement,
    chainId,
    nonce,
    version,
    uri,
    issuedAt,
    expirationTime,
  });
  return { message: message.prepareMessage(), issuedAt, expirationTime };
}
