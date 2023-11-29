import styled from "styled-components";

import { PrimaryButton } from ".";
import { DotFlashing, LongArrow, ShortArrow } from "components/Icons";
import { useCallback } from "react";
import {
  useActiveMarket,
  usePositionType,
} from "@symmio-client/core/state/trade/hooks";
import { PositionType } from "@symmio-client/core/types/trade";
import { titleCase } from "@symmio-client/core/utils/string";

const IconWrap = styled.div`
  position: absolute;
  right: 10px;
`;

const Button = styled(PrimaryButton)<{ disabled?: boolean }>`
  ${({ theme, disabled }) =>
    disabled &&
    `
    background: ${theme.bg3};
    color: ${theme.text3};
    &:focus, &:hover {
        background: ${theme.bg3};
    }
  `}
`;

export default function OpenPositionButton({
  onClick,
  loading,
  disabled,
}: {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const market = useActiveMarket();
  const positionType = usePositionType();

  const handleClick = useCallback(() => {
    if (!loading || !disabled) onClick();
  }, [disabled, loading, onClick]);

  return (
    <Button onClick={handleClick} disabled={loading || disabled}>
      {`${titleCase(positionType)} ${market?.symbol}`}
      {loading && <DotFlashing />}
      <IconWrap>
        {positionType === PositionType.LONG ? (
          <LongArrow
            width={19}
            height={11}
            color={!loading && !disabled ? "#0B0C0E" : "#8B8E9F"}
            style={{ marginLeft: "8px" }}
          />
        ) : (
          <ShortArrow
            width={19}
            height={11}
            color={!loading && !disabled ? "#0B0C0E" : "#8B8E9F"}
            style={{ marginLeft: "8px" }}
          />
        )}
      </IconWrap>
    </Button>
  );
}
