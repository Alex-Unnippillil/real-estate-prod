import {
  AnyAction,
  PreloadedState,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import globalReducer from "@/state";
import { api } from "@/state/api";

const combinedReducer = combineReducers({
  global: globalReducer,
  [api.reducerPath]: api.reducer,
});

const rootReducer = (
  state: ReturnType<typeof combinedReducer> | undefined,
  action: AnyAction
) => {
  if (action.type === "HYDRATE") {
    return { ...state, ...action.payload };
  }
  return combinedReducer(state, action);
};

export const makeStore = (
  preloadedState?: PreloadedState<ReturnType<typeof combinedReducer>>
) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof combinedReducer>;
export type AppDispatch = AppStore["dispatch"];
