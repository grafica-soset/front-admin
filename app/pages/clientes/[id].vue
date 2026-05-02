<script setup>

const pageBreadcrumbList = [
  { label: 'Dashboard de clientes', to: '/clientes' },
  { label: 'Listagem', to: '/clientes/listagem' },
  { label: 'Detalhar' },
]

</script>
<template>
  <div class="p-6 md:p-8 bg-gray-50 min-h-screen font-sans w-full">

    <UiBreadcrumb :items="pageBreadcrumbList" />

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
              <span class="font-mono">CNPJ: 00.000.000/0001-00</span>
            </p>
          </div>
        </div>

        <div class="flex gap-3 w-full md:w-auto">
          <button class="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
            Editar Dados
          </button>
          <!--
          <button class="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Novo Orçamento / OS
          </button>
          -->
        </div>
      </div>
    </header>

    <div class="border-b border-gray-200 mb-6">
      <nav class="flex space-x-8" aria-label="Tabs">
        <!-- Neste momento não vamos trabalhar o resumo -->
        <button class="border-b-2 border-blue-500 text-blue-600 px-1 py-4 text-sm font-bold whitespace-nowrap">
          Resumo
        </button>
        <!-- Neste momento não vamos listar ordem de servicos -->
        <!--
        <button class="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium whitespace-nowrap">
          Ordens de Serviço (45)
        </button>
        -->
        <!-- Neste momento não vamos listar orçamentos -->
        <!--
        <button class="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium whitespace-nowrap">
          Orçamentos (12)
        </button>
        -->
        <!--
        <button class="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium whitespace-nowrap">
          Endereços
        </button>
        -->
        <button class="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium whitespace-nowrap">
          Contatos
        </button>
        <button class="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium whitespace-nowrap">
          Cores
        </button>
      </nav>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

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
          </dl>
        </section>

        <!--
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
        -->
      </div>

      <div class="lg:col-span-2 space-y-6">
        <!--
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
        -->
      </div>

    </div>

  </div>
</template>
