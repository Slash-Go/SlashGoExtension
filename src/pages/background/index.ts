import type { IStorage } from "src/types";
import axios, { AxiosError, type AxiosResponse } from "axios";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";
import {
  defaultQueryInterceptProcessor,
  dynamicProcessor,
  searchEngineQueryInterceptProcessor,
  staticProcessor,
} from "./processors";

let accessTokenGlobal = "",
  domainGlobal = "",
  refreshTokenGlobal = "",
  roleGlobal = "user",
  orgHeroGlobal = "go";

chrome.runtime.onInstalled.addListener(() => {
  stopSync().then(() => startSync());
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.command == "start_sync") {
    stopSync().then(() => startSync());
  } else if (message.command == "run_sync") {
    runSyncCycle();
  } else if (message.command == "get_users") {
    getUsers();
  } else if (message.command == "logout") {
    stopSync();
    sendLogoutMessage();
  } else if (message.command == "create_link") {
    createLink(
      message.data.shortLink,
      message.data.url,
      message.data.selectedType,
      message.data.isPrivate
    );
  } else if (message.command == "delete_link") {
    deleteLink(message.data.id);
  }
});

chrome.runtime.onStartup.addListener(() => {
  stopSync().then(() => startSync());
});

chrome.alarms.onAlarm.addListener(() => {
  console.log("Running Periodic Sync...");
  runSyncCycle();
});

chrome.omnibox.onInputEntered.addListener((text) => {
  // TODO: Build out omnibox searches
});

const stopSync = async () => {
  console.log("Stopping Background Sync!");
  chrome.alarms.clear("periodic-sync");
};

const sendLogoutMessage = async () => {
  chrome.runtime.sendMessage({ type: "logout" }).catch(() => {
    console.log("Logout message ignored");
  });
};

const startSync = async () => {
  chrome.storage.sync.get(
    {
      accessToken: "",
      refreshToken: "",
      role: "user",
      domain: "",
      orgHero: "go",
    } as IStorage,
    ({ accessToken, refreshToken, role, domain, orgHero }: IStorage) => {
      accessTokenGlobal = accessToken;
      domainGlobal = domain;
      refreshTokenGlobal = refreshToken;
      roleGlobal = role;
      orgHeroGlobal = orgHero;
      if (domain != "" && accessToken != "") {
        chrome.alarms.create("periodic-sync", { periodInMinutes: 1 });
        runSyncCycle();
      } else {
        console.log("SlashGo Sync *NOT* started!");
      }
    }
  );
};

const createLink = async (
  shortLink: string,
  url: string,
  selectedType: string,
  isPrivate: boolean,
  refreshed: boolean = false
) => {
  axios
    .post(
      `${domainGlobal}/link`,
      {
        shortLink: shortLink,
        fullUrl: url,
        type: selectedType,
        private: isPrivate,
      },
      {
        headers: { Authorization: `Bearer ${accessTokenGlobal}` },
        adapter: fetchAdapter,
      }
    )
    .then((response) => {
      if (response.status === 200) {
        chrome.runtime.sendMessage({
          type: "create_link_response",
          status: "success",
        });
        runSyncCycle();
      }
    })
    .catch((e: AxiosError) => {
      if (e.response.status == 400) {
        chrome.runtime.sendMessage({
          type: "create_link_response",
          status: "error",
          message: e.response.data["error"] as string,
        });
        console.log("Could not create link", e);
      } else if (!refreshed && e.response.status == 401) {
        refreshToken().then(() => {
          createLink(shortLink, url, selectedType, isPrivate, true);
        });
      } else {
        save("", "", new Date(), "user", domainGlobal, orgHeroGlobal);
      }
    });
};

const deleteLink = async (id: string, refreshed: boolean = false) => {
  console.log(`Deleting shortLink with id=${id}`);
  axios
    .delete(`${domainGlobal}/link/${id}`, {
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${accessTokenGlobal}`,
      },
      adapter: fetchAdapter,
    })
    .then(() => {
      chrome.runtime.sendMessage({
        type: "delete_link_response",
        status: "success",
      });
    })
    .catch((e: AxiosError) => {
      if (e.response.status == 400) {
        chrome.runtime.sendMessage({
          type: "delete_link_response",
          status: "error",
          message: e.response.data["error"] as string,
        });
        console.log("Could not delete link");
      } else if (!refreshed && e.response.status == 401) {
        refreshToken().then(() => {
          deleteLink(id, true);
        });
      } else {
        save("", "", new Date(), "user", domainGlobal, orgHeroGlobal);
      }
    });
};

const runSyncCycle = (refreshed: boolean = false) => {
  axios
    .get(`${domainGlobal}/link`, {
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${accessTokenGlobal}`,
      },
      adapter: fetchAdapter,
    })
    .then((resp) => {
      let links = resp.data;
      console.log(`Found ${links.length} link/s to process`);
      updateRules(links);
      chrome.runtime
        .sendMessage({ type: "run_sync_response", data: resp.data })
        .catch(() => {
          console.log("Nothing to receive message");
        });
    })
    .catch((e: AxiosError) => {
      console.log(e);
      if (!refreshed && e.response.status == 401) {
        refreshToken().then(() => {
          runSyncCycle(true);
        });
      } else {
        save("", "", new Date(), "user", domainGlobal, orgHeroGlobal);
      }
    });
};

