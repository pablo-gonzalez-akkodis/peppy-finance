import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import BigNumber from "bignumber.js";

import {
  toBN,
  formatAmount,
  formatPrice,
} from "@symmio-client/core/utils/numbers";
import { useGetTokenWithFallbackChainId } from "@symmio-client/core/utils/token";
import { TransferTab } from "@symmio-client/core/types/transfer";
import { useCollateralToken } from "@symmio-client/core/constants/tokens";

import { ApplicationModal } from "@symmio-client/core/state/application/reducer";
import {
  useModalOpen,
  useWithdrawModalToggle,
} from "@symmio-client/core/state/application/hooks";
import { useIsHavePendingTransaction } from "@symmio-client/core/state/transactions/hooks";
import {
  useAccountPartyAStat,
  useActiveAccountAddress,
} from "@symmio-client/core/state/user/hooks";

import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import useAccountData from "@symmio-client/core/hooks/useAccountData";

import { Modal } from "components/Modal";
import { Option } from "components/Tab";
import { DotFlashing } from "components/Icons";
import { PrimaryButton } from "components/Button";
import { CustomInputBox2 } from "components/InputBox";
import { Close as CloseIcon } from "components/Icons";
import { useTransferCollateral } from "@symmio-client/core/callbacks/useTransferCollateral";
import { Row, RowBetween, RowStart } from "components/Row";
import WithdrawCooldown from "components/App/AccountData/WithdrawCooldown";

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

const WithdrawInfo = styled(RowStart)`
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
`;

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

const Close = styled.div`
  width: 24px;
  height: 24px;
  padding: 3px 6px;
  cursor: pointer;
  border-radius: 4px;
  margin: 2px 2px 1px 0px;
  background: ${({ theme }) => theme.bg6};
`;

export default function WithdrawModal() {
  const { chainId } = useActiveWagmi();
  const activeAccountAddress = useActiveAccountAddress();
  const [typedAmount, setTypedAmount] = useState("");
  const isPendingTxs = useIsHavePendingTransaction();
  const { availableForOrder } = useAccountData();
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const showWithdrawModal = useModalOpen(ApplicationModal.WITHDRAW);
  const toggleWithdrawModal = useWithdrawModalToggle();

  const { cooldownMA, allocatedBalance: subAccountAllocatedBalance } =
    useAccountPartyAStat(activeAccountAddress);

  const [amountForDeallocate, insufficientBalance] = useMemo(() => {
    const deallocateAmount = BigNumber.min(
      availableForOrder,
      subAccountAllocatedBalance
    );
    const insufficientBalance = deallocateAmount.isLessThan(typedAmount);
    if (deallocateAmount.isLessThan(0)) return ["0", insufficientBalance];
    return [deallocateAmount.toString(), insufficientBalance];
  }, [availableForOrder, subAccountAllocatedBalance, typedAmount]);

  const { callback: transferBalanceCallback, error: transferBalanceError } =
    useTransferCollateral(typedAmount, TransferTab.DEALLOCATE);
  const COLLATERAL_TOKEN = useCollateralToken();
  const collateralCurrency = useGetTokenWithFallbackChainId(
    COLLATERAL_TOKEN,
    chainId
  );

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
      toggleWithdrawModal();
    } catch (e) {
      setAwaitingConfirmation(false);
      if (e instanceof Error) {
        console.error(e);
      } else {
        console.error(e);
      }
    }
  }, [toggleWithdrawModal, transferBalanceCallback, transferBalanceError]);

  function getTabs() {
    return (
      <RowStart>
        <Option active={true}>{TransferTab.WITHDRAW}</Option>
      </RowStart>
    );
  }

  const onChange = (value: string) => {
    setTypedAmount(value);
  };

  function getLabel() {
    return (
      <LabelsRow>
        <WithdrawCooldown formatedAmount={false} />
        <CustomInputBox2
          balanceDisplay={
            !toBN(amountForDeallocate).isNaN()
              ? formatAmount(amountForDeallocate, 4, true)
              : "0.00"
          }
          value={typedAmount}
          title={"Amount"}
          balanceExact={
            !toBN(amountForDeallocate).isNaN()
              ? formatPrice(amountForDeallocate, collateralCurrency.decimals)
              : "0.00"
          }
          onChange={onChange}
          max={true}
          symbol={collateralCurrency?.symbol}
          precision={collateralCurrency.decimals}
        />
        <WithdrawInfo>
          You can withdraw your {collateralCurrency?.symbol}{" "}
          {`${toBN(cooldownMA).div(60).toString()}`} minutes after the
          deallocation.
        </WithdrawInfo>
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

    if (insufficientBalance)
      return <PrimaryButton disabled>Insufficient Balance</PrimaryButton>;

    const text = "Withdraw";

    return <PrimaryButton onClick={handleAction}>{text}</PrimaryButton>;
  }

  return (
    <Modal
      isOpen={showWithdrawModal}
      onBackgroundClick={toggleWithdrawModal}
      onEscapeKeydown={toggleWithdrawModal}
    >
      <Wrapper>
        <RowBetween>
          {getTabs()}
          <Close>
            <CloseIcon
              size={12}
              onClick={toggleWithdrawModal}
              style={{ cursor: "pointer" }}
            />
          </Close>
        </RowBetween>
        {getLabel()}
        {getActionButton()}
      </Wrapper>
    </Modal>
  );
}
