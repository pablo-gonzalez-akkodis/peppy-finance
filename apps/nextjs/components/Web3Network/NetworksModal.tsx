import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Z_INDEX } from "theme";

import { ChainInfo } from "@symmio-client/core/constants/chainInfo";
import {
  SupportedChainId,
  V3_CHAIN_IDS,
} from "@symmio-client/core/constants/chains";

import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import useRpcChangerCallback from "@symmio-client/core/lib/hooks/useRpcChangerCallback";

import { Row } from "components/Row";
import { Card } from "components/Card";
import { Modal as ModalBody } from "components/Modal";
import ImageWithFallback from "components/ImageWithFallback";

const ModalWrapper = styled(Card)`
  padding: 0.6rem;
  border: none;
  border-radius: 4px;

  & > * {
    &:last-child {
      overflow-y: scroll;
      overflow-x: hidden;
      width: 100%;
      min-height: 100%;
      max-height: 400px;
    }
  }
`;

const InlineModal = styled(Card)<{ isOpen: boolean; height?: string }>`
  padding: 0px;
  border-radius: 4px;
  width: clamp(100px, 207px, 99%);
  max-height: ${({ height }) => height ?? "554px"};
  position: absolute;
  z-index: ${Z_INDEX.modal};
  transform: translate(-154px, 29px);
  background: ${({ theme }) => theme.bg1};
  border: 2px solid ${({ theme }) => theme.bg6};
  display: ${(props) => (props.isOpen ? "flex" : "none")};

  & > * {
    &:last-child {
      overflow-y: scroll;
      overflow-x: hidden;
      width: 100%;
      min-height: 100%;
    }
  }
`;

const Modal = styled(ModalBody)`
  border: none;
`;

const Network = styled(Row)<{ active?: boolean }>`
  gap: 12px;
  height: 44px;
  padding: 8px;
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  cursor: ${({ active }) => (active ? "default" : "pointer")};
  border: 2px solid ${({ theme }) => theme.border3};
  background: ${({ theme, active }) => (active ? theme.bg4 : theme.bg)};

  ${({ active }) =>
    active &&
    `
    opacity: 0.5;
  `}
`;

const Logo = styled.div`
  min-height: 28px;
  min-width: 28px;
`;

export function NetworksModal({
  isModal,
  isOpen,
  onDismiss,
}: {
  isModal?: boolean;
  isOpen: boolean;
  onDismiss: () => void;
}) {
  const { chainId } = useActiveWagmi();
  const rpcChangerCallback = useRpcChangerCallback();
  const callBackFlag = useRef(false);

  const handleClick = (chainId: SupportedChainId) => {
    rpcChangerCallback(chainId);
    callBackFlag.current = true;
  };

  useEffect(() => {
    if (callBackFlag.current) {
      onDismiss();
      callBackFlag.current = false;
    }
  }, [chainId, onDismiss]);

  function getInnerContent() {
    return (
      <div>
        {V3_CHAIN_IDS.map((chain: SupportedChainId, index) => {
          const Chain = ChainInfo[chain];
          return (
            <Network
              key={index}
              active={chain === chainId}
              onClick={() => handleClick(chain)}
            >
              <Logo>
                <ImageWithFallback
                  src={Chain.logoUrl}
                  alt={Chain.label}
                  width={28}
                  height={28}
                />
              </Logo>

              {Chain.chainName}
            </Network>
          );
        })}
      </div>
    );
  }

  return isModal ? (
    <Modal
      isOpen={isOpen}
      onBackgroundClick={onDismiss}
      onEscapeKeydown={onDismiss}
    >
      <ModalWrapper>{getInnerContent()}</ModalWrapper>
    </Modal>
  ) : (
    <InlineModal isOpen={isOpen}>{getInnerContent()}</InlineModal>
  );
}
