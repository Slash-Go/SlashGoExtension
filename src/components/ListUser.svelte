<script type="ts">
  import { currentEdit } from "src/stores/context";
  import Edit from "./icons/Edit.svelte";
  import EyeSlash from "./icons/EyeSlash.svelte";

  export let user: any;
</script>

<tr>
  <td class="p-2">
    <div class="font-bold text-gray-800 text-lg text-ellipsis flex">
      <div class="flex items-center">
        {#if !user.active}
          <div class="w-4 mr-2"><EyeSlash /></div>
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
          $currentEdit = user.id;
        }}
      >
        <Edit />
      </button>
    </div>
  </td>
</tr>
