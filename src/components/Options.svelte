<script lang="ts">
  import { accessToken, refreshToken, role, orgHero } from "../stores/context";
  import type { choices } from "../types";
  import Links from "./Links.svelte";
  import LinkHeader from "./micro/LinkHeader.svelte";
  import Settings from "./Settings.svelte";
  import Users from "./Users.svelte";

  const logout = () => {
    chrome.storage.sync.clear(() => {
      $accessToken = "";
      $refreshToken = "";
      chrome.runtime.sendMessage({ command: "logout" });
    });
  };

  let choice: choices = "links";

  const updateChoice = (val: choices) => {
    choice = val;
  };
</script>

<svelte:head>
  <link rel="stylesheet" href="../../../css/index.css" />
</svelte:head>

<div>
  <section class="antialiased bg-gray-100 text-gray-600 h-screen px-4">
    <div class="pt-32">
      <div
        class="w-full max-w-xl mx-auto bg-white rounded-sm border border-gray-200"
      >
        <header class="border-b border-gray-100">
          <div class="flex items-center font-semibold text-gray-800">
            <LinkHeader
              value="links"
              label="Shortlinks"
              {choice}
              {updateChoice}
            />
            {#if $role === "admin" || $role === "global_admin"}
              <LinkHeader
                value="users"
                label="Manage Users"
                {choice}
                {updateChoice}
              />

              <LinkHeader
                value="settings"
                label="Org Settings"
                {choice}
                {updateChoice}
              />
            {/if}
          </div>
        </header>
        {#if choice === `links`}
          <Links />
        {:else if choice === `users`}
          <Users />
        {:else if choice === `settings`}
          <Settings />
        {/if}
      </div>
      <div
        class="text-center p-2 text-red-300 hover:text-red-500 font-bold text-xs"
      >
        <a on:click={() => logout()} href="#logout">Logout</a>
      </div>
    </div>
  </section>
</div>
