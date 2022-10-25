<script lang="ts">
  import axios, { AxiosError, type AxiosResponse } from "axios";
  import type { IStorage } from "src/types";
  import { GOOGLE_CLIENT_ID } from "src/config";
  import {
    accessToken,
    refreshToken,
    lastVerifiedAt,
    role,
    domain,
    orgHero,
  } from "../stores/context";

  let email: string = "",
    password: string = "",
    errorMessage: string = "",
    successMessage: string = "",
    moreOptions: boolean = false,
    resetPasswordMode: boolean = false;

  let isLoggingIn: boolean = false,
    isResettingPassword: boolean = false;

  const save = async () => {
    const storage: IStorage = {
      accessToken: $accessToken,
      refreshToken: $refreshToken,
      lastVerifiedAt: $lastVerifiedAt,
      domain: $domain,
      role: $role,
      orgHero: $orgHero,
    };

    chrome.storage.sync.set(storage, () => {
      console.log("Updated Storage");
      startSync();
    });
  };

  const startSync = async () => {
    chrome.runtime.sendMessage({ command: "start_sync" });
  };

  const validate = (redirectURL: string) => {
    if (redirectURL == null) {
      console.log("Login was unsuccessful!");
      errorMessage = `Login was unsuccessful`;
      return;
    }
    const redirectURLSplit = redirectURL.split("#id_token=");
    if (redirectURLSplit.length < 2) {
      console.log("Login didn't return id token or was unsuccessful!");
      errorMessage = `Login was unsuccessful`;
      return;
    }

    let token = redirectURLSplit[1].split("&")[0];
    axios
      .post(`${$domain}/auth/login_google`, {
        token,
      })
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          $accessToken = response.data.accessToken;
          $refreshToken = response.data.refreshToken;
          $role = response.data.role;
          $orgHero = response.data.orgHero;
          $lastVerifiedAt = new Date().toISOString();
          errorMessage = "";
          save();
        }
      })
      .catch((e: AxiosError) => {
        console.log("Could not log in user");
        if (e.response!.status == 401) {
          errorMessage = e.response.data["error"] as string;
        } else {
          errorMessage = `Unable to log user in`;
        }
      })
      .finally(() => {
        isLoggingIn = false;
      });
  };

  const authenticate = () => {
    isLoggingIn = true;
    const redirectURL = chrome.identity.getRedirectURL();
    const clientID = GOOGLE_CLIENT_ID;
    const nonce = new Date().toISOString();
    const scopes = ["openid", "email", "profile"];
    let authURL = "https://accounts.google.com/o/oauth2/v2/auth";
    authURL += `?client_id=${clientID}`;
    authURL += `&response_type=id_token`;
    authURL += `&access_type=offline`;
    authURL += `&nonce=${nonce}`;
    authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
    authURL += `&scope=${encodeURIComponent(scopes.join(" "))}`;

    return chrome.identity.launchWebAuthFlow(
      {
        interactive: true,
        url: authURL,
      },
      validate
    );
  };

  $: submit = async () => {
    if (!resetPasswordMode) {
      isLoggingIn = true;
      axios
        .post(`${$domain}/auth/login`, {
          email,
          password,
        })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            $accessToken = response.data.accessToken;
            $refreshToken = response.data.refreshToken;
            $role = response.data.role;
            $orgHero = response.data.orgHero;
            $lastVerifiedAt = new Date().toISOString();
            errorMessage = "";
            save();
          }
        })
        .catch((e: AxiosError) => {
          console.log("Could not log in user");
          if (e.response!.status == 401) {
            errorMessage = e.response.data["error"] as string;
          } else {
            errorMessage = `Unable to log user in`;
          }
        })
        .finally(() => {
          isLoggingIn = false;
        });
    } else {
      isResettingPassword = true;
      axios
        .post(`${$domain}/auth/reset_password_request`, {
          email,
        })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            successMessage = response.data.message;
          }
        })
        .catch((e: AxiosError) => {
          console.log("Could not reset password for user");
          if (e.response!.status == 400) {
            errorMessage = e.response.data["error"] as string;
          } else {
            errorMessage = `Unable to reset password for user`;
          }
        })
        .finally(() => {
          isResettingPassword = false;
        });
    }
  };
</script>

<div class="flex md:h-screen">
  <div class="m-auto bg-slate-100">
    <div
      class="flex justify-center text-center text-xl bg-slate-200 p-1 border-b-2 border-slate-400"
    >
      <img alt="header" width="60px" src="../../../images/slashgo_header.png" />
    </div>

    {#if errorMessage}
      <div class="p-2 text-center text-red-600 font-bold">{errorMessage}</div>
    {/if}
    {#if successMessage}
      <div class="p-2 text-center text-green-600 font-bold">
        {successMessage}
      </div>
    {/if}

    <div class="p-2">
      <form class="text-center" on:submit|preventDefault={submit}>
        <input
          bind:value={email}
          on:focus={() => {
            errorMessage = "";
            successMessage = "";
          }}
          type="email"
          class="m-1 p-2 border border-slate-300 rounded-md text-center"
          placeholder="username@domain.com"
          required
        />
        {#if !resetPasswordMode}
          <input
            bind:value={password}
            on:focus={() => {
              errorMessage = "";
              successMessage = "";
            }}
            type="password"
            class="m-1 p-2 border border-slate-300 rounded-md text-center"
            placeholder="password"
            required
          />
        {/if}

        <div
          class="select-none pt-2 pl-2 text-xs hover:text-gray-600 hover:cursor-pointer text-left font-bold text-gray-400"
          on:click={(_) => (moreOptions = !moreOptions)}
        >
          (+)
        </div>
        {#if moreOptions}
          <input
            bind:value={$domain}
            type="string"
            class="m-1 p-2 border border-slate-300 rounded-md text-center"
            placeholder="SlashGo domain"
            required
          />
        {/if}

        {#if !resetPasswordMode}
          <button
            disabled={isLoggingIn}
            class="disabled:opacity-50 mt-2 mb-2 bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded select-none hover:cursor-pointer"
            type="submit">{isLoggingIn ? "Signing in..." : "Sign In"}</button
          >

          <div
            on:click={authenticate}
            class="underline text-center hover:cursor-pointer"
          >
            Sign in with Google
          </div>
          <div
            on:click={() => {
              resetPasswordMode = true;
            }}
            class="underline text-center hover:cursor-pointer"
          >
            Forgot Password?
          </div>
        {:else}
          <button
            disabled={isResettingPassword}
            class="disabled:opacity-50 mt-2 mb-2 bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded hover:cursor-pointer select-none"
            type="submit"
            >{isResettingPassword
              ? "Requesting ..."
              : "Request Password Reset"}</button
          >
          <div
            on:click={() => {
              resetPasswordMode = false;
            }}
            class="underline text-center hover:cursor-pointer"
          >
            Go Back?
          </div>
        {/if}
      </form>
    </div>
  </div>
</div>
