<script setup lang="ts">
import { sessionStore as useSessionStore } from '~/stores/sessionStore'

definePageMeta({ middleware: ['auth-verification'] })

const route = useRoute()
const id = route.params.id as string
const store = useSessionStore()

const breadcrumb = [
  { label: 'Vendedores', to: '/vendedores' },
  { label: 'Todos os Vendedores', to: '/vendedores/listagem' },
  { label: 'Detalhar' },
]

const { data: res, pending, refresh } = await useFetch<any>(`/api/salespersons/${id}`, {
  query: { token: store.token }
})

const salesperson = computed(() => res.value?.data ?? null)
const displayName = computed(() => {
  const s = salesperson.value
  if (!s) return '—'
  return [s.firstName, s.lastName].filter(Boolean).join(' ')
})

// ── Edit modal ────────────────────────────────────────────────────────────────
const showEditModal = ref(false)
const saving = ref(false)
const saveError = ref('')

const form = reactive({
  firstName:  '',
  lastName:   '',
  personCode: '',
  telephone:  '',
  cellular:   '',
})

function openEditModal() {
  const s = salesperson.value
  if (!s) return
  form.firstName  = s.firstName  ?? ''
  form.lastName   = s.lastName   ?? ''
  form.personCode = s.personCode ?? ''
  form.telephone  = s.telephone  ?? ''
  form.cellular   = s.cellular   ?? ''
  saveError.value = ''
  showEditModal.value = true
}

async function salvar() {
  if (!form.firstName.trim() || !form.lastName.trim()) {
    saveError.value = 'Nome e sobrenome são obrigatórios.'
    return
  }
  if (!form.personCode.trim()) {
    saveError.value = 'O código é obrigatório.'
    return
  }
  saving.value = true
  saveError.value = ''
  try {
    const r = await $fetch<any>(`/api/salespersons/${id}`, {
      method: 'PUT',
      query: { token: store.token },
      body: { ...form },
    })
    if (r.success) {
      await refresh()
      showEditModal.value = false
    } else {
      saveError.value = r.message || 'Erro ao salvar. Tente novamente.'
    }
  } catch (e: any) {
    saveError.value = e?.data?.message || 'Erro ao salvar. Tente novamente.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 md:p-8 bg-gray-50 min-h-screen font-sans w-full">

    <UiBreadcrumb :items="breadcrumb" />

    <div v-if="pending" class="animate-pulse space-y-4 mt-4">
      <div class="h-28 bg-white rounded-xl border border-gray-200"></div>
    </div>

    <template v-else-if="salesperson">

      <!-- Header -->
      <header class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 mt-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-lg font-bold shrink-0">
              {{ salesperson.personCode || '?' }}
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ displayName }}</h1>
              <p v-if="salesperson.telephone" class="text-sm text-gray-500 mt-0.5 font-mono">{{ salesperson.telephone }}</p>
            </div>
          </div>
          <button
            @click="openEditModal"
            class="w-full md:w-auto px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Editar Dados
          </button>
        </div>
      </header>

      <!-- Info -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-lg">
        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Informações</h3>
        <dl class="space-y-3">
          <div>
            <dt class="text-xs text-gray-400">Nome completo</dt>
            <dd class="text-sm text-gray-800">{{ displayName }}</dd>
          </div>
          <div>
            <dt class="text-xs text-gray-400">Código</dt>
            <dd class="text-sm text-gray-800 font-mono">{{ salesperson.personCode || '—' }}</dd>
          </div>
          <div v-if="salesperson.telephone">
            <dt class="text-xs text-gray-400">Telefone</dt>
            <dd class="text-sm text-gray-800 font-mono">{{ salesperson.telephone }}</dd>
          </div>
          <div v-if="salesperson.cellular">
            <dt class="text-xs text-gray-400">Celular</dt>
            <dd class="text-sm text-gray-800 font-mono">{{ salesperson.cellular }}</dd>
          </div>
        </dl>
      </section>

    </template>

    <div v-else class="mt-8 text-center text-sm text-gray-500">Vendedor não encontrado.</div>

    <!-- Modal editar -->
    <UiModal :open="showEditModal" title="Editar Vendedor" size="md" @close="showEditModal = false">
      <form @submit.prevent="salvar">
        <FormsSalespersonForm :form="form" mode="edit" />
        <p v-if="saveError" class="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {{ saveError }}
        </p>
      </form>
      <template #footer>
        <button type="button" @click="showEditModal = false"
          class="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="button" @click="salvar" :disabled="saving"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2">
          <svg v-if="saving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ saving ? 'Salvando...' : 'Salvar' }}
        </button>
      </template>
    </UiModal>

  </div>
</template>
