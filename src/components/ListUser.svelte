<script type="ts">
  import { currentUserBeingEdited } from "src/stores/context";
  import Edit from "./icons/Edit.svelte";
  import EyeSlash from "./icons/EyeSlash.svelte";
  import Hourglass from "./icons/Hourglass.svelte";

  export let user: any;
</script>

<tr>
  <td class="p-2">
    <div class="font-bold text-gray-800 text-base text-ellipsis flex">
      <div class="flex items-center text-base">
        {#if user.status == "deactivated"}
          <div class="w-4 text-red-400">
            <EyeSlash size="10" fill="currentColor" />
          </div>
        {:else if user.status == "invited"}
          <div class="w-4 text-red-400">
            <Hourglass size="10" fill="currentColor" />
          </div>
        {/if}
        {user.firstName ? user.firstName : ""}&nbsp;{user.lastName
          ? user.lastName
          : ""}
      </div>
    </div>
    <div class="flex">
      <div class="text-right text-xs ">{user.email} |&nbsp;</div>
      <div class="text-left text-xs text-red-400 overflow-hidden truncate w-60">
        {user.role}
      </div>
    </div>
  </td>
  <td>
    <div class="flex justify-center">
      <button
        class="p-2"
        on:click={() => {
          $currentUserBeingEdited = user.id;
        }}
      >
        <Edit />
      </button>
      {#if !user.status}
        <div class="m-2 pt-1 w-4"><EyeSlash /></div>
      {/if}
    </div>
  </td>
</tr>
