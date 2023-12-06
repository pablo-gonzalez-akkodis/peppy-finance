import * as toolkitRaw from "@reduxjs/toolkit";
const { createAction } = ((toolkitRaw as any).default ??
  toolkitRaw) as typeof toolkitRaw;
import { ChainsState } from "./reducer";

export const setChains = createAction<ChainsState>("chains/setChains");
