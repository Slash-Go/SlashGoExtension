<script type="ts">
  import {
    currentUserBeingEdited,
    role,
    currentCreate,
  } from "../stores/context";
  import RotateLeft from "./icons/RotateLeft.svelte";
  import Save from "./icons/Save.svelte";
  export let user: any = {};
  export let createMode: boolean = false;

  function updateUser(user: any) {
    chrome.runtime.sendMessage({ command: "update_user", payload: user });
  }

  function createUser(user: any) {
    chrome.runtime.sendMessage({ command: "create_user", payload: user });
  }
</script>

<tr>
  <td class="p-2">
    <div class="font-bold text-gray-800 text-base text-ellipsis flex">
      <div class="flex items-center">
        <input
          type="text"
          placeholder="First Name"
          bind:value={user.firstName}
          class="w-48 text-slate-500 mt-1 mb-1 pl-1 border border-slate-300 rounded-md text-left"
        />
        &nbsp;&nbsp;
        <input
          type="text"
          placeholder="Last Name"
          bind:value={user.lastName}
          class="w-48 text-slate-500 mt-1 mb-1 pl-1 border border-slate-300 rounded-md text-left"
        />
      </div>
    </div>
    <div class="flex">
      <div class="text-right text-xs ">
        <input
          type="email"
          placeholder="Email"
          bind:value={user.email}
          class="mt-1 mb-1 pl-1 border border-slate-300 rounded-md text-left"
        /> |&nbsp;
      </div>
      <div class="text-left text-xs text-red-400 overflow-hidden truncate w-60">
        <select
          bind:value={user.role}
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md mt-1 mb-1"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
          {#if $role == "global_admin"}
            <option value="global_admin">global_admin</option>
          {/if}
        </select>
      </div>
    </div>
  </td>
  <td>
    <div class="flex justify-center">
      <button
        class="p-2"
        on:click={() => {
          createMode
            ? ($currentCreate = false)
            : ($currentUserBeingEdited = "");
        }}
      >
        <RotateLeft size="18px" />
      </button>
      <button
        class="p-2"
        on:click={() => {
          if (!createMode) {
            updateUser(user);
          } else {
            createUser(user);
          }
        }}
      >
        <Save size="18px" />
      </button>
    </div>
  </td>
</tr>
