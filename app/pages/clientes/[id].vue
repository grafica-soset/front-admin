<script setup>

const route = useRoute()

const customerId = computed(() => {
  return parseInt(route.params.id)
})

const currentPage = computed(() => {
  const page = route.query.page
  return page ? parseInt(page) : 1
})

const data = ref({})
const loading = ref(false)

const activeTab = computed(() => {
  return route.hash || '#enderecos'
})

const items = computed(() => {
  const tabKey = activeTab.value.replace('#', '')
  return data.value?.[tabKey]?.[currentPage.value] ?? []
})

const load = async () => {
  if (import.meta.server) return

  if (loading.value) return

  const structure = activeTab.value.replace('#','')
  const cachedPageData = data.value?.[structure]?.[currentPage.value]

  // Verifica se já temos dados válidos cacheados para não fazer nova requisição
  if (Array.isArray(cachedPageData) ? cachedPageData.length > 0 : Boolean(cachedPageData)) {
    return
  }

  loading.value = true

  try {
    // Usando $fetch ao invés de useFetch
    const responseValue = await $fetch(`/api/customer/${customerId.value}/${structure}`, {
      query: {
        // token: session.token,
        page: Number(route.query.page ?? 1),
        size: 20
      }
    })

    // O $fetch já retorna o payload (corpo) da resposta direto, sem precisar de `.value`
    const normalizedItems = Array.isArray(responseValue)
        ? responseValue
        : (Array.isArray(responseValue?.data) ? responseValue.data : [])

    const pageKey = String(currentPage.value)
    const existingStructure = data.value[structure] ?? {}

    // Atualiza o reativo preservando o cache de outras abas e páginas
    data.value = {
      ...data.value,
      [structure]: {
        ...existingStructure,
        [pageKey]: normalizedItems
      }
    }
  } catch (error) {
    // O $fetch dispara erro para status 4xx e 5xx, então capturamos no bloco catch
    if (error.response?.status === 401) {
      router.push({ path: '/login', query: { redirectTo: route.fullPath } })
    } else {
      console.error("Erro ao buscar os dados:", error)
    }
  } finally {
    loading.value = false
  }
}

watch([currentPage, activeTab], async () => {
  await load()
}, { immediate: true })



</script>

<style scoped>
@reference "@/assets/css/main.css";

.button {
  @apply border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium whitespace-nowrap;
}

.active {
  @apply font-bold border-b-2 border-blue-500 text-blue-600;
}

</style>