const getUsers = (refreshed: boolean = false) => {
  axios
    .get(`${domainGlobal}/user`, {
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${accessTokenGlobal}`,
      },
      adapter: fetchAdapter,
    })
    .then((resp) => {
      let users = resp.data;
      console.log(`Found ${users.length} user/s to process`);
      chrome.runtime
        .sendMessage({ type: "get_users_response", data: resp.data })
        .catch(() => {
          console.log("Nothing to receive message");
        });
    })
    .catch((e: AxiosError) => {
      console.log(e);
      if (!refreshed && e.response.status == 401) {
        refreshToken().then(() => {
          getUsers(true);
        });
      } else {
        save("", "", new Date(), "user", domainGlobal, orgHeroGlobal);
      }
    });
};

const updateRules = async (links: any) => {
  let deleteRules = [];
  chrome.declarativeNetRequest.getSessionRules((rules) => {
    rules
      .filter((rule) => rule.id >= 1337)
      .forEach((rule) => deleteRules.push(rule.id));
    createRules(links, deleteRules);
  });
};

const createRules = (links: any, deleteRules: number[]) => {
  console.log(`Before update, we had ${deleteRules.length} rules`);
  let rules = [];
  let count = 0;
  for (let i = 0; i < links.length; i++) {
    if (links[i].type === `default` || links[i].type === `static`) {
      rules.push(staticProcessor(orgHeroGlobal, links[i], 1337 + count));
      count += 1;
    } else if (links[i].type === `dynamic`) {
      rules.push(dynamicProcessor(orgHeroGlobal, links[i], 1337 + count));
      count += 1;
    }
  }

  chrome.declarativeNetRequest
    .updateSessionRules({
      removeRuleIds: deleteRules,
      addRules: rules,
    })
    .catch((e: any) => {
      console.log("Error updating session rules!");
    });

  addSearchEngineInterceptRules();
  addDefaultEngineInterceptRules();

  console.log(`After update, we have ${rules.length} rules`);
  // DEBUGGING
  chrome.declarativeNetRequest
    .getSessionRules()
    .then((data) => console.log(data));
};

const addSearchEngineInterceptRules = () => {
  // TODO: Add more search engine queries to intercept
  let searchEngineQueries = [
    `^https?:\/\/www.google.com\/search`,
    `^https?:\/\/duckduckgo.com\/`,
  ];
  let rules = [];
  let count = 0;
  for (let i = 0; i < searchEngineQueries.length; i++) {
    rules.push(
      searchEngineQueryInterceptProcessor(
        orgHeroGlobal,
        searchEngineQueries[i],
        1000 + count
      )
    );
    count += 1;
  }

  chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: Array.from({ length: count }).map((_, i) => i + 1000),
    addRules: rules,
  });
};

const addDefaultEngineInterceptRules = () => {
  let rules = [];
  rules.push(defaultQueryInterceptProcessor(orgHeroGlobal));

  chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [1000],
    addRules: rules,
  });
  console.log("Default rule added");
};

const refreshToken = async () => {
  try {
    let response: AxiosResponse = await axios.post(
      `${domainGlobal}/auth/refresh`,
      {
        refreshToken: refreshTokenGlobal,
      },
      { adapter: fetchAdapter }
    );

    if (response.status === 200) {
      console.log("Successfully refreshed token");
      save(
        response.data.accessToken,
        refreshTokenGlobal,
        new Date(),
        response.data.role,
        domainGlobal,
        response.data.orgHero
      );
    }

    return true;
  } catch (e: any) {
    console.log("Refreshing token unsuccessful");
    if (e.response.status == 401) {
      // Logout User
      save("", "", new Date(), "user", domainGlobal, orgHeroGlobal);
    }
  }
};

const save = (
  accessToken: string,
  refreshToken: string,
  lastVerifiedAt: Date,
  role: string,
  domain: string,
  orgHero: string
) => {
  const storage: IStorage = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    role: role,
    lastVerifiedAt: lastVerifiedAt.toISOString(),
    domain: domain,
    orgHero: orgHero,
  };
  accessTokenGlobal = accessToken;
  domainGlobal = domain;
  refreshTokenGlobal = refreshToken;
  roleGlobal = role;
  orgHeroGlobal = orgHero;

  chrome.storage.sync.set(storage, () => {
    if (accessToken === "") {
      console.log("User has been logged out!");
      chrome.runtime.sendMessage({ type: "logout" }).catch(() => {
        console.log("Logout message ignored");
      });
      stopSync();
    } else {
      console.log("Saved new values to store!");
    }
  });
};
