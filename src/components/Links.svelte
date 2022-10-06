<script lang="ts">
  import Delete from "./icons/Delete.svelte";
  import LockSolid from "./icons/LockSolid.svelte";
  import { orgHero } from "../stores/context";
  import { onMount } from "svelte";
  import Loader from "./Loader.svelte";
  let links = [];

  let successMessage: string = null,
    errorMessage: string = null,
    isLoading: boolean = false;

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "delete_link_response") {
      if (msg.status === "success") {
        successMessage = "Deleted!";
        setTimeout(() => {
          successMessage = "";
        }, 2000);
        getLinks();
      } else {
        errorMessage = `Error: ${msg.message}`;
        setTimeout(() => {
          errorMessage = "";
        }, 2000);
      }
    } else if (msg.type === "run_sync_response") {
      links = msg.data;
      isLoading = false;
    }
  });

  const deleteLink = (id: string) => {
    chrome.runtime.sendMessage({ command: "delete_link", data: { id } });
  };

  const getLinks = () => {
    chrome.runtime.sendMessage({ command: "run_sync" });
  };

  onMount(async () => {
    getLinks();
    isLoading = true;
  });
</script>

{#if successMessage}<div class="p-2 text-center text-green-500 font-bold">
    {successMessage}
  </div>{/if}
{#if errorMessage}<div class="p-2 text-center text-red-500 font-bold">
    {errorMessage}
  </div>{/if}
<div class="overflow-x-auto p-3">
  {#if isLoading}
    <Loader />
  {:else if links.length === 0}<div class="text-center">
      No Shortlinks created yet!
    </div>
  {:else if links.length > 0}
    <table class="table-auto w-full">
      <tbody class="text-sm divide-y divide-gray-100">
        {#each links as link}
          <tr>
            <td class="p-2">
              <div class="font-bold text-gray-800 text-lg text-ellipsis">
                {$orgHero}/{#if link.private}my/{/if}{link.shortLink}
              </div>
              <div class="flex">
                <div class="text-right text-xs ">{link.type} |&nbsp;</div>
                <div
                  class="text-left text-xs text-red-400 overflow-hidden truncate w-60"
                >
                  {link.fullUrl}
                </div>
              </div>
            </td>
            <td class="p-2">
              {#if link.private}
                <LockSolid size="20px" />
              {/if}
            </td>
            <td class="p-2">
              <div class="flex justify-center">
                <button
                  on:click={(e) => {
                    successMessage = null;
                    errorMessage = null;
                    deleteLink(link.id);
                  }}
                >
                  <Delete />
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
