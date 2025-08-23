"use client";

import { useRef } from "react";
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import type { PreloadedState } from "@reduxjs/toolkit";
import {
  makeStore,
  AppStore,
  AppDispatch,
  RootState,
} from "@/state/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function StoreProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: PreloadedState<RootState>;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore(initialState);
    setupListeners(storeRef.current.dispatch);
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}

export type { RootState } from "@/state/store";
