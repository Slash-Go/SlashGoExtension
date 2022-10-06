import { writable } from "svelte/store";

export const accessToken = writable("");
export const refreshToken = writable("");
export const lastVerifiedAt = writable("");
export const role = writable("user");
export const domain = writable("https://api.slashgo.link");
export const orgHero = writable("go");

export const currentEdit = writable("");
