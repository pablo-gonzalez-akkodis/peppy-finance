import styled from "styled-components";

import { BaseButton } from "components/Button";
import { useCallback } from "react";

export const GradientColorButton = styled(BaseButton)`
  height: 40px; 
  border-radius: 25px;
  background: ${({ theme }) => theme.bg9};

  &:focus,
  &:hover,
  &:active {
    background: ${({ theme }) => theme.pinkGrad};

    cursor: ${({ disabled }) => !disabled && "pointer"};
  }

  ${({ disabled }) =>
    disabled &&
    `
      cursor: default;

  `}
`;

export const GradientButtonLabel = styled.span<{ whiteText?: boolean }>`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text7};
`;

export default function GradientButton({
  label,
  onClick,
  children,
  whiteText,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
  whiteText?: boolean;
  disabled?: boolean;
}): JSX.Element {
  const handleClick = useCallback(() => {
    if (!disabled && onClick) onClick();
  }, [disabled, onClick]);

  return (
    <GradientColorButton onClick={handleClick} disabled={disabled}>
      <GradientButtonLabel whiteText={whiteText}>{label}</GradientButtonLabel>
      <div>{children}</div>
    </GradientColorButton>
  );
}
