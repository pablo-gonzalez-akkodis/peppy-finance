import { combineReducers } from "@reduxjs/toolkit";

import application from "./application/reducer";
import transactions from "./transactions/reducer";
import user from "./user/reducer";
import hedger from "./hedger/reducer";
import trade from "./trade/reducer";
import notifications from "./notifications/reducer";
import quotes from "./quotes/reducer";
import chains from "./chains/reducer";

const reducer = combineReducers({
  application,
  chains,
  transactions,
  user,
  hedger,
  trade,
  notifications,
  quotes,
});

export default reducer;
