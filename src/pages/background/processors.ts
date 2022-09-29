export const staticProcessor = (slashGoHero: string, link: any, id: number) => {
  console.log(`Running Static Processor for linkId=${link.id}`);
  let privateLink = link.private === true ? "my/" : "";
  return {
    id: id,
    priority: 3,
    action: { type: "redirect", redirect: { url: link.fullUrl } },
    condition: {
      urlFilter: `||${slashGoHero}/${privateLink}${link.shortLink}`,
      resourceTypes: ["main_frame", "sub_frame"],
    },
  };
};

export const dynamicProcessor = (
  slashGoHero: string,
  link: any,
  id: number
) => {
  console.log(`Running Dynamic Processor for linkId=${link.id}`);
  let regexedUrl = link.fullUrl.replace("<var>", "\\1");
  let privateLink = link.private ? "my/" : "";
  return {
    id: id,
    priority: 2,
    action: { type: "redirect", redirect: { regexSubstitution: regexedUrl } },
    condition: {
      regexFilter: `^https?:\/\/${slashGoHero}\/${privateLink}${link.shortLink}(?:\/([a-zA-Z0-9!@#$%^&*\/?]+))`,
      resourceTypes: ["main_frame", "sub_frame"],
    },
  };
};

export const searchEngineQueryInterceptProcessor = (
  slashGoHero: string,
  link: any,
  id: number
) => {
  return {
    id: id,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { regexSubstitution: `http://${slashGoHero}/\\2` },
    },
    condition: {
      regexFilter: `${link}.*q=${slashGoHero}(%2F|/)(?:([a-zA-Z0-9!@#$%^*\/?]+))`,
      resourceTypes: ["main_frame", "sub_frame"],
    },
  };
};

export const defaultQueryInterceptProcessor = (slashGoHero: string) => {
  return {
    id: 1000,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { extensionPath: `/src/pages/options/index.html` },
    },
    condition: {
      urlFilter: `||${slashGoHero}/`,
      resourceTypes: ["main_frame", "sub_frame"],
    },
  };
};
