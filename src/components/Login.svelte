<script lang="ts">
    import axios, { AxiosError, type AxiosResponse } from 'axios';
    import type { IStorage } from 'src/types';
    import { accessToken, refreshToken, lastVerifiedAt, domain } from '../stores/context';

    let email: string = '', password: string = '',
    errorMessage= '', moreOptions = false;

    const save = async () => {
        const storage: IStorage = {
            accessToken: $accessToken,
            refreshToken: $refreshToken,
            lastVerifiedAt: $lastVerifiedAt,
            domain: $domain
        };

        chrome.storage.sync.set(storage, () => {
            console.log("Updated Storage");
            startSync();
        });
    }

    const startSync = async () => {
        chrome.runtime.sendMessage({ command: "start_sync" });
    }


    $: submit = async () => {
        axios.post(`${$domain}/auth/login`, 
            { 
                    email, 
                    password
            }).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    $accessToken = response.data.accessToken;
                    $refreshToken = response.data.refreshToken;
                    $lastVerifiedAt = new Date().toISOString();
                    errorMessage = '';
                    save();
                }
            }).catch((e: AxiosError) => {
                console.log("Could not log in user");
                if (e.response!.status == 401) {
                    errorMessage = e.response.data["error"] as string;
                } else {
                    errorMessage = `Unable to log user in`;
                }
            });
    }
</script>

<div class="h-screen bg-slate-100">
    <div class="flex justify-center text-center text-xl bg-slate-200 p-1 border-b-2 border-slate-400">
        <span class="text-black-500 font-bold">Slash</span>
        <span class="text-red-500 font-bold">/Go</span>
    </div>
    
    {#if errorMessage}
        <div class="p-2 text-center text-red-600 font-bold">{errorMessage}</div>
    {/if}
            
    <div class="p-2">
        <form class="text-center" on:submit|preventDefault={submit}>
            
            <input bind:value={email} type="email" class="m-1 p-2 border border-slate-300 rounded-md text-center" placeholder="username@domain.com">
            <input bind:value={password} type="password" class="m-1 p-2 border border-slate-300 rounded-md text-center" placeholder="password">
            
            <div class="select-none pt-2 pl-2 text-xs hover:text-gray-600 hover:cursor-pointer text-left font-bold text-gray-400" on:click={_ => moreOptions = !moreOptions}>(+)</div>
            {#if moreOptions}
                <input bind:value={$domain} type="string" class="m-1 p-2 border border-slate-300 rounded-md text-center" placeholder="slashGo domain">
            {/if}

            <button class="mt-2 mb-2 bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded" type="submit">Sign In</button>
        </form>
    </div>
</div>