<script lang="ts">
  import { onMount } from "svelte";
  import ListUser from "./ListUser.svelte";
  import EditUser from "./EditUser.svelte";
  import Loader from "./Loader.svelte";
  import { currentEdit } from "src/stores/context";

  let users = [];

  let successMessage: string = null,
    errorMessage: string = null,
    isLoading: boolean = false;

  chrome.runtime.onMessage.addListener((msg) => {
    if (
      msg.type === "update_user_response" ||
      msg.type === "create_user_response"
    ) {
      if (msg.status === "success") {
        successMessage = "Updated!";
        $currentEdit = "";
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
      isLoading = false;
    }
  });

  const getUsers = () => {
    chrome.runtime.sendMessage({ command: "get_users" });
  };

  onMount(async () => {
    getUsers();
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
  {:else}
  <table class="table-auto w-full">
    <tbody class="text-sm divide-y divide-gray-100">
      {#each users as user}
        {#if $currentEdit != user.id}
          <ListUser {user} />
        {:else}
          <EditUser {user} />
        {/if}
      {/each}
    </tbody>
  </table>
  {/if}
</div>
