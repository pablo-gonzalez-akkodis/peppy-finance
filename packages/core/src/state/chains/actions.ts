import { createAction } from "@reduxjs/toolkit";
import { ChainsState } from "./reducer";

export const setChains = createAction<ChainsState>("chains/setChains");
