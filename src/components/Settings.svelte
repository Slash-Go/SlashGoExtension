<script lang="ts">
  import { orgHero } from "src/stores/context";
  import { onMount } from "svelte";
  import Loader from "./Loader.svelte";

  let successMessage: string = null,
    errorMessage: string = null,
    isLoading: boolean = false,
    orgData: any = {};

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "update_org_details_response") {
      if (msg.status === "success") {
        successMessage = "Updated Slash/Go trigger!";
        setTimeout(() => {
          successMessage = "";
        }, 2000);
        getOrgDetails();
        chrome.runtime.sendMessage({
          command: "update_hero",
          payload: orgData.orgHero,
        });
      } else {
        errorMessage = `Error: ${msg.message}`;
        setTimeout(() => {
          errorMessage = "";
        }, 2000);
      }
    } else if (msg.type === "get_org_details_response") {
      orgData = msg.data;
      isLoading = false;
      $orgHero = orgData.orgHero;
    }
  });

  const getOrgDetails = () => {
    chrome.runtime.sendMessage({ command: "get_org_details" });
  };

  const updateOrgHero = (orgData: any) => {
    chrome.runtime.sendMessage({
      command: "update_org_details",
      payload: orgData,
    });
  };

  const orgHeroButtonDisabled = (orgHeroInput: string) => {
    if (!orgHeroInput || orgHeroInput === "" || orgHeroInput === $orgHero) {
      return true;
    }
    return false;
  };

  onMount(async () => {
    getOrgDetails();
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
    <div class="overflow-x-auto p-3">
      <div class="p-2">
        <div class="font-bold text-xs">Organization Id</div>
        <div class="text-xs">{orgData.orgId}</div>
      </div>
      <div class="p-2">
        <div class="font-bold text-xs">Organization Name</div>
        <div class="text-xs">{orgData.orgName}</div>
      </div>
      <div class="p-2">
        <div class="font-bold text-xs">Licenses</div>
        <div class="text-xs">{orgData.licenses}</div>
      </div>
      <div class="p-2">
        <div class="font-bold text-xs pb-1">Organization Slash/Go Trigger</div>
        <input
          class="w-20 text-slate-500 p-2 border border-slate-300 text-xs"
          type="text"
          name="orgHero"
          bind:value={orgData.orgHero}
        />
        <button
          on:click={() => updateOrgHero(orgData)}
          disabled={orgHeroButtonDisabled(orgData?.orgHero)}
          class="disabled:opacity-50 text-xs bg-red-500 hover:bg-red-600 text-white font-bold rounded p-2"
          >Update</button
        >
      </div>
    </div>
  {/if}
</div>
