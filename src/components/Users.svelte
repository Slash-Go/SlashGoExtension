<script lang="ts">
  import { onMount } from "svelte";
  import ListUser from "./ListUser.svelte";
  import EditUser from "./EditUser.svelte";
  import Loader from "./Loader.svelte";
  import { currentUserBeingEdited, currentCreate } from "src/stores/context";

  let users = [];

  let searchTermInput: HTMLInputElement;
  let searchTerm: string = "";

  let successMessage: string = null,
    errorMessage: string = null,
    isLoading: boolean = false;

  $: filteredUsers = users.filter((item) => {
    if (searchTerm === "") return true;
    const searchQuery = searchTerm.toLowerCase();
    return (
      item.email.toLowerCase().includes(searchQuery) ||
      item.firstName.toLowerCase().includes(searchQuery) ||
      item.lastName.toLowerCase().includes(searchQuery)
    );
  });
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "update_user_response") {
      if (msg.status === "success") {
        successMessage = "Updated!";
        $currentUserBeingEdited = "";
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
      requestAnimationFrame(() => {
        if (searchTermInput) searchTermInput.focus();
      });
    }
  });

  const getUsers = () => {
    chrome.runtime.sendMessage({ command: "get_users" });
  };

  onMount(async () => {
    $currentUserBeingEdited = "";
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
    <div class="flex p-3 justify-center">
      <input
        bind:this={searchTermInput}
        bind:value={searchTerm}
        type="text"
        class="text-xs text-slate-600 w-2/3 text-center pt-2 pb-2 border border-slate-300 rounded-md outline-slate-300 "
        placeholder="search users"
      />
    </div>
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
        {#if filteredUsers.length === 0}
          <div class="text-center text-xs italic py-3.5">No users found!</div>
        {:else}
          {#each filteredUsers as user}
            {#if $currentUserBeingEdited != user.id}
              <ListUser {user} />
            {:else}
              <EditUser {user} />
            {/if}
          {/each}
        {/if}
      </tbody>
    </table>
  {/if}
</div>
