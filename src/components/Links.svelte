<script lang="ts">
  import Delete from "./icons/Delete.svelte";
  import LockSolid from "./icons/LockSolid.svelte";
  import { orgHero, currentLinkEdit } from "../stores/context";
  import { onMount } from "svelte";
  import Loader from "./Loader.svelte";
  import Edit from "./icons/Edit.svelte";
  import EditLinks from "./EditLinks.svelte";

  let searchTermInput: HTMLInputElement;
  let searchTerm: string = "";

  let links = [];
  $: filteredLinks = links.filter((item) => {
    if (searchTerm === "") return true;
    const searchQuery = searchTerm.toLowerCase();
    return (
      item.shortLink.toLowerCase().includes(searchQuery) ||
      item.fullUrl.toLowerCase().includes(searchQuery) ||
      item.type.toLowerCase().includes(searchQuery)
    );
  });

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
    } else if (msg.type === "update_link_response") {
      if (msg.status === "success") {
        successMessage = "Updated!";
        $currentLinkEdit = "";
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
      requestAnimationFrame(() => {
        if (searchTermInput) searchTermInput.focus();
      });
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
    <div class="flex justify-center">
      <input
        bind:this={searchTermInput}
        bind:value={searchTerm}
        type="text"
        class="text-xs text-slate-600 w-2/3 text-center pt-2 pb-2 border border-slate-300 rounded-md outline-slate-300 "
        placeholder="search shortlinks"
      />
    </div>
    <table class="table-auto w-full">
      <tbody class="text-sm divide-y divide-gray-100">
        {#if filteredLinks.length === 0}
          <div class="text-center text-xs italic py-3.5">
            No Shortlinks found!
          </div>
        {:else}
          {#each filteredLinks as link}
            {#if $currentLinkEdit != link.id}
              <tr>
                <td class="p-2">
                  <div class="font-bold text-gray-800 text-lg text-ellipsis">
                    {$orgHero}/{#if link.private}my/{/if}{link.shortLink}
                  </div>
                  <div class="flex flex-wrap ">
                    <div class="flex w-full">
                      <div
                        class="w-100 pt-2 pb-1 text-gray-400 text-left overflow-hidden truncate text-xs"
                      >
                        {link.description}
                      </div>
                    </div>
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
                      class="p-2"
                      on:click={() => {
                        console.log("edit");
                        $currentLinkEdit = link.id;
                        //updateLink(link.id);
                      }}
                    >
                      <Edit />
                    </button>
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
            {:else}
              <EditLinks {link} />
            {/if}
          {/each}
        {/if}
      </tbody>
    </table>
  {/if}
</div>
