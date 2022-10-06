export type IStorage = {
  accessToken: string;
  refreshToken: string;
  lastVerifiedAt: string;
  role: string;
  domain: string;
  orgHero: string;
};

export type choices = "links" | "settings" | "users";
