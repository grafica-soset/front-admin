# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site
```

No lint or test commands are configured.

## Architecture

This is a **Nuxt 4** admin dashboard using the `app/` directory convention, Pinia for state management, and Tailwind CSS v4 via the Vite plugin.

### Backend API proxy pattern

All API calls from pages go through Nuxt server routes in `server/api/`, which proxy to the backend configured via `API_SERVER` env var (default: `http://localhost:5000`). Server routes use `useRuntimeConfig().apiServer` to access this value. Pages use `useFetch('/api/...')` — never call the backend directly from client code.

### Authentication flow

- `app/stores/sessionStore.js` holds `token`, `username`, `nome`. The `isLogged` getter validates the token. State is persisted via `pinia-plugin-persistedstate`.
- `app/middleware/auth-verification.ts` protects pages; apply it with `definePageMeta({ middleware: ['auth-verification'] })`.
- On 401 from any server route, redirect to `/login?redirect=<original-path>`.

### Routing

File-based routing via `app/pages/`. Dynamic segments use `[id].vue`. The `default` layout in `app/layouts/default.vue` renders the sidebar; unauthenticated pages (`/login`) use `definePageMeta({ layout: false })`.

### UI components

Reusable components live in `app/components/ui/`. Key ones:
- `Button.vue` — renders as `<button>` or `<NuxtLink>` depending on `to` prop; `color` prop accepts `black | blue | red | green | yellow | white`.
- `CardForm.vue` — wraps forms with cancel/save buttons, emits `submitForm`.
- `Datatable.vue`, `SearchDropdown.vue`, `PageHeader.vue`, `Breadcrumb.vue`.

### Styling

Custom form classes are defined in `app/assets/css/main.css` via `@layer components`: `.form-group`, `.form-label`, `.form-input`, `.form-select`, `.form-textarea`, `.form-radio`, `.form-checkbox`, `.btn-primary`. Use these instead of raw Tailwind for form elements. The primary color is indigo-600.

### TypeScript interfaces

Shared interfaces are in `app/utils/models.ts` (`Account`, `Customer`). Add new domain types there.
