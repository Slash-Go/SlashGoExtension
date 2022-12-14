<script lang="ts">
  import { orgHero } from "src/stores/context";
  import { onMount } from "svelte";
  import LockOpenSolid from "./icons/LockOpenSolid.svelte";
  import LockSolid from "./icons/LockSolid.svelte";

  const doesNotContainSpace = (text: string) => {
    if (!text.includes(" ")) return true;
    return false;
  };

  const hasValidLength = (text: string) => {
    if (text.length >= 1) return true;
    return false;
  };

  const isValidShortLink = (text: string) => {
    return hasValidLength(text) && doesNotContainSpace(text);
  };

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "create_link_response") {
      isCreatingShortLink = false;
      if (msg.status === "success") {
        successMessage = "Success! You can now slash/go to your new shortlink";
      } else {
        errorMessage = msg.message;
      }
      selectedType = `static`;
    }
  });

  let isCreatingShortLink: boolean = false;

  let successMessage: string = null,
    errorMessage: string = null;
  let shortLink: string = "",
    isPrivate: boolean = false;
  let selectedType: string = `static`;
  let description: string = "";
  let dynamicUrl: string = "";

  const privatePath = `my/`;
  $: displayPath = isPrivate ? `${$orgHero}/${privatePath}` : `${$orgHero}/`;

  let shortLinkInput: HTMLInputElement;

  const createLink = async (url: string) => {
    isCreatingShortLink = true;
    errorMessage = "";
    successMessage = "";

    chrome.runtime.sendMessage({
      command: "create_link",
      data: { url, shortLink, description, selectedType, isPrivate },
    });
  };

  const setDynamicUrl = () => {
    chrome.tabs.query({ active: true }, (tabs) => {
      console.info(`creating shortlink for ${tabs[0].url}`);
      dynamicUrl = tabs[0].url;
    });
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  $: submit = async () => {
    chrome.tabs.query({ active: true }, (tabs) => {
      console.info(`creating shortlink for ${tabs[0].url}`);
      createLink(selectedType === `dynamic` ? dynamicUrl : tabs[0].url);
    });
  };

  onMount(() => {
    shortLinkInput.focus();
  });
</script>

<section class="antialiased bg-gray-100 text-gray-600 px-4">
  <div class="flex flex-col justify-center h-full">
    <div
      on:click={() => openOptions()}
      class="text-right cursor-pointer select-none text-xs text-red-500 hover:text-red-600 underline underline-offset-3 pt-2 pr-2"
    >
      View Links
    </div>
    <div class="main bg-slate-100">
      <div class="p-2">
        <form on:submit|preventDefault={submit}>
          <div class="flex">
            <div
              class="ease-in select-none font-bold text-slate-500 ml-1 mt-1 mb-1 p-2 text-lg border border-slate-300 rounded-l-md text-left"
            >
              {displayPath}
            </div>
            <input
              bind:this={shortLinkInput}
              bind:value={shortLink}
              type="input"
              class="text-lg text-slate-500 mt-1 mb-1 pl-1 border border-slate-300 text-left"
              placeholder="shortlink"
            />
            <div
              on:click={() => (isPrivate = !isPrivate)}
              class="ease-in hover:cursor-pointer select-none text-slate-500 {isPrivate
                ? 'bg-gray-300'
                : ''} mt-1 p-2 mb-1 text-lg border border-slate-300 rounded-r-md text-left"
            >
              {#if isPrivate}
                <LockSolid size="20px" />
              {:else}
                <LockOpenSolid size="20px" />
              {/if}
            </div>
          </div>
          <div class="pt-1 pb-1 w-full text-center text-xs text-slate-400">
            <b>Tip:</b> The best shortlinks are short and memorable
          </div>

          <div class="flex justify-center">
            <input
              bind:value={description}
              type="text"
              class="w-full rounded text-sm text-slate-500 mt-1 mb-1 p-2 border border-slate-300 text-left"
              placeholder="description (optional)"
            />
          </div>
          <div class="flex justify-center">
            <div
              class="ease-in p-2 rounded select-none {selectedType == `static`
                ? 'bg-gray-300 text-gray-600 underline underline-offset-4'
                : 'text-gray-400'} hover:text-gray-600 hover:cursor-pointer text-left font-bold"
              on:click={(_) => (selectedType = `static`)}
            >
              static
            </div>
            <div
              class="ease-in p-2 rounded select-none {selectedType == `dynamic`
                ? 'bg-gray-300 text-gray-600 underline underline-offset-4'
                : 'text-gray-400'} hover:text-gray-600 hover:cursor-pointer text-left font-bold"
              on:click={(_) => {
                selectedType = `dynamic`;
                setDynamicUrl();
              }}
            >
              dynamic
            </div>
          </div>
          {#if selectedType == `dynamic`}
            <div class="mt-2 text-center">
              <div class="text-xs text-green-400">
                Replace dynamic part of url by <span class="text-bold font-bold"
                  >&lt;var&gt;</span
                >
              </div>
              <input
                bind:value={dynamicUrl}
                type="input"
                class="w-full text-sm p-2  text-slate-600 rounded mt-1 mb-1 pl-2 border border-slate-300 text-left"
                placeholder="shortlink"
              />
            </div>
          {/if}
          <div class="w-100 text-center">
            <button
              disabled={!isValidShortLink(shortLink) || isCreatingShortLink}
              class="disabled:opacity-50 mt-2 w-60 mb-2 bg-red-500 hover:bg-red-600 text-white font-bold pt-2 pb-2 pl-6 pr-4 rounded"
              type="submit"
              >{isCreatingShortLink ? "Creating..." : "Create"}</button
            >
          </div>
        </form>
        {#if successMessage}<div
            class="p-2 text-center text-green-500 font-bold"
          >
            {successMessage}
          </div>{/if}
        {#if errorMessage}<div class="p-2 text-center text-red-500 font-bold">
            {errorMessage}
          </div>{/if}
      </div>
    </div>
  </div>
</section>
