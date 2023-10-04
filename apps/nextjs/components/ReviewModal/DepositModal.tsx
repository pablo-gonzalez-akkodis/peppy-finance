import React, { useCallback, useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";
import { toast } from "react-hot-toast";

import { MULTI_ACCOUNT_ADDRESS } from "@symmio-client/core/constants/addresses";
import { FALLBACK_CHAIN_ID } from "@symmio-client/core/constants/chains";
import {
  toBN,
  formatAmount,
  BN_ZERO,
  formatPrice,
} from "@symmio-client/core/utils/numbers";
import { getTokenWithFallbackChainId } from "@symmio-client/core/utils/token";
import { COLLATERAL_TOKEN } from "@symmio-client/core/constants/tokens";

import { TransferTab } from "@symmio-client/core/types/transfer";
import {
  useDepositModalToggle,
  useModalOpen,
} from "@symmio-client/core/state/application/hooks";
import { ApplicationModal } from "@symmio-client/core/state/application/reducer";
import { useIsHavePendingTransaction } from "@symmio-client/core/state/transactions/hooks";
import {
  useAccountPartyAStat,
  useActiveAccountAddress,
} from "@symmio-client/core/state/user/hooks";

import {
  ApprovalState,
  useApproveCallback,
} from "@symmio-client/core/lib/hooks/useApproveCallback";
import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";

import { Modal } from "components/Modal";
import InfoItem from "components/InfoItem";
import { Option } from "components/Tab";
import { DotFlashing } from "components/Icons";
import { PrimaryButton } from "components/Button";
import { CustomInputBox2 } from "components/InputBox";
import { Close as CloseIcon } from "components/Icons";
import { useTransferCollateral } from "@symmio-client/core/callbacks/useTransferCollateral";
import { Row, RowBetween, RowStart } from "components/Row";

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: 100%;
  padding: 1rem;
  gap: 0.8rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0.5rem;
  `};
`;

// const BuyDei = styled(PrimaryButton)`
//   &:focus,
//   &:hover,
//   &:active {
//     background: ${({ theme }) => theme.primaryBlue};
//     cursor: ${({ disabled }) => !disabled && 'pointer'};
//   }
// `

const LabelsRow = styled(Row)`
  flex-direction: column;
  gap: 16px;
  padding-bottom: 36px;

  & > * {
    &:first-child {
      width: 100%;
    }
  }
`;

// const BuyDeiText = styled.div`
//   margin-left: 10px;
//   color: ${({ theme }) => theme.black};
// `

const Close = styled.div`
  width: 24px;
  height: 24px;
  padding: 3px 6px;
  cursor: pointer;
  border-radius: 4px;
  margin: 2px 2px 1px 0px;
  background: ${({ theme }) => theme.bg6};
`;

export default function DepositModal() {
  const theme = useTheme();
  const { chainId, account } = useActiveWagmi();
  const activeAccountAddress = useActiveAccountAddress();
  const [typedAmount, setTypedAmount] = useState("");
  const isPendingTxs = useIsHavePendingTransaction();
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const showDepositModal = useModalOpen(ApplicationModal.DEPOSIT);
  const toggleDepositModal = useDepositModalToggle();

  const { accountBalanceLimit, allocatedBalance: subAccountAllocatedBalance } =
    useAccountPartyAStat(activeAccountAddress);

  const { collateralBalance } = useAccountPartyAStat(account);

  const allowedDepositAmount = useMemo(() => {
    const amount = toBN(accountBalanceLimit).minus(subAccountAllocatedBalance);
    return amount.gt(0) ? amount : BN_ZERO;
  }, [accountBalanceLimit, subAccountAllocatedBalance]);

  const insufficientBalance = useMemo(() => {
    return toBN(collateralBalance).isLessThan(typedAmount);
  }, [collateralBalance, typedAmount]);

  const { callback: transferBalanceCallback, error: transferBalanceError } =
    useTransferCollateral(typedAmount, TransferTab.DEPOSIT);
  // const { callback: mintCallback, error: mintCallbackError } = useMintCollateral()

  const spender = useMemo(
    () => MULTI_ACCOUNT_ADDRESS[chainId ?? FALLBACK_CHAIN_ID],
    [chainId]
  );
  const collateralCurrency = getTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );

  const [approvalState, approveCallback] = useApproveCallback(
    collateralCurrency,
    typedAmount ?? "0",
    spender
  );

  const [showApprove, showApproveLoader] = useMemo(() => {
    const show =
      collateralCurrency &&
      approvalState !== ApprovalState.APPROVED &&
      !!typedAmount;
    return [show, show && approvalState === ApprovalState.PENDING];
  }, [collateralCurrency, approvalState, typedAmount]);

  const handleAction = useCallback(async () => {
    if (!transferBalanceCallback) {
      toast.error(transferBalanceError);
      return;
    }

    try {
      setAwaitingConfirmation(true);
      await transferBalanceCallback();
      setTypedAmount("");
      setAwaitingConfirmation(false);
      toggleDepositModal();
    } catch (e) {
      setAwaitingConfirmation(false);
      if (e instanceof Error) {
        console.error(e);
      } else {
        console.error(e);
      }
    }
  }, [toggleDepositModal, transferBalanceCallback, transferBalanceError]);

  // const onDeiMint = useCallback(async () => {
  //   if (!mintCallback) {
  //     toast.error(mintCallbackError)
  //     return
  //   }

  //   let error = ''
  //   try {
  //     setAwaitingMintConfirmation(true)
  //     const txHash = await mintCallback()
  //     setTxHash(txHash)
  //     setAwaitingMintConfirmation(false)
  //   } catch (e) {
  //     setAwaitingMintConfirmation(false)
  //     if (e instanceof Error) {
  //       error = e.message
  //     } else {
  //       console.debug(e)
  //       error = 'An unknown error occurred.'
  //     }
  //   }
  //   if (error) console.log(error)
  //   setAwaitingMintConfirmation(false)
  // }, [mintCallback, mintCallbackError])

  const handleApprove = async () => {
    try {
      setAwaitingConfirmation(true);
      await approveCallback();
      setAwaitingConfirmation(false);
      // toggleDepositModal()
    } catch (err) {
      console.error(err);
      setAwaitingConfirmation(false);
      // toggleDepositModal()
    }
  };

  function getTabs() {
    return (
      <RowStart>
        <Option active={true}>{TransferTab.DEPOSIT}</Option>
      </RowStart>
    );
  }

  const onChange = (value: string) => {
    setTypedAmount(value);
  };

  function getLabel() {
    // removeTrailingZeros
    return (
      <LabelsRow>
        <CustomInputBox2
          title={`Deposit Amount`}
          value={typedAmount}
          onChange={onChange}
          max={true}
          symbol={collateralCurrency?.symbol}
          precision={collateralCurrency.decimals}
          balanceTitle={`${collateralCurrency?.symbol} Balance:`}
          balanceExact={
            collateralBalance
              ? formatAmount(collateralBalance.toString())
              : "0.00"
          }
          balanceDisplay={
            collateralBalance
              ? formatAmount(collateralBalance.toString(), 4, true)
              : "0.00"
          }
        />
        <InfoItem
          label={"Allocated Balance"}
          amount={formatAmount(subAccountAllocatedBalance.toString(), 4, true)}
          ticker={`${collateralCurrency?.symbol}`}
        />
        <InfoItem
          label={"Allowed to Deposit"}
          balanceExact={formatPrice(
            allowedDepositAmount,
            collateralCurrency?.decimals
          )}
          amount={formatAmount(allowedDepositAmount.toString(), 4, true)}
          ticker={`${collateralCurrency?.symbol}`}
          valueColor={theme.primaryBlue}
          onClick={onChange}
        />
      </LabelsRow>
    );
  }

  function getActionButton() {
    if (awaitingConfirmation) {
      return (
        <PrimaryButton>
          Awaiting Confirmation <DotFlashing />
        </PrimaryButton>
      );
    }

    if (isPendingTxs) {
      return (
        <PrimaryButton>
          Transacting <DotFlashing />
        </PrimaryButton>
      );
    }

    if (allowedDepositAmount.isLessThan(typedAmount))
      return (
        <PrimaryButton disabled>Amount exceeds deposit limit</PrimaryButton>
      );

    if (insufficientBalance)
      return <PrimaryButton disabled>Insufficient Balance</PrimaryButton>;

    if (showApproveLoader) {
      return (
        <PrimaryButton>
          Approving <DotFlashing />
        </PrimaryButton>
      );
    }

    if (showApprove) {
      return (
        <PrimaryButton onClick={handleApprove}>
          Approve Collateral
        </PrimaryButton>
      );
    }

    return (
      <PrimaryButton onClick={handleAction}>Deposit and allocate</PrimaryButton>
    );
  }

  return (
    <Modal
      isOpen={showDepositModal}
      onBackgroundClick={toggleDepositModal}
      onEscapeKeydown={toggleDepositModal}
    >
      <Wrapper>
        <RowBetween>
          {getTabs()}
          <Close>
            <CloseIcon
              size={12}
              onClick={toggleDepositModal}
              style={{ cursor: "pointer" }}
            />
          </Close>
        </RowBetween>

        {getLabel()}
        {/* {toBN(collateralBalance).lt(100) && activeTab === TransferTab.DEPOSIT && (
          <BuyDei onClick={onDeiMint}>
            <Image src={'/static/images/tokens/dei.svg'} width={20} height={20} alt="Dei Logo" />
            <BuyDeiText>mint TEST DEI</BuyDeiText>
            {awaitingMintConfirmation ? <DotFlashing /> : <></>}
          </BuyDei>
        )} */}
        {getActionButton()}
      </Wrapper>
    </Modal>
  );
}
