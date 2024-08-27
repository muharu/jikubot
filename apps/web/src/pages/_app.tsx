import "~/styles/globals.css";

import type { AppType } from "next/app";

import { AutoSaveProvider } from "~/context/autosave-context";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <AutoSaveProvider>
      <Component {...pageProps} />
    </AutoSaveProvider>
  );
};

export default api.withTRPC(MyApp);
