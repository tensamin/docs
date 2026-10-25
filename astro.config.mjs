// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import mdx from "@astrojs/mdx";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  outDir: "dist",
  redirects: {
    "/canary/": "/using/canary/",
    "/iota/": "/installation/#setup-an-iota",
    "/obtainium/": "/installation/#updates-with-obtainium",
    "/updates/": "/installation/#iota-updates",
  },

  integrations: [
    starlight({
      title: "Tensamin",
      logo: {
        alt: "Tensamin Logo",
        replacesTitle: true,
        dark: "./src/logo/dark.svg",
        light: "./src/logo/light.svg",
      },
      customCss: ["./src/theme.css"],
      social: [
        {
          icon: "code-branch",
          label: "Git",
          href: "https://github.com/tensamin",
        },
        {
          icon: "external",
          label: "Homepage",
          href: "https://tensamin.net",
        },
        {
          icon: "information",
          label: "Status",
          href: "https://status.nonanium.net",
        },
        {
          icon: "heart",
          label: "Support us",
          href: "https://shop.nonanium.net/collections/tensamin",
        },
      ],
      sidebar: [
        "index",
        "installation",
        {
          label: "Using Tensamin",
          items: [{ autogenerate: { directory: "using" } }],
        },
        {
          label: "Hosting an Iota",
          items: [{ autogenerate: { directory: "hosting" } }],
        },
        {
          label: "Integrate TAuth",
          items: [{ autogenerate: { directory: "developers" } }],
        },
      ],
    }),
    mdx(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
