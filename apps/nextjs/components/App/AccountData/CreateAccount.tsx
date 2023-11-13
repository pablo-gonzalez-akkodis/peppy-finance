import { useCallback, useState } from "react";
import styled from "styled-components";
import Image from "next/legacy/image";

import GRADIENT_CLOVERFIELD_LOGO from "/public/static/images/etc/GradientCloverfield.svg";

import { useCollateralToken } from "@symmio-client/core/constants/tokens";
import { truncateAddress } from "@symmio-client/core/utils/address";
import { useGetTokenWithFallbackChainId } from "@symmio-client/core/utils/token";
import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";

import { useAddAccountToContract } from "@symmio-client/core/callbacks/useMultiAccount";
import { useIsAccountWhiteList } from "@symmio-client/core/hooks/useAccounts";

import Column from "components/Column";
import { BaseButton } from "components/Button";
import { Row, RowCenter, RowEnd, RowStart } from "components/Row";
import {
  Client,
  Wallet,
  Close as CloseIcon,
  DotFlashing,
} from "components/Icons";

const Wrapper = styled.div<{ modal?: boolean }>`
  border: none;
  width: 100%;
  min-height: 379px;
  border-radius: ${({ modal }) => (modal ? "10px" : "4px")};
  background: ${({ theme }) => theme.bg0};
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 100%;
  `};
`;

const Title = styled(RowStart)`
  padding: 12px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.text0};
`;

const ContentWrapper = styled(Column)`
  padding: 12px;
  position: relative;
`;

const ImageWrapper = styled(RowCenter)`
  margin-top: 15px;
  margin-bottom: 34px;
`;

const DepositButtonWrapper = styled(BaseButton)<{ disabled?: boolean }>`
  padding: 1px;
  height: 40px;
  border-radius: 8px;
  background: ${({ theme }) => theme.gradLight};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;

const DepositButton = styled(BaseButton)`
  height: 100%;
  border: 1px solid ${({ theme }) => theme.gradLight};
  border-radius: 8px;
  background: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.gradLight};

  &:focus,
  &:hover,
  &:active {
    cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
    background: ${({ theme, disabled }) =>
      disabled ? theme.bg1 : theme.black};
  }
`;

const ButtonLabel = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  background: ${({ theme }) => theme.gradLight};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AccountWrapper = styled(Row)`
  height: 40px;
  background: ${({ theme }) => theme.bg2};
  border-radius: 6px;
  margin-bottom: 16px;
  padding: 10px 12px;
  font-weight: 500;
  font-size: 12px;

  color: ${({ theme }) => theme.primaryBlue};
`;

const AccountNameWrapper = styled(AccountWrapper)`
  background: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text3};
`;

const Input = styled.input<{
  [x: string]: any;
}>`
  height: fit-content;
  width: 90%;
  border: none;
  background: transparent;
  font-size: 12px;
  /* color: ${({ theme }) => theme.text3}; */
  padding-left: 2px;

  &::placeholder {
    color: ${({ theme }) => theme.text3};
  }

  &:focus,
  &:hover {
    color: ${({ theme }) => theme.text0};
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      font-size: 0.6rem;
    `}
`;

const Close = styled.div`
  width: 24px;
  height: 24px;
  padding: 3px 6px;
  cursor: pointer;
  border-radius: 4px;
  margin: 2px 12px 1px 0px;
  background: ${({ theme }) => theme.bg6};
`;

const DescriptionText = styled.div`
  font-size: 12px;
  text-align: center;
  margin-top: 16px;

  color: ${({ theme }) => theme.text4};
`;

const AcceptRiskWrapper = styled.div`
  padding: 4px 0px 16px 12px;
