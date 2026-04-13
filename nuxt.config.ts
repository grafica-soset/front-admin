import tailwindcss from "@tailwindcss/vite";

const apiServer = process.env.API_SERVER || 'http://localhost:5000';

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  runtimeConfig: {
    apiServer,
    public: {
    }
  },
  modules: [
      '@pinia/nuxt',
      'pinia-plugin-persistedstate/nuxt',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});
