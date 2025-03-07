import React from "react";
import styled from "styled-components";
import "@rainbow-me/rainbowkit/styles.css";

import { UNDER_MAINTENANCE } from "@symmio/frontend-sdk/constants/misc";

import NavBar from "./NavBar";
import { RowCenter } from "components/Row";
import { UnderMaintenance } from "components/Icons";
// import Footer from 'components/Disclaimer'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  position: relative;
  padding-bottom: 36px;
  flex-flow: column nowrap;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("/images/neonBg.png");
`;
const HeaderWrap = styled.div`
  width: 100%;
  margin-bottom: 16px;
  top: 0;
  z-index: 300;
  background: ${({ theme }) => theme.bgTransparent};
`;

const Content = styled.div`
  position: relative;
  height: 100%;
  min-height: calc(100vh - 60px);
  background: ${({ theme }) => theme.bgTransparent};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-height: calc(100vh - 60px);
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-bottom: 30px;
  `}
`;

const UnderMaintenanceWrap = styled(RowCenter)`
  height: 100%;
  z-index: 1000;
  position: absolute;
  background: rgba(18, 20, 25, 0.8);
  backdrop-filter: blur(6px);
`;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      {UNDER_MAINTENANCE && (
        <UnderMaintenanceWrap>
          <UnderMaintenance />
        </UnderMaintenanceWrap>
      )}
      <HeaderWrap>
        <NavBar />
      </HeaderWrap>
      <Content>{children}</Content>
      {/* <Footer /> */}
    </Wrapper>
  );
}
