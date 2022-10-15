<script type="ts">
  import { currentLinkEdit, orgHero } from "../stores/context";
  import RotateLeft from "./icons/RotateLeft.svelte";
  import Save from "./icons/Save.svelte";
  export let link: any = {};

  const updateLink = (link) => {
    chrome.runtime.sendMessage({ command: "update_link", payload: link });
  };
</script>

<tr>
  <td class="p-2">
    <div class="font-bold text-gray-800 text-lg text-ellipsis flex">
      <div class="flex items-center">
        <span>{$orgHero}/</span>
        <input
          type="text"
          placeholder="Short Link"
          bind:value={link.shortLink}
          class="w-70 text-slate-500 mt-1 mb-1 pl-1 border border-slate-300 rounded-md text-left"
        />
        &nbsp;&nbsp;
      </div>
    </div>
    <div class="flex">
      <input
        type="text"
        placeholder="Description"
        bind:value={link.description}
        class="w-70 text-slate-500 mt-1 mb-1 pl-1 border border-slate-300 rounded-md text-left"
      />
    </div>
    <div class="flex">
      <div
        class="text-left text-xs text-red-400 text-slate-500 overflow-hidden truncate w-20"
      >
        <select
          bind:value={link.type}
          class="bg-gray-50 border border-gray-300 text-gray-900 mt-1 mb-1 rounded-md"
        >
          <option value="static">static</option>
          <option value="dynamic">dynamic</option>
        </select>
      </div>
      <div class="text-left text-xs text-red-400 overflow-hidden">
        <input
          type="text"
          placeholder="Url"
          bind:value={link.fullUrl}
          class="w-48 text-slate-500 mt-1 mb-1 pl-1 border border-slate-300 rounded-md text-left "
        />
      </div>
    </div>
  </td>
  <td class="p-2" />
  <td>
    <div class="flex justify-center">
      <button
        class="p-2"
        on:click={() => {
          $currentLinkEdit = "";
        }}
      >
        <RotateLeft size="18px" />
      </button>
      <button
        class="p-2"
        on:click={() => {
          //link.id = $currentLinkEdit;
          updateLink(link);
        }}
      >
        <Save size="18px" />
      </button>
    </div>
  </td>
</tr>
