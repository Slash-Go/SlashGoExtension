<script lang="ts">
  import { onMount } from "svelte";
  import Edit from "./icons/Edit.svelte";
  import EyeSlash from "./icons/EyeSlash.svelte";
  import Loader from "./Loader.svelte";

  let users = [];

  let successMessage: string = null,
    errorMessage: string = null,
    isLoading: boolean = false;

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "update_user_response") {
      if (msg.status === "success") {
        successMessage = "Updated!";
        setTimeout(() => {
          successMessage = "";
        }, 2000);
        getUsers();
      } else {
        errorMessage = `Error: ${msg.message}`;
        setTimeout(() => {
          errorMessage = "";
        }, 2000);
      }
    } else if (msg.type === "get_users_response") {
      users = msg.data;
      isLoading= false;
    }
  });

  const getUsers = () => {
    chrome.runtime.sendMessage({ command: "get_users" });
  };

  onMount(async () => {
    getUsers();
    isLoading= true;
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
    <Loader/>  
  {:else}
    <table class="table-auto w-full">
      <tbody class="text-sm divide-y divide-gray-100">
        {#each users as user}
          <tr>
            <td class="p-2">
              <div class="font-bold text-gray-800 text-lg text-ellipsis flex">
                <div class="flex items-center">
                  {#if !user.active}
                    <div class="w-4 mr-2"><EyeSlash /></div>
                  {/if}
                  {user.firstName}&nbsp;{user.lastName}
                </div>
              </div>
              <div class="flex">
                <div class="text-right text-xs ">{user.email} |&nbsp;</div>
                <div
                  class="text-left text-xs text-red-400 overflow-hidden truncate w-60"
                >
                  {user.role}
                </div>
              </div>
            </td>
            <td>
              <div class="flex justify-center">
                <button
                  class="p-2"
                  on:click={(e) => {
                    successMessage = null;
                    errorMessage = null;
                    //deleteLink(link.id);
                  }}
                >
                  <Edit />
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
