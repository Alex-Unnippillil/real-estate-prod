"use client";

import StoreProvider, { RootState } from "@/state/redux";
import { Authenticator } from "@aws-amplify/ui-react";
import Auth from "./(auth)/authProvider";
import { PreloadedState } from "@reduxjs/toolkit";

const Providers = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: PreloadedState<RootState>;
}) => {
  return (
    <StoreProvider initialState={initialState}>
      <Authenticator.Provider>
        <Auth>{children}</Auth>
      </Authenticator.Provider>
    </StoreProvider>
  );
};

export default Providers;