<template>
  <div class="p-6 md:p-8 bg-gray-50 min-h-screen font-sans w-full">

    <nav class="flex text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-2">
        <li class="inline-flex items-center hover:text-blue-600 cursor-pointer">Administrativo</li>
        <li><span class="mx-2">/</span></li>
        <li class="hover:text-blue-600 cursor-pointer">Clientes</li>
        <li><span class="mx-2">/</span></li>
        <li class="text-gray-900 font-medium">Detalhes do Cliente</li>
      </ol>
    </nav>

    <header class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl font-bold">
            GE
          </div>
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-bold text-gray-900">Gráfica Exemplo Ltda</h1>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                Ativo
              </span>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              <span class="font-mono">CNPJ: 00.000.000/0001-00</span> • Cliente desde Jan/2024
            </p>
          </div>
        </div>

        <div class="flex gap-3 w-full md:w-auto">
          <button class="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
            Editar Dados
          </button>
          <button class="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Novo Orçamento / OS
          </button>
        </div>
      </div>
    </header>

    <!--- Navegação --->
    <div class="border-b border-gray-200 mb-6">
      <nav class="flex space-x-8" aria-label="Tabs">
        <!--
        <nuxt-link :to="{ hash: '#resumo' }" class="button" :class="{ active : activeTab === '#resumo' }">
          Resumo
        </nuxt-link>
        <nuxt-link :to="{ hash: '#ordem-de-servicos' }" class="button" :class="{ active : activeTab === '#ordem-de-servicos' }">
          Ordens de Serviço (45)
        </nuxt-link>
        <nuxt-link :to="{ hash: '#orcamentos' }" class="button" :class="{ active : activeTab === '#orcamentos' }">
          Orçamentos (12)
        </nuxt-link>
        -->
        <nuxt-link :to="{ hash: '#enderecos' }" class="button"  :class="{ active : activeTab === '#enderecos' }">
          Endereços
        </nuxt-link>
        <nuxt-link :to="{ hash: '#contatos' }" class="button"  :class="{ active : activeTab === '#contatos' }">
          Contatos
        </nuxt-link>
        <nuxt-link :to="{ hash: '#cores' }" class="button"  :class="{ active : activeTab === '#cores' }">
          Cores
        </nuxt-link>
      </nav>
    </div>

    <!--- Exibição --->


    <div>

      <UiDatatable :items="items">
        <template #header>
          <th class="py-3 px-4 font-semibold">#</th>
          <th class="py-3 px-4 font-semibold">
            <span v-if="activeTab === '#cores'">Cor</span>
            <span v-if="activeTab === '#enderecos'">Endereço</span>
            <span v-if="activeTab === '#contatos'">Contatos</span>
          </th>
          <th class="py-3 px-4 font-semibold text-right">Ações</th>
        </template>
        <template #row="{ item }">
          <td class="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
            {{ item.id }}
          </td>
          <td class="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
            {{ item.name }}
          </td>

          <td>Ações</td>
        </template>
      </UiDatatable>

      <nav>
        Você está na página {{ currentPage }}
        <br/>
        <nuxt-link :to="{  hash : activeTab, query: { page: currentPage-1 }}">Anterior</nuxt-link>
        <br/>
        <nuxt-link :to="{  hash : activeTab, query: { page: currentPage+1 }}">Próxima</nuxt-link>

      </nav>


    </div>


    <div v-if="false" class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div class="lg:col-span-1 space-y-6">
        <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Dados de Contato</h3>
          <dl class="space-y-4">
            <div>
              <dt class="text-xs text-gray-500">E-mail Principal</dt>
              <dd class="text-sm font-medium text-gray-900">financeiro@graficaexemplo.com</dd>
            </div>
            <div>
              <dt class="text-xs text-gray-500">Telefone</dt>
              <dd class="text-sm font-medium text-gray-900">(11) 3333-4444</dd>
            </div>
            <div>
              <dt class="text-xs text-gray-500">Responsável</dt>
              <dd class="text-sm font-medium text-gray-900">Marcos Oliveira</dd>
            </div>
          </dl>
        </section>

        <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Resumo Financeiro</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-xs text-gray-600">Total em Aberto</span>
              <span class="text-sm font-bold text-amber-600">R$ 12.450,00</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-xs text-gray-600">Última Compra</span>
              <span class="text-sm font-bold text-gray-900">12/04/2026</span>
            </div>
          </div>
        </section>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Últimas Movimentações</h3>
            <button class="text-xs text-blue-600 hover:underline">Ver histórico completo</button>
          </div>

          <div class="flow-root">
            <ul role="list" class="-mb-8">
              <li class="relative pb-8">
                <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div class="relative flex space-x-3">
                  <div>
                    <span class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                      <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                  </div>
                  <div class="min-w-0 flex-1 py-1.5">
                    <p class="text-sm text-gray-600">Novo orçamento criado <span class="font-bold text-gray-900">#1044</span> por <span class="font-medium text-gray-900">Sistema</span></p>
                    <p class="text-xs text-gray-400 mt-0.5">Há 2 horas</p>
                  </div>
                </div>
              </li>

              <li class="relative pb-8">
                <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div class="relative flex space-x-3">
                  <div>
                    <span class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                      <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                  <div class="min-w-0 flex-1 py-1.5">
                    <p class="text-sm text-gray-600">Ordem de Serviço <span class="font-bold text-gray-900">#982</span> marcada como <span class="font-bold text-green-600">Entregue</span></p>
                    <p class="text-xs text-gray-400 mt-0.5">Ontem às 14:30</p>
                  </div>
                </div>
              </li>

              <li class="relative">
                <div class="relative flex space-x-3">
                  <div>
                    <span class="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                      <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                  </div>
                  <div class="min-w-0 flex-1 py-1.5">
                    <p class="text-sm text-gray-500 italic">Cliente cadastrado no sistema</p>
                    <p class="text-xs text-gray-400 mt-0.5">15/01/2024</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>

    </div>

  </div>
</template>
