import App, { AppContext, AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import { CookieStorage } from "aws-amplify/utils";
import { runWithAmplifyServerContext } from "aws-amplify/adapter-core";
import { fetchAuthSession } from "aws-amplify/auth/server";

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
        userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
        region: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION!,
      },
      storage: new CookieStorage({
        domain: process.env.NEXT_PUBLIC_AWS_COGNITO_COOKIE_DOMAIN,
        path: "/",
        expires: 365,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      }),
    },
  },
  { ssr: true }
);

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const tokens = await runWithAmplifyServerContext(
    Amplify.getConfig(),
    Amplify.libraryOptions,
    async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens ?? null;
      } catch {
        return null;
      }
    }
  );

  return {
    ...appProps,
    pageProps: { ...appProps.pageProps, tokens },
  };
};

export default MyApp;
