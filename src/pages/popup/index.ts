import App from "src/components/App.svelte";
import type { IStorage } from "src/types";
import {
  accessToken as accessTokenS,
  refreshToken as refreshTokenS,
  domain as domainS,
  orgHero as orgHeroS,
  lastVerifiedAt as lastVerifiedAtS,
} from "../../stores/context";

function loadApp() {
  chrome.storage.sync.get(
    {
      accessToken: "",
      refreshToken: "",
      lastVerifiedAt: null,
      domain: "https://api.slashgo.link",
      orgHero: "go",
    } as IStorage,
    ({
      accessToken,
      refreshToken,
      lastVerifiedAt,
      domain,
      orgHero,
    }: IStorage) => {
      accessTokenS.set(accessToken);
      refreshTokenS.set(refreshToken);
      lastVerifiedAtS.set(lastVerifiedAt);
      domainS.set(domain);
      orgHeroS.set(orgHero);

      const app = new App({
        target: document.body,
        props: { mode: "popup" },
      });
    }
  );
}

document.addEventListener("DOMContentLoaded", loadApp);
