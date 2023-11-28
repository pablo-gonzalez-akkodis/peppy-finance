import React from "react";
import styled from "styled-components";

import { Modal } from "components/Modal";
import CreateAccount from "components/App/AccountData/CreateAccount";

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: 100%;
`;

export default function CreateAccountModal({
  isOpen,
  onDismiss,
}: {
  isOpen: boolean;
  onDismiss: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onBackgroundClick={onDismiss}
      onEscapeKeydown={onDismiss}
    >
      <Wrapper>
        <CreateAccount onClose={onDismiss} />
      </Wrapper>
    </Modal>
  );
}
