import React, { useState } from "react";
import styled from "styled-components";
import { Z_INDEX } from "theme";
import Image from "next/legacy/image";

import { useIsMobile } from "lib/hooks/useWindowSize";
import { useNewNotification } from "@symmio-client/core/state/notifications/hooks";
import { useInjectedAddress } from "lib/hooks/useInjectedAddress";

import { Row } from "components/Row";
import Web3Network from "components/Web3Network";

import Web3Status from "components/Web3Status";
import { InfoHeader } from "components/InfoHeader";
import NavLogo from "./NavLogo";
import WithdrawCooldown from "components/App/AccountData/WithdrawCooldown";
import Notifications from "components/Notifications";
import Warning from "./Warning";
// import Menu from './Menu'
import Column from "components/Column";

const Wrapper = styled(Row)`
  gap: 5px;
  font-size: 16px;
  flex-wrap: nowrap;
  padding: 16px 2rem;
  position: relative;
  z-index: ${Z_INDEX.fixed};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    background-color: ${({ theme }) => theme.bg};
    padding: 0px 1.25rem;
  `};
`;

const BackgroundWrapper = styled(Wrapper)<{ newNotification?: boolean }>`
  @keyframes fade {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  padding: 0px;
  height: 72px;
  overflow: hidden;
  position: absolute;
  background: ${({ theme, newNotification }) =>
    newNotification ? theme.primaryDisable : theme.bg};
  animation: ${({ newNotification }) =>
    newNotification ? "fade 1s linear 1" : "none"};
`;

const MobileWrapper = styled(Wrapper)`
  justify-content: flex-end;
  font-size: 12px;
  flex-wrap: wrap;
  padding: 16px 16px 8px 16px;
  background-color: ${({ theme }) => theme.bg};

  & > * {
    &:first-child {
      margin-right: auto;
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 16px 12px 8px 12px;
  & > * {

    &:nth-child(2) {
      width: 100%;
      order: 2;
      margin-top: 12px;
    }
    &:nth-child(1),
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5) {
      order: 1;
    }
  }
  `};
`;

export const NavbarContentWrap = styled.div`
  list-style: none;
  margin: auto;
  margin-left: 15px;
  margin-right: 15px;
  cursor: pointer;
  padding: 10px 0;
  position: relative;

  &:hover {
    display: block;
    & > ul {
      display: block;
    }
  }
`;

export const SubNavbarContentWrap = styled.ul`
  display: none;
  padding: 12px 0 12px 0px;
  background: ${({ theme }) => theme.bg2};
  border-radius: 10px;
  list-style: none;
  position: absolute;
  top: 50px;
  margin-top: -14px;
  left: 50%;
  transform: translateX(-50%);

  & > li > div {
    border-radius: 0;
    padding: 0.45rem 1rem;
    min-width: 150px;
  }
`;

const Items = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  gap: 12px;
  flex: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
      gap: 5px;
  `};
`;

const StatusWrapper = styled(Column)`
  & > * {
    width: 100%;
  }
  gap: 12px;
  z-index: -1;
`;
const CooldownWrapper = styled(Column)`
  & > * {
    width: 100%;
  }
  z-index: -1;
`;

export default function NavBar() {
  const hasInjected = useInjectedAddress();
  const isNewNotification = useNewNotification();
  const showBanner =
    localStorage.getItem("risk_warning") === "true" ? false : true;
  const [showTopBanner, setShowTopBanner] = useState(showBanner);
  const bannerText =
    "Users interacting with this software do so entirely at their own risk";

  function setShowBanner(inp: boolean) {
    if (!inp) {
      localStorage.setItem("risk_warning", "true");
      setShowTopBanner(false);
    }
  }

  function getMobileContent() {
    return (
      <>
        <BackgroundWrapper newNotification={isNewNotification} />
        <MobileWrapper>
          <NavLogo />
          <StatusWrapper>
            <Web3Status />
            <CooldownWrapper>
              <WithdrawCooldown formatedAmount={false} />
            </CooldownWrapper>
          </StatusWrapper>
          <Notifications />
          <Web3Network />

          {/* <Menu /> */}
        </MobileWrapper>
        {showTopBanner && (
          <InfoHeader
            onClose={setShowBanner}
            hasInfoIcon={true}
            text={bannerText}
          />
        )}
      </>
    );
  }

  function getDefaultContent() {
    return (
      <>
        <BackgroundWrapper newNotification={isNewNotification}>
          <Image
            src={"/static/images/header/Pattern.svg"}
            alt={"Pattern"}
            height={72}
            width={1800}
          />
        </BackgroundWrapper>
        <Wrapper>
          <NavLogo />
          <Items>
            <WithdrawCooldown formatedAmount={true} />
            <Web3Status />
            <Notifications />
            <Web3Network />
            {/* <Menu /> */}
          </Items>
        </Wrapper>
        <div>
          {showTopBanner && (
            <InfoHeader
              onClose={setShowBanner}
              hasInfoIcon={true}
              text={bannerText}
            />
          )}
          {hasInjected && (
            <Warning
              message={`❌ You are in "READ-ONLY" mode. Please do not confirm any transactions! ❌ `}
            />
          )}
        </div>
      </>
    );
  }

  const isMobile = useIsMobile();
  return isMobile ? getMobileContent() : getDefaultContent();
}
