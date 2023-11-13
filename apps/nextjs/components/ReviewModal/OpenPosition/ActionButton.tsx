import React, { useCallback, useContext } from "react";
import toast from "react-hot-toast";
import { useSentQuoteCallback } from "@symmio-client/core/callbacks/useSendQuote";
import useTradePage from "@symmio-client/core/hooks/useTradePage";
import { ModalState, StateContext } from "./ModalData";
import ErrorButton from "components/Button/ErrorButton";
import OpenPositionButton from "components/Button/OpenPositionButton";

export default function ActionButton() {
  const { state } = useTradePage();
  const { setState, state: modalState, setTxHash } = useContext(StateContext);

  const { callback: tradeCallback, error: tradeCallbackError } =
    useSentQuoteCallback();

  const onTrade = useCallback(async () => {
    if (!tradeCallback) {
      toast.error(tradeCallbackError);
      return;
    }

    let error = "";
    try {
      setState(ModalState.LOADING);
      const tx = await tradeCallback();
      setTxHash(tx);
    } catch (e) {
      setState(ModalState.START);
      setTxHash("");
      if (e instanceof Error) {
        error = e.message;
      } else {
        console.debug(e);
        error = "An unknown error occurred.";
      }
    }
    if (error) {
      console.log(error);
    }
  }, [setState, setTxHash, tradeCallback, tradeCallbackError]);

  if (state) {
    return <ErrorButton state={state} disabled={true} exclamationMark={true} />;
  }

  return (
    <OpenPositionButton
      loading={modalState === ModalState.LOADING}
      onClick={() => onTrade()}
    />
  );
}
