<script setup>
const breadcrumb = [
  { label: 'Dashboard de Clientes', to: '/clientes' },
  { label: 'Todos os Clientes', to: '/clientes/listagem' },
  { label: 'Novo Cliente' }
]
</script>
<template>
  <div class="p-6 md:p-8 bg-gray-50 min-h-screen font-sans w-full">

    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <UiBreadcrumb :items="breadcrumb" />
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Cadastrar Cliente</h1>
        <p class="text-sm text-gray-500 mt-1">Preencha os dados abaixo para adicionar um novo cliente ao sistema.</p>
      </div>

      <div class="flex gap-3 w-full md:w-auto">
        <button type="button" class="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="button" class="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          Salvar Cliente
        </button>
      </div>
    </header>

    <form class="space-y-6">

      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Dados Principais</h2>

        <div class="mb-5 flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="tipo_pessoa" value="pj" checked class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
            <span class="text-sm font-medium text-gray-700">Pessoa Jurídica</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="tipo_pessoa" value="pf" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
            <span class="text-sm font-medium text-gray-700">Pessoa Física</span>
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="lg:col-span-1">
            <label for="cnpj" class="block text-sm font-medium text-gray-700 mb-1">CNPJ <span class="text-red-500">*</span></label>
            <input type="text" id="cnpj" placeholder="00.000.000/0001-00" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono">
          </div>

          <div class="lg:col-span-2">
            <label for="razao_social" class="block text-sm font-medium text-gray-700 mb-1">Razão Social / Nome Completo <span class="text-red-500">*</span></label>
            <input type="text" id="razao_social" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="lg:col-span-1">
            <label for="ie" class="block text-sm font-medium text-gray-700 mb-1">Inscrição Estadual</label>
            <input type="text" id="ie" placeholder="Isento ou Número" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="lg:col-span-2">
            <label for="nome_fantasia" class="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
            <input type="text" id="nome_fantasia" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
        </div>
      </section>

      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Informações de Contato</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-1">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail Principal <span class="text-red-500">*</span></label>
            <input type="email" id="email" placeholder="contato@empresa.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="lg:col-span-1">
            <label for="celular" class="block text-sm font-medium text-gray-700 mb-1">Celular / WhatsApp <span class="text-red-500">*</span></label>
            <input type="text" id="celular" placeholder="(00) 90000-0000" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="lg:col-span-1">
            <label for="telefone" class="block text-sm font-medium text-gray-700 mb-1">Telefone Fixo</label>
            <input type="text" id="telefone" placeholder="(00) 0000-0000" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="lg:col-span-1">
            <label for="responsavel" class="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável</label>
            <input type="text" id="responsavel" placeholder="Ex: João Silva (Compras)" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
        </div>
      </section>

      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <h2 class="text-base font-bold text-gray-900">Endereço Principal</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3 lg:col-span-2 relative">
            <label for="cep" class="block text-sm font-medium text-gray-700 mb-1">CEP <span class="text-red-500">*</span></label>
            <div class="flex">
              <input type="text" id="cep" placeholder="00000-000" class="w-full px-4 py-2 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <button type="button" class="bg-gray-100 border-y border-r border-gray-300 px-3 rounded-r-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600" title="Buscar CEP">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="md:col-span-9 lg:col-span-6">
            <label for="logradouro" class="block text-sm font-medium text-gray-700 mb-1">Logradouro (Rua, Av, etc) <span class="text-red-500">*</span></label>
            <input type="text" id="logradouro" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50" readonly>
          </div>

          <div class="md:col-span-4 lg:col-span-2">
            <label for="numero" class="block text-sm font-medium text-gray-700 mb-1">Número <span class="text-red-500">*</span></label>
            <input type="text" id="numero" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="md:col-span-8 lg:col-span-2">
            <label for="complemento" class="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
            <input type="text" id="complemento" placeholder="Sala, Galpão..." class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="md:col-span-5 lg:col-span-4">
            <label for="bairro" class="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
            <input type="text" id="bairro" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50" readonly>
          </div>

          <div class="md:col-span-5 lg:col-span-6">
            <label for="cidade" class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input type="text" id="cidade" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50" readonly>
          </div>

          <div class="md:col-span-2 lg:col-span-2">
            <label for="uf" class="block text-sm font-medium text-gray-700 mb-1">UF</label>
            <input type="text" id="uf" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 text-center" readonly>
          </div>
        </div>
      </section>

      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button type="button" class="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" class="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          Salvar Cliente
        </button>
      </div>

    </form>
  </div>
</template>
