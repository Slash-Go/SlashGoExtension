import App from "src/components/App.svelte";
import type { IStorage } from "src/types";
import {
  accessToken as accessTokenS,
  refreshToken as refreshTokenS,
  lastVerifiedAt as lastVerifiedAtS,
} from "../../stores/context";

function loadApp() {
  chrome.storage.sync.get(
    {
      accessToken: "",
      refreshToken: "",
      lastVerifiedAt: null,
      domain: "https://slashgo-server.fly.dev",
    } as IStorage,
    ({ accessToken, refreshToken, lastVerifiedAt, domain }: IStorage) => {
      accessTokenS.set(accessToken);
      refreshTokenS.set(refreshToken);
      lastVerifiedAtS.set(lastVerifiedAt);

      const app = new App({
        target: document.body,
        props: { mode: "options" },
      });
    }
  );
}

document.addEventListener("DOMContentLoaded", loadApp);
