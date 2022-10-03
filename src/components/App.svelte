<script lang="ts">
  import { accessToken } from "../stores/context";
  import Login from "./Login.svelte";
  import Options from "./Options.svelte";
  import Popup from "./Popup.svelte";

  export let mode = `popup`;

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "logout") {
      $accessToken = "";
    }
  });
</script>

<svelte:head>
  <link rel="stylesheet" href="../../../css/index.css" />
</svelte:head>

<div class="w-full">
  {#if $accessToken.length != 0}
    {#if mode === `options`}
      <Options />
    {:else}
      <Popup />
    {/if}
  {:else}
    <Login />
  {/if}
</div>
