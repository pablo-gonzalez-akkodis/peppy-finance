import { useState } from "react";
import styled from "styled-components";

import { Account as AccountType } from "@symmio-client/core/types/user";

import { useAppDispatch } from "@symmio-client/core/state";
import { updateAccount } from "@symmio-client/core/state/user/actions";
import { useActiveAccountAddress } from "@symmio-client/core/state/user/hooks";

import { RowCenter } from "components/Row";
import CreateAccountModal from "components/ReviewModal/CreateAccountModal";
import Account from "./Account";

const HoverWrapper = styled.div`
  padding: 0px 8px 12px 8px;
  width: clamp(200px, 360px, 99%);
  max-height: 240px;
  position: absolute;
  transform: translate(-115px, 29px);
  z-index: 1;
  background: ${({ theme }) => theme.bg1};
  border: 2px solid ${({ theme }) => theme.border3};
  border-radius: 4px;
  overflow: scroll;
`;

const GradientButtonWrapper = styled.div`
  padding: 1px;
  height: 40px;
  margin-top: 10px;
  border-radius: 4px;
  width: unset;
  background: ${({ theme }) => theme.gradLight};
`;

const GradientColorButton = styled(RowCenter)<{ disabled?: boolean }>`
  flex-wrap: nowrap;
  height: 100%;
  border-radius: 4px;
  background: ${({ theme }) => theme.bg1};

  &:focus,
  &:hover,
  &:active {
    cursor: ${({ disabled }) => !disabled && "pointer"};
    background: ${({ theme }) => theme.bg2};
  }
`;

const GradientButtonLabel = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  background: ${({ theme }) => theme.gradLight};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export default function AccountsModal({
  data,
  onDismiss,
}: {
  data: AccountType[];
  onDismiss: () => void;
}) {
  const activeAccountAddress = useActiveAccountAddress();
  const dispatch = useAppDispatch();
  const [createAccountModal, setCreateAccountModal] = useState(false);

  const onClick = (account: AccountType) => {
    dispatch(updateAccount(account));
    onDismiss();
  };

  function getInnerContent() {
    return (
      <div>
        {data.map((account, index) => {
          return (
            <Account
              account={account}
              key={index}
              active={
                activeAccountAddress
                  ? activeAccountAddress === account.accountAddress
                  : false
              }
              onClick={() => onClick(account)}
            />
          );
        })}
        <GradientButtonWrapper onClick={() => setCreateAccountModal(true)}>
          <GradientColorButton>
            <GradientButtonLabel>Create New Account</GradientButtonLabel>
          </GradientColorButton>
        </GradientButtonWrapper>
      </div>
    );
  }

  return (
    <HoverWrapper>
      {getInnerContent()}
      <CreateAccountModal
        isOpen={createAccountModal}
        onDismiss={() => setCreateAccountModal(false)}
      />
    </HoverWrapper>
  );
}
