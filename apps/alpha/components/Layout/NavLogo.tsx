import React from "react";
import styled from "styled-components";
import Image from "next/legacy/image";

import SYMMETRIAL_ICON from "/public/static/images/header/SymmetrialX.svg";

import { useIsMobile } from "lib/hooks/useWindowSize";

import { ExternalLink } from "components/Link";
import { RowCenter } from "components/Row";
import { APP_URL } from "constants/chains/misc";
import { NavBarLogo } from "components/Icons";

const Wrapper = styled(RowCenter)`
  width: fit-content;
  align-items: flex-end;

  &:hover {
    cursor: pointer;
  }

  & > div {
    &:first-child {
      margin-right: 10px;
    }
  }
`;

const SymmetrialText = styled.div`
  gap: 4px;
  font-size: 47px;
  font-weight: 700;
  margin: 0px 4px 4px 4px;
  background: linear-gradient(180deg, #c7f199 0%, #5cdcf0 100%);
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: ${({ theme }) => theme.text0};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 10px;
  `};
`;

export default function NavLogo() {
  const mobileVersion = useIsMobile();
  return (
    <div>
      <Wrapper>
        <ExternalLink href={APP_URL} target="_self" passHref>
          <NavBarLogo
            width={mobileVersion ? 40 : 58}
            height={mobileVersion ? 40 : 58}
          />
        </ExternalLink>
        {!mobileVersion &&
          <ExternalLink href="">
            <SymmetrialText className="space-grotesk">
              PEPPY FINANCE{" "}
            </SymmetrialText>
          </ExternalLink>
        }
      </Wrapper>
    </div>
  );
}
