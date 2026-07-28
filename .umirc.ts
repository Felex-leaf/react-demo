import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
  ],
  npmClient: 'yarn',
  utoopack: {},
  headTags: [
    {
      tag: 'meta',
      attrs: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no',
      },
    },
    {
      tag: 'meta',
      attrs: {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
    },
    {
      tag: 'meta',
      attrs: {
        name: 'format-detection',
        content: 'telephone=no',
      },
    },
  ],
});
