<script lang="ts">
  import toast, { Toaster } from "svelte-french-toast";

  import Delete from "./icons/Delete.svelte";
  import LockSolid from "./icons/LockSolid.svelte";
  import { orgHero } from "../stores/context";
  import { onMount } from "svelte";
  import Loader from "./Loader.svelte";
  let links = [];

  let isLoading: boolean = false;
  let deletingLink = [];

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "delete_link_response") {
      deletingLink = deletingLink.filter((id) => id !== msg.id);
      deletingLink = [...deletingLink];
      if (msg.status === "success") {
        getLinks();
      } else {
        toast.error(msg.message);
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

<Toaster />
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
                {#if deletingLink.includes(link.id)}
                  <Loader />
                {:else}
                  <button
                    on:click={(e) => {
                      deletingLink.push(link.id);
                      deletingLink = [...deletingLink];
                      deleteLink(link.id);
                    }}
                  >
                    <Delete />
                  </button>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
