import styled from "styled-components";

import { BaseButton } from "components/Button";

export const GradientButtonWrapper = styled(BaseButton)`
  padding: 1px;
  height: 40px;
  border-radius: 4px;
  background: ${({ theme }) => theme.gradLight};
`;

export const GradientColorButton = styled(BaseButton)`
  height: 100%;
  border-radius: 4px;
  background: ${({ theme }) => theme.bg1};

  &:focus,
  &:hover,
  &:active {
    background: ${({ theme }) => theme.black2};
    cursor: ${({ disabled }) => !disabled && "pointer"};
  }
`;

export const GradientButtonLabel = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  background: ${({ theme }) => theme.gradLight};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export default function GradientButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <GradientButtonWrapper>
      <GradientColorButton onClick={onClick}>
        <GradientButtonLabel>{label}</GradientButtonLabel>
        <div>{children}</div>
      </GradientColorButton>
    </GradientButtonWrapper>
  );
}
