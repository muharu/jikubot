import "~/styles/globals.css";

import type { AppType } from "next/app";

import Providers from "./_providers";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
};

export default App;
