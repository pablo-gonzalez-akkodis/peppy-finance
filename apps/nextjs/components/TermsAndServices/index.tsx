import React from "react";

import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import { useIsTermsAccepted } from "@symmio-client/core/state/user/hooks";

import TermsModal from "components/ReviewModal/TermsModal";

export default function TermsAndServices() {
  const { account } = useActiveWagmi();
  const isTermsAccepted = useIsTermsAccepted();

  if (account && !isTermsAccepted) {
    return <TermsModal onDismiss={() => console.log("")} />;
  }
  return null;
}
