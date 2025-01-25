import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
// import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  plugins: [vue(), VueRouter({})],
  resolve: {
    alias: [
      { find: "~assets", replacement: path.resolve(__dirname, "src/assets") },
      { find: "~types", replacement: path.resolve(__dirname, "src/types") },
      { find: "~utils", replacement: path.resolve(__dirname, "src/utils") },
      { find: "~store", replacement: path.resolve(__dirname, "src/store") },
      { find: "~router", replacement: path.resolve(__dirname, "src/router") },
      { find: "~pages", replacement: path.resolve(__dirname, "src/pages") },
      { find: "~ui", replacement: path.resolve(__dirname, "src/ui") },
      {
        find: "~components",
        replacement: path.resolve(__dirname, "src/components"),
      },
    ],
  },
});
