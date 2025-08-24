"use client";

import StoreProvider from "@/state/redux";
import { Authenticator } from "@aws-amplify/ui-react";
import { ThemeProvider } from "next-themes";
import Auth from "./(auth)/authProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Authenticator.Provider>
          <Auth>{children}</Auth>
        </Authenticator.Provider>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default Providers;
