"use client";

import StoreProvider from "@client/state/redux";
import { Authenticator } from "@aws-amplify/ui-react";
import Auth from "@client/app/(auth)/authProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <Authenticator.Provider>
        <Auth>{children}</Auth>
      </Authenticator.Provider>
    </StoreProvider>
  );
};

export default Providers;
