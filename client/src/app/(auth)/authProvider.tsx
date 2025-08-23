"use client";

import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter, usePathname } from "next/navigation";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId:
        process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.match(
    /^\/(signin|signup|confirm-signup|reset-password)$/
  );
  const isDashboardPage =
    pathname.startsWith("/manager") || pathname.startsWith("/tenants");

  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");
    } else if (!user && isDashboardPage) {
      router.push("/signin");
    }
  }, [user, isAuthPage, isDashboardPage, router]);

  return <>{children}</>;
};

export default Auth;
