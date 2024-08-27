import "~/styles/globals.css";

import type { AppType } from "next/app";

import { Toaster } from "~/hooks/toaster";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
};

export default api.withTRPC(MyApp);
