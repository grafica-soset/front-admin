<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type Account } from '@/utils/models'
import { sessionStore } from "~/stores/sessionStore"
import { useRouter, useRoute } from 'vue-router'

const session = sessionStore()
const router = useRouter()
const route = useRoute()

// Controles de estado da UI
const loading = ref(false)
const errorMessage = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const account = ref<Account>({
  username: "",
  password: "",
} as Account)

const performLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const { success, message, token, username } = await $fetch('/api/login', {
      method: 'POST',
      body: account.value,
    })

    if (success) {
      // Gerencia o "Lembrar-me"
      if (rememberMe.value) {
        session.setSavedUsername(account.value.username)
      } else {
        session.setSavedUsername("") // Limpa se o usuário desmarcou
      }

      // Efetua login no store
      session.login({ username, token })

      // Redireciona para a página solicitada ou para o dashboard
      await router.push(route.query.redirectTo ? String(route.query.redirectTo) : '/')
    } else {
      // Exibe a mensagem de erro que vem do seu backend ou uma mensagem genérica
      errorMessage.value = message || 'Usuário ou senha inválidos. Tente novamente.'
    }
  } catch (error) {
    errorMessage.value = 'Ocorreu um erro ao conectar com o servidor.'
  } finally {
    loading.value = false
  }
}

// Recupera o usuário salvo caso a opção "Lembrar-me" tenha sido usada
onMounted(() => {
  if (session.savedUsername) {
    account.value.username = session.savedUsername
    rememberMe.value = true
  }
})

// Desativa o layout padrão (sidebar) para a tela de login
definePageMeta({
  layout: false
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
    <div class="w-full max-w-md space-y-8">

      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight text-indigo-600">Soset Gestão</h2>
        <p class="mt-2 text-sm text-gray-600">
          Acesse sua conta para gerenciar o sistema
        </p>
      </div>

      <div class="bg-white p-8 shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <form class="space-y-6" @submit.prevent="performLogin">

          <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">
            {{ errorMessage }}
          </div>

          <div>
            <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Usuário ou E-mail</label>
            <div class="mt-2">
              <input
                  id="username"
                  v-model="account.username"
                  type="text"
                  required
                  class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Digite seu usuário..."
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Senha</label>
              <div class="text-sm">
                <NuxtLink to="/recuperar-senha" class="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Esqueceu a senha?
                </NuxtLink>
              </div>
            </div>
            <div class="mt-2 relative">
              <input
                  id="password"
                  v-model="account.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="block w-full rounded-md border-0 py-2 px-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                tabindex="-1"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12C3.75 7.5 7.5 4.5 12 4.5s8.25 3 9.75 7.5c-1.5 4.5-5.25 7.5-9.75 7.5S3.75 16.5 2.25 12z" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 002.25 12c1.5 4.5 5.25 7.5 9.75 7.5 1.857 0 3.597-.5 5.09-1.377M6.53 6.53A9.953 9.953 0 0112 4.5c4.5 0 8.25 3 9.75 7.5a10.49 10.49 0 01-4.293 5.774M6.53 6.53L3 3m3.53 3.53l11.47 11.47M16.5 16.5L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                  id="remember-me"
                  v-model="rememberMe"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
              />
              <label for="remember-me" class="ml-3 block text-sm leading-6 text-gray-700 cursor-pointer">
                Lembrar-me
              </label>
            </div>
          </div>

          <div>
            <button
                type="submit"
                :disabled="loading"
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-colors"
            >
              {{ loading ? 'Autenticando...' : 'Entrar no sistema' }}
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>
