import { useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { Z_INDEX } from "theme";

import { Account as AccountType } from "@symmio-client/core/types/user";

import { RowBetween, RowEnd, RowStart } from "components/Row";

const AccountWrapper = styled.div<{ active?: boolean }>`
  position: relative;
  padding: 12px;
  height: 82px;
  margin: 8px 0px;
  border-radius: 3px;
  background: ${({ theme, active }) => (active ? theme.bg6 : theme.bg3)};
  border: 1px solid ${({ theme, active }) => (active ? theme.text0 : theme.bg7)};
  z-index: ${Z_INDEX.tooltip};
`;

const Row = styled(RowBetween)`
  flex-flow: row nowrap;
  margin-bottom: 8px;
  gap: 0.5rem;
`;

const Label = styled(RowStart)`
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
`;

const Value = styled(RowEnd)`
  font-size: 12px;
  color: ${({ theme }) => theme.text0};
`;

const UpnlText = styled(RowEnd)`
  font-size: 10px;
  color: ${({ theme }) => theme.text3};
`;

const UpnlValue = styled.div<{ color?: string }>`
  font-size: 12px;
  justify-self: end;
  margin-left: 4px;
  color: ${({ theme, color }) => color ?? theme.text1};
`;
export default function Account({
  account,
  active,
  onClick,
}: {
  account: AccountType;
  active: boolean;
  onClick: () => void;
}): JSX.Element {
  const theme = useTheme();

  // const [value, color] = useMemo(() => {
  const [, color] = useMemo(() => {
    const upnl = { upnl: 0 };
    if (upnl.upnl > 0) return [`+ $${upnl.upnl}`, theme.green1];
    else if (upnl.upnl < 0) [`$${upnl.upnl}`, theme.red1];
    return [`$${upnl.upnl}`, undefined];
  }, [theme]);

  return (
    <AccountWrapper active={active} onClick={onClick}>
      <Row>
        <Label style={{ color: theme.text0 }}>{account.name}</Label>

        <UpnlText>
          uPNL:
          <UpnlValue color={color}>{/* {value} */}-</UpnlValue>
        </UpnlText>
      </Row>
      <Row>
        <Label>Available for Orders:</Label>
        <Value>-</Value>
      </Row>
      <Row>
        <Label>Locked Margin: </Label>
        <Value>-</Value>
      </Row>
    </AccountWrapper>
  );
}
