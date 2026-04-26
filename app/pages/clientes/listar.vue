<template>
  <div class="p-6 md:p-8 bg-gray-50 min-h-screen font-sans w-full">

    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <nav class="flex text-sm text-gray-500 mb-1" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-2">
            <li class="inline-flex items-center hover:text-blue-600 cursor-pointer">Administrativo</li>
            <li><span class="mx-2">/</span></li>
            <li class="text-gray-900 font-medium">Clientes</li>
          </ol>
        </nav>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Todos os Clientes</h1>
      </div>

      <button class="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Novo Cliente
      </button>
    </header>

    <section class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

        <div class="md:col-span-2">
          <label for="search-name" class="block text-sm font-medium text-gray-700 mb-1">Nome ou Razão Social</label>
          <input
              type="text"
              id="search-name"
              placeholder="Ex: Gráfica Exemplo"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          >
        </div>

        <div>
          <label for="search-doc" class="block text-sm font-medium text-gray-700 mb-1">CPF / CNPJ</label>
          <input
              type="text"
              id="search-doc"
              placeholder="Apenas números..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          >
        </div>

        <div>
          <label for="search-status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
              id="search-status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white"
          >
            <option value="todos">Todos</option>
            <option value="ativos">Apenas Ativos</option>
            <option value="inativos">Inativos</option>
          </select>
        </div>

        <div class="md:col-span-4 flex justify-end gap-3 mt-2">
          <button type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-colors">
            Limpar Filtros
          </button>
          <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:ring-2 focus:ring-gray-300 transition-colors">
            Buscar
          </button>
        </div>
      </form>
    </section>

    <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 w-full overflow-x-auto">
      <table class="w-full text-left border-collapse whitespace-nowrap">
        <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
          <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documento</th>
          <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contato Principal</th>
          <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">

        <tr class="hover:bg-blue-50/50 transition-colors group">
          <td class="px-6 py-4">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-gray-900">Gráfica Exemplo Ltda</span>
              <span class="text-xs text-gray-500">Cadastrado em 15/01/2024</span>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-600 font-mono">00.000.000/0001-00</td>
          <td class="px-6 py-4">
            <div class="flex flex-col">
              <span class="text-sm text-gray-800">(11) 3333-4444</span>
              <span class="text-xs text-gray-500">contato@exemplo.com</span>
            </div>
          </td>
          <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Ativo
              </span>
          </td>
          <td class="px-6 py-4 text-right text-sm font-medium">
            <button class="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
              Detalhes
            </button>
          </td>
        </tr>

        <tr class="hover:bg-blue-50/50 transition-colors group">
          <td class="px-6 py-4">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-gray-900">Papelaria Central</span>
              <span class="text-xs text-gray-500">Cadastrado em 22/02/2024</span>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-600 font-mono">11.111.111/0001-11</td>
          <td class="px-6 py-4">
            <div class="flex flex-col">
              <span class="text-sm text-gray-800">(11) 98888-7777</span>
              <span class="text-xs text-gray-500">compras@central.com.br</span>
            </div>
          </td>
          <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Ativo
              </span>
          </td>
          <td class="px-6 py-4 text-right text-sm font-medium">
            <button class="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
              Detalhes
            </button>
          </td>
        </tr>

        <tr class="hover:bg-gray-50 transition-colors group">
          <td class="px-6 py-4">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-gray-500">João da Silva ME</span>
              <span class="text-xs text-gray-400">Cadastrado em 10/11/2023</span>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-400 font-mono">222.222.222-22</td>
          <td class="px-6 py-4">
            <div class="flex flex-col">
              <span class="text-sm text-gray-400">(11) 95555-4444</span>
              <span class="text-xs text-gray-400">-</span>
            </div>
          </td>
          <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                Inativo
              </span>
          </td>
          <td class="px-6 py-4 text-right text-sm font-medium">
            <button class="text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
              Detalhes
            </button>
          </td>
        </tr>

        </tbody>
      </table>
    </section>

    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-sm text-gray-500">
        Exibindo <span class="font-medium text-gray-900">1</span> a <span class="font-medium text-gray-900">10</span> de <span class="font-medium text-gray-900">150</span> resultados
      </p>

      <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span class="sr-only">Anterior</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <button aria-current="page" class="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
          1
        </button>
        <button class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
          2
        </button>
        <button class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium">
          3
        </button>
        <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          ...
        </span>
        <button class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
          15
        </button>
        <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span class="sr-only">Próximo</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>

  </div>
</template>
