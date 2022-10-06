<script lang="ts">
  import { onMount } from "svelte";
  import ListUser from "./ListUser.svelte";
  import EditUser from "./EditUser.svelte";
  import Loader from "./Loader.svelte";
  import { currentEdit, currentCreate } from "src/stores/context";

  let users = [];

  let successMessage: string = null,
    errorMessage: string = null,
    isLoading: boolean = false;

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "update_user_response") {
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
    } else if (msg.type === "create_user_response") {
      if (msg.status === "success") {
        successMessage = "Invited User Successfully!";
        $currentCreate = false;
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

{#if successMessage}<div
    class="absolute w-full max-w-xl mx-auto p-2 text-center text-green-500 font-bold"
  >
    {successMessage}
  </div>
{:else if errorMessage}<div
    class="absolute w-full max-w-xl mx-auto p-2 text-center text-green-500 font-bold"
  >
    {errorMessage}
  </div>
{/if}
<div class="overflow-x-auto p-3">
  {#if isLoading}
    <Loader />
  {:else}
    <div>
      <button
        on:click={() => ($currentCreate = !$currentCreate)}
        class="text-xs font-bold text-red-400 hover:text-red-600 underline underline-offset-4"
      >
        + Invite User
      </button>
    </div>
    <table class="table-auto w-full">
      <tbody class="text-sm divide-y divide-gray-100">
        {#if $currentCreate}
          <EditUser createMode={true} />
        {/if}
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
