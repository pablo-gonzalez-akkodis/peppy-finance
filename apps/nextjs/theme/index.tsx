import React, { useMemo } from "react";
import {
  createGlobalStyle,
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider,
} from "styled-components";

import { useIsDarkMode } from "@symmio-client/core/state/user/hooks";
import { Colors, Shadows } from "./styled";
import { useRouter } from "next/router";

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
  upToExtraLarge: 1600,
};

export enum Z_INDEX {
  deprecated_zero = 0,
  deprecated_content = 1,
  dropdown = 1000,
  sticky = 1020,
  fixed = 1030,
  modalBackdrop = 1040,
  offcanvas = 1050,
  modal = 1060,
  popover = 1070,
  tooltip = 1080,
}

const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css;
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  (accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `;
  return accumulator;
}, {}) as any;

const white = "#FFFFFF";
const black = "#000000";

export enum SupportedThemes {
  LIGHT = "light",
  DARK = "dark",
}

function colors(): Colors {
  // define color scheme for each supported theme
  const themeColors = {
    [SupportedThemes.DARK]: {
      themeName: SupportedThemes.DARK,

      // base
      white,
      black,

      // text
      text0: "#F1F1F1",
      text1: "#A0A2B2",
      text2: "#8B8E9F",
      text3: "#8B8E9F",
      text4: "#5F606F",
      text5: "#333344",

      // these colors aren't for monolith
      text6: "#dce7eb",

      // backgrounds / greys
      bg: "#01030B",
      bg0: "#141823",
      bg1: "#191D29",
      bg2: "#1A1E2D",
      bg3: "#202432",
      bg4: "#242836",
      bg5: "#292C3B",
      bg6: "#323847",
      bg7: "#383C4B",
      bg8: "#323847",

      bgWin: "#20302F",
      bgLoose: "#35232B",
      bgWarning: "#473F2A",

      // borders
      border1: "#3F434C",
      border2: "#303540",
      border3: "#2A2E39",

      //gradient colors
      gradDark:
        "linear-gradient(91.6deg, #180951 0.09%, #110963 77.29%, #050621 100%)",
      gradLight:
        "linear-gradient(90deg, #E5EFF3 0%, #A2D4EA 50%, #E5EFF3 100%)",
      hoverGrad: "linear-gradient(90deg, #A6CCDC 0%, #C0E9FA 100%)",
      hoverShort: "linear-gradient(90deg, #EF9F9F 0%, #F4DFDF 100%)",
      hoverLong: "linear-gradient(90deg, #B7FEB6 0%, #E2F4DF 100%)",
      primaryBlackNew: "#121419",
      primaryDisable: "#496C7B",
      primaryDarkBg: "#35474F",
      primaryBlue: "#AEE3FA",
      primaryDark: "#5E95AC",
      primaryDarkOld: "#141517",

      // primary colors
      primary0: "#565CF3",
      primary1: "rgba(217, 217, 217, 0.1)",
      primary2: "#231E61",
      primary3: "#14103D",

      // these colors aren't for monolith
      primary4: "linear-gradient(92.33deg, #DE4A7B -10.26%, #E29D52 80%)",
      primary5: "linear-gradient(270deg, #01AEF3 -1.33%, #14E8E3 100%)",
      primary6: "linear-gradient(-90deg, #B63562 10%, #CF8D49 90%)",
      primary7: "linear-gradient(90deg, #ff538f 10%, #ffb56c 90%)",
      primary8: "linear-gradient(90deg, #F78C2A 0%, #F34038 100%)",

      // other
      red1: "#EA5E5E",
      green1: "#7DD485",
      green2: "#304349",
      green3: "#6ff37b",
      green4: "#97d136",

      error: "#FD4040",
      success: "#27AE60",
      warning: "#DCAB2E",
      twitter: "#69a1f5",

      usdt: "#50AF95",

      //these colors aren't for monolith
      black2: "#151A1F",
      secondary1: "#1749FA",
      secondary2: "rgba(23, 73, 250, 0.2)",
      primaryText1: "#1749FA",
      red2: "#F82D3A",
      red3: "#D60000",
      red5: "#442B37",
      red6: "#271515",
      yellow1: "#E3A507",
      yellow2: "#FF8F00",
      yellow3: "#F3B71E",
      yellow4: "#FFBA93",
      blue1: "#2172E5",
      blue2: "#74c2e3",
      darkPink: "#de4a7b",
      orange: "#E59C46",
      darkOrange: "#391D12",
    },
  };
  // default the theme to light mode
  return themeColors[SupportedThemes.DARK];
}

// define shadow scheme for each supported theme
function shadows(themeName: SupportedThemes): Shadows {
  const themeShadows = {
    [SupportedThemes.LIGHT]: {
      shadow1: "#2F80ED",
      boxShadow1: "0px 0px 4px rgba(0, 0, 0, 0.125)",
      boxShadow2: "0px 5px 5px rgba(0, 0, 0, 0.15)",
    },
    [SupportedThemes.DARK]: {
      shadow1: "#000",
      boxShadow1: "0px 0px 4px rgba(0, 0, 0, 0.125)",
      boxShadow2: "0px 5px 5px rgba(0, 0, 0, 0.15)",
    },
  };
  // default the theme to light mode
  return themeName in SupportedThemes
    ? themeShadows[SupportedThemes.LIGHT]
    : themeShadows[themeName];
}

function theme(themeName: SupportedThemes): DefaultTheme {
  return {
    ...colors(),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    ...shadows(themeName),

    // media queries
    mediaWidth: mediaWidthTemplates,
  };
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // get theme name from url if any
  const router = useRouter();
  const parsed = router.query?.theme;
  const parsedTheme = parsed && typeof parsed === "string" ? parsed : undefined;

  const darkMode = useIsDarkMode();

  let themeName: SupportedThemes;
  if (
    parsedTheme &&
    Object.values(SupportedThemes).some(
      (theme: string) => theme === parsedTheme
    )
  ) {
    themeName = parsedTheme as SupportedThemes;
  } else {
    themeName = darkMode ? SupportedThemes.DARK : SupportedThemes.LIGHT;
  }

  const themeObject = useMemo(() => theme(themeName), [themeName]);

  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {children}
    </StyledComponentsThemeProvider>
  );
}

export const ThemedGlobalStyle = createGlobalStyle`
  html {
    color: ${({ theme }) => theme.text0};
    background-color: ${({ theme }) => theme.bg6};
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  a {
    color: ${({ theme }) => theme.text0}; 
  }

  * {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Spline Sans', monospace;
    font-size: 16px;
    font-weight:500;
  }

  button {
    all: unset;
    cursor: pointer;
    padding: 0px;
  }

  *, *:before, *:after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }

  * {
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
    // overflow-y: hidden;
  }
  *::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  /* Firefox */
  input[type=number] {
    font-family: 'Spline Sans';
    -moz-appearance: textfield;
  }
`;
