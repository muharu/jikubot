import "~/styles/globals.css";

import type { AppType } from "next/app";

import TrpcContextProvider from "~/context/trpc-context-provider";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <TrpcContextProvider>
      <Component {...pageProps} />
    </TrpcContextProvider>
  );
};

export default App;
