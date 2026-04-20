<script setup>
import { ref } from 'vue'
import { sessionStore } from "~/stores/sessionStore.js";

const session = sessionStore()
const router = useRouter()

// Controle de estado para o menu no celular
const isSidebarOpen = ref(false)

// Definição dos itens de menu baseados no escopo do projeto
const menuItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>'
  },
  {
    name: 'Clientes',
    path: '/clientes',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>'
  },
  {
    name: 'Cadastro',
    path: '/cadastro',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>'
  },
  {
    name: 'Listagem',
    path: '/listagem',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>'
  },

]

const logoff = async () => {
  // Lógica de logoff, como limpar tokens, redirecionar para a página de login, etc.
  console.log('Usuário deslogado')
  await session.logout()
  router.push('/login')
}
</script>


<template>
  <div class="flex h-screen bg-gray-50 font-sans text-gray-900">
    <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden"
        @click="isSidebarOpen = false"
    ></div>

    <aside
        :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:flex md:flex-col'
      ]"
    >
      <div class="flex h-16 shrink-0 items-center px-6 border-b border-gray-100">
        <span class="text-xl font-bold text-indigo-600">Soset Gestão</span>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <NuxtLink
            v-for="item in menuItems"
            :key="item.name"
            :to="item.path"
            class="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            active-class="bg-indigo-50 text-indigo-600 font-semibold"
        >
          <span class="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-500" v-html="item.icon"></span>
          {{ item.name }}
        </NuxtLink>
      </nav>

      <div class="border-t border-gray-200 p-4">
        <button class="flex w-full items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
          <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
          Sair do Sistema
        </button>
      </div>
    </aside>

    <div class="flex flex-1 flex-col min-w-0 overflow-hidden">

      <header class="flex h-16 shrink-0 items-center justify-between bg-white px-4 shadow-sm border-b border-gray-200 sm:px-6 lg:px-8">
        <button
            @click="isSidebarOpen = true"
            class="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        >
          <span class="sr-only">Abrir menu lateral</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <div class="flex flex-1 justify-end">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500 hidden sm:block">Olá, Administrador</span>
            <span @click="logoff">sair</span>
            <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              A
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto focus:outline-none">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>