`;

export default function CreateAccount({ onClose }: { onClose?: () => void }) {
  const { account, chainId } = useActiveWagmi();
  const [name, setName] = useState("");
  const [, setTxHash] = useState("");
  const userWhitelisted = useIsAccountWhiteList();
  // const [acceptRiskValue, setAcceptRiskValue] = useState(false)
  const COLLATERAL_TOKEN = useCollateralToken();

  const collateralCurrency = useGetTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  // const message = 'Users interacting with this software do so entirely at their own risk'
  const { callback: addAccountToContractCallback } =
    useAddAccountToContract(name);
  // const { callback: signMessageCallback, error, state } = useSignMessage(message)

  const onAddAccount = useCallback(async () => {
    if (!addAccountToContractCallback) return;
    try {
      setAwaitingConfirmation(true);
      const txHash = await addAccountToContractCallback();
      setAwaitingConfirmation(false);
      if (txHash) setTxHash(txHash.hash);
      onClose && onClose();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
      } else {
        console.debug(e);
      }
    }
    setAwaitingConfirmation(false);
  }, [addAccountToContractCallback, onClose]);

  // const onSignMessage = useCallback(async () => {
  //   if (!signMessageCallback) return
  //   try {
  //     setAwaitingConfirmation(true)
  //     const txHash = await signMessageCallback()
  //     setTxHash(txHash)
  //     setAwaitingConfirmation(false)
  //     onClose && onClose()
  //   } catch (e) {
  //     setAcceptRiskValue(false)
  //     if (e instanceof Error) {
  //       console.error(e)
  //     } else {
  //       console.debug(e)
  //     }
  //   }
  //   setAwaitingConfirmation(false)
  // }, [signMessageCallback, onClose])

  // useEffect(() => {
  //   if (acceptRiskValue) onSignMessage()
  // }, [onSignMessage, acceptRiskValue])

  function getActionButton() {
    if (awaitingConfirmation) {
      return (
        <DepositButtonWrapper>
          <DepositButton>
            <ButtonLabel>Awaiting Confirmation</ButtonLabel>
            <DotFlashing />
          </DepositButton>
        </DepositButtonWrapper>
      );
    }

    if (userWhitelisted === false) {
      return (
        <DepositButtonWrapper disabled={true}>
          <DepositButton disabled={true}>
            <ButtonLabel>You are not whitelisted</ButtonLabel>
          </DepositButton>
        </DepositButtonWrapper>
      );
    }

    return (
      <DepositButtonWrapper>
        <DepositButton onClick={() => onAddAccount()}>
          <ButtonLabel>
            {name === "" ? "Enter account name" : "Create Account"}
          </ButtonLabel>
        </DepositButton>
      </DepositButtonWrapper>
    );
  }

  return (
    <Wrapper modal={onClose ? true : false}>
      <Row>
        <Title>Create Account</Title>
        <RowEnd>
          {onClose && (
            <Close>
              {" "}
              <CloseIcon
                size={12}
                onClick={onClose}
                style={{ marginRight: "12px" }}
              />
            </Close>
          )}
        </RowEnd>
      </Row>
      <ContentWrapper>
        <ImageWrapper>
          <Image
            src={GRADIENT_CLOVERFIELD_LOGO}
            alt="cloverfield_logo"
            width={110}
            height={121}
          />
        </ImageWrapper>
        <AccountWrapper>
          {account && truncateAddress(account)}
          <RowEnd>
            <Wallet />
          </RowEnd>
        </AccountWrapper>
        <AccountNameWrapper>
          <Input
            autoFocus
            type="text"
            placeholder={"Account Name (it will be saved on chain)"}
            spellCheck="false"
            onBlur={() => null}
            value={name}
            minLength={1}
            maxLength={20}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setName(event.target.value)
            }
          />
          <RowEnd width={"10%"}>
            <Client />
          </RowEnd>
        </AccountNameWrapper>
        <AcceptRiskWrapper>
          {/* <Checkbox
            name={'user-accept-risk'}
            id={'user-accept-risk'}
            label={message}
            checked={acceptRiskValue}
            onChange={() => {
              setAcceptRiskValue((prevValue) => !prevValue)
            }}
          /> */}
        </AcceptRiskWrapper>
        {getActionButton()}
        {onClose && (
          <DescriptionText>{`Create Account > Deposit ${collateralCurrency?.symbol} > Enjoy Trading`}</DescriptionText>
        )}
      </ContentWrapper>
    </Wrapper>
  );
}
