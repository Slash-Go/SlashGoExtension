import App from "src/components/App.svelte";
import type { IStorage } from "src/types";
import {
  accessToken as accessTokenS,
  refreshToken as refreshTokenS,
  role as roleS,
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
      role: "user",
      domain: "https://api.slashgo.link",
      orgHero: "go",
    } as IStorage,
    ({
      accessToken,
      refreshToken,
      lastVerifiedAt,
      role,
      domain,
      orgHero,
    }: IStorage) => {
      accessTokenS.set(accessToken);
      refreshTokenS.set(refreshToken);
      lastVerifiedAtS.set(lastVerifiedAt);
      roleS.set(role);
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
