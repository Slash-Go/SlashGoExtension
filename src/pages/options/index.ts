import App from "src/components/App.svelte";
import type { IStorage } from "src/types";
import {
  accessToken as accessTokenS,
  refreshToken as refreshTokenS,
  lastVerifiedAt as lastVerifiedAtS,
  role as roleS,
  orgHero as orgHeroS,
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
      roleS.set(role);
      orgHeroS.set(orgHero);
      lastVerifiedAtS.set(lastVerifiedAt);

      const app = new App({
        target: document.body,
        props: { mode: "options" },
      });
    }
  );
}

document.addEventListener("DOMContentLoaded", loadApp);
