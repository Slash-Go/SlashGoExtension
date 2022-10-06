<script lang="ts">
  import { accessToken, refreshToken, role, orgHero } from "../stores/context";
  import Links from "./Links.svelte";
  import Settings from "./Settings.svelte";
  import Users from "./Users.svelte";

  const logout = () => {
    chrome.storage.sync.clear(() => {
      $accessToken = "";
      $refreshToken = "";
      chrome.runtime.sendMessage({ command: "logout" });
    });
  };

  let choice = "links";
</script>

<svelte:head>
  <link rel="stylesheet" href="../../../css/index.css" />
</svelte:head>

<div>
  <section class="antialiased bg-gray-100 text-gray-600 h-screen px-4">
    <div class="flex flex-col justify-center h-full">
      <div
        class="w-full max-w-xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200"
      >
        <header class="px-5 py-4 border-b border-gray-100">
          <div class="flex font-semibold text-gray-800">
            <div
              class={choice === "links"
                ? "text-red-500 underline underline-offset-4 pr-4"
                : "hover:text-red-600 hover:cursor-pointer pr-4"}
              on:click={() => (choice = `links`)}
            >
              Configured Shortlinks
            </div>
            {#if $role === "admin" || $role === "global_admin"}
              <div
                class={choice === "users"
                  ? "text-red-600 underline underline-offset-4 pr-4"
                  : "hover:text-red-600 hover:cursor-pointer pr-4"}
                on:click={() => (choice = `users`)}
              >
                Manage Users
              </div>
              <div
                class={choice === "settings"
                  ? "text-red-600 underline underline-offset-4 pr-4"
                  : "hover:text-red-600 hover:cursor-pointer pr-4"}
                on:click={() => (choice = `settings`)}
              >
                Org Settings
              </div>
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
    </div>
    <a
      class="p-4 right-0 text-gray-600 hover:text-gray-800 hover:underline font-bold mt-4 fixed bottom-0 text-xs"
      on:click={() => logout()}
      href="#logout">Sign Out</a
    >
  </section>
</div>
