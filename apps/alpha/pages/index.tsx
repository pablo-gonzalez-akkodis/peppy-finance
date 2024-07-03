import React, { useEffect } from "react";
import { updateAccount } from "@symmio/frontend-sdk/state/user/actions";
import Link from "next/link";
import { useAppDispatch } from "@symmio/frontend-sdk/state";
import { useUserAccounts } from "@symmio/frontend-sdk/hooks/useAccounts";
import styled from "styled-components";
import { Box } from "rebass/styled-components";
import { ExternalLink } from "components/Link";
import { APP_URL } from "constants/chains/misc";
import { NavBarLogo } from "components/Icons";
import { useIsMobile } from "lib/hooks/useWindowSize";

export const Row = styled(Box)<{
  width?: string;
  align?: string;
  justify?: string;
  padding?: string;
  border?: string;
  gap?: string;
  borderRadius?: string;
}>`
  width: ${({ width }) => width ?? "100%"};
  display: flex;
  padding: 0;
  gap: ${({ gap }) => gap && `${gap}`};
  align-items: ${({ align }) => align ?? "center"};
  justify-content: ${({ justify }) => justify ?? "flex-start"};
  padding: ${({ padding }) => padding};
  padding: ${({ padding }) => padding};
  border-radius: ${({ borderRadius }) => borderRadius};
`;

export const RowCenter = styled(Row)`
  justify-content: center;
`;

export const BaseButton = styled(RowCenter)<{
  active?: boolean;
  disabled?: boolean;
}>`
  padding: 1rem;
  height: 100%;
  font-weight: 600;
  border-radius: 4px;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    opacity: 50%;
    cursor: auto;
    pointer-events: none;
  }
  will-change: transform;
  transition: transform 450ms ease;
  transform: perspective(1px) translateZ(0);
  > * {
    user-select: none;
  }
  > a {
    text-decoration: none;
  }
`;

const Wrapper = styled(RowCenter)`
  flex-direction: column-reverse;
  align-items: center;
  width: fit-content;
  align-items: center;
`;

export const TabHome = styled(RowCenter)`
  height: 40px;
  position: relative;
  cursor: pointer;
  margin-top: 30px;
  text-align: center;
  overflow: hidden;
  border-radius: 10px;
  text-transform: uppercase;
  font-weight: 400;
  color: ${({ theme }) => theme.text8};
  background: ${({ theme }) => theme.bg9};

  opacity: 0px;
`;

const SymmetrialText = styled.div`
  gap: 4px;
  font-size: 47px;
  font-weight: 700;
  margin: 0px 4px 4px 4px;
  background: linear-gradient(
    180deg,
    rgba(199, 241, 153, 1),
    rgba(92, 220, 240, 1) 100%
  );
  text-shadow: 0px 2px 0px #00000040;
  font-family: Space Grotesk;
  font-size: 66px;
  font-weight: 700;
  line-height: 59.4px;
  text-align: center;

  mix-blend-mode: plus-lighter;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: ${({ theme }) => theme.text0};
  ${({ theme }) => theme.mediaWidth.upToMedium`
  `};
`;

export default function MyFunction() {
  const dispatch = useAppDispatch();
  const { accounts } = useUserAccounts();
  const mobileVersion = useIsMobile();

  useEffect(() => {
    if (accounts !== null) {
      const lastSubAccount = accounts[accounts.length - 1];
      dispatch(updateAccount(lastSubAccount));
    }
  }, [accounts, dispatch]);
  console.log("accounts", accounts);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Wrapper>
        <TabHome style={!mobileVersion ? { width: "100%" } : { width: "85%" }}>
          <Link href="/trade">
            <p>Start Trading</p>
          </Link>
        </TabHome>
        <div
          className="boxStylingDarker"
          style={
            !mobileVersion
              ? { width: "100%", padding: "20px" }
              : { width: "85%", padding: "20px" }
          }
        >
          <p>
            Trade BTC, ETH and native Shimmer tokens with up to 100x leverage
            directly from your wallet
          </p>
        </div>

        <NavBarLogo
          width={mobileVersion ? 208 : 208}
          height={mobileVersion ? 208 : 208}
        />
        <SymmetrialText className="space-grotesk">
          PEPPY FINANCE{" "}
        </SymmetrialText>
      </Wrapper>
    </div>
  );
}
