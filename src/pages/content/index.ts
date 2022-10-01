import type { IStorage } from "src/types";

chrome.storage.sync.get(
  { accessToken: "" } as IStorage,
  ({ accessToken }: IStorage) => {
    console.log("content", accessToken);
  }
);
