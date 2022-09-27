import { writable } from "svelte/store";

export const accessToken = writable("");
export const refreshToken = writable("");
export const lastVerifiedAt = writable("");
export const activeRules = writable(0);
export const domain = writable("https://hashbang-api.fly.dev");
