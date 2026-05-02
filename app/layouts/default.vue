<script setup>
import { ref } from 'vue'
import { sessionStore } from "~/stores/sessionStore.js";
import { useRouter } from 'vue-router';

const session = sessionStore()
const router = useRouter()
const route = useRoute()

// Definição dos itens de menu baseados no escopo do projeto
const menuItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>'
  },
  {
    name: 'Clientes',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>',
    // Adicionado a propriedade children para criar o submenu
    children: [
      { name: 'Dashboard', path: '/clientes' },
      { name: 'Listagem', path: '/clientes/listagem' },
      { name: 'Novo Cliente', path: '/clientes/novo' }
    ]
  },
  {
    name: 'Contadores',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.611 4.5 4.718V21a.75.75 0 001.5 0V4.718c0-.263.18-.497.45-.522A48.8 48.8 0 0112 3.75c1.907 0 3.796.109 5.55.321.27.025.45.26.45.522V21a.75.75 0 001.5 0V4.718c0-1.107-.807-2.019-1.907-2.147A49.035 49.035 0 0012 2.25z" /></svg>',
    children: [
      { name: 'Listagem', path: '/contadores/listagem' },
      { name: 'Novo Contador', path: '/contadores/novo' },
    ]
  },
  {
    name: 'Vendedores',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>',
    children: [
      { name: 'Listagem', path: '/vendedores/listagem' },
      { name: 'Novo Vendedor', path: '/vendedores/novo' },
    ]
  },
  {
    name: 'Exemplos',
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>',
    // Adicionado a propriedade children para criar o submenu
    children: [
      { name: 'Listagem', path: '/listagem' },
      { name: 'Cadastro', path: '/cadastro' },
    ]
  }
]


// Controle de estado para o menu no celular
const isSidebarOpen = ref(false)

// Controle de estado para os submenus abertos (guarda o nome do menu aberto)
const openSubmenus = ref([])

const toggleSubmenu = (menuName) => {
  if (openSubmenus.value.includes(menuName)) {
    // Se já está aberto, remove da lista (fecha)
    openSubmenus.value = openSubmenus.value.filter(name => name !== menuName)
  } else {
    // Se está fechado, adiciona à lista (abre)
    openSubmenus.value.push(menuName)
  }
}

const isSubmenuOpen = (menuName) => openSubmenus.value.includes(menuName)

// 1. Função para verificar se o menu pai deve estar aberto/ativo baseado na URL
const checkActiveSubmenu = () => {
  menuItems.forEach(item => {
    if (item.children) {
      // Verifica se algum filho tem o path igual à rota atual
      const hasActiveChild = item.children.some(child => child.path === route.path)
      if (hasActiveChild && !openSubmenus.value.includes(item.name)) {
        openSubmenus.value.push(item.name)
      }
    }
  })
}

// Função auxiliar para destacar o botão pai se um filho estiver ativo
const isParentActive = (item) => {
  if (!item.children) return false
  return item.children.some(child => child.path === route.path)
}

const logoff = async () => {
  console.log('Usuário deslogado')
  await session.logout()
  router.push('/login')
}


// 2. Executa a verificação ao montar o componente
onMounted(() => {
  checkActiveSubmenu()
})


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
        <div v-for="item in menuItems" :key="item.name">

          <NuxtLink
              v-if="!item.children"
              :to="item.path"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              active-class="bg-indigo-50 text-indigo-600 font-semibold"
          >
            <span class="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-500" v-html="item.icon"></span>
            {{ item.name }}
          </NuxtLink>

          <button
              v-else
              @click="toggleSubmenu(item.name)"
              class="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              :class="{ 'bg-indigo-50 text-indigo-600': isSubmenuOpen(item.name) }"
          >
            <div class="flex items-center">
              <span class="mr-3 h-5 w-5" :class="isSubmenuOpen(item.name) ? 'text-indigo-500' : 'text-gray-400'" v-html="item.icon"></span>
              {{ item.name }}
            </div>
            <svg
                :class="[isSubmenuOpen(item.name) ? 'rotate-90 text-indigo-600' : 'text-gray-400', 'h-4 w-4 shrink-0 transition-transform duration-200']"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>

          <div v-if="item.children" v-show="isSubmenuOpen(item.name)" class="mt-1 space-y-1">
            <NuxtLink
                v-for="subItem in item.children"
                :key="subItem.name"
                :to="subItem.path"
                class="flex items-center rounded-md py-2 pl-11 pr-3 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                active-class="bg-indigo-50 text-indigo-600 font-semibold"
            >
              {{ subItem.name }}
            </NuxtLink>
          </div>

        </div>
      </nav>

      <div class="border-t border-gray-200 p-4">
        <button class="flex w-full items-center text-sm font-medium text-gray-700 hover:text-indigo-600" @click="logoff">
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
            <button @click="logoff" class="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">Sair</button>
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
