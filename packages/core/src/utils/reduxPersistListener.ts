import { getStoredState, REHYDRATE } from "redux-persist";

export default function crossBrowserListener(store: any, persistConfig: any) {
  return async function () {
    const state = await getStoredState(persistConfig);

    store.dispatch({
      type: REHYDRATE,
      key: persistConfig.key,
      payload: state,
    });
  };
}
