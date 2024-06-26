import React from "react";

export default function NavBarLogo({
  width = 198,
  height = 38,
  ...rest
}: {
  width?: number;
  height?: number;
  [x: string]: any;
}) {
  return (
    <>
    <img src="/images/peppyFinanceLogo.png" alt=""  width={width}
    height={height}/>
    </>
  );
}
