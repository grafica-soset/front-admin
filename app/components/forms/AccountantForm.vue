<script setup lang="ts">
defineProps<{
  form: Record<string, any>
  mode: 'create' | 'edit'
}>()

const buscandoCep = ref(false)

async function buscarCep() {
  const cep = (form.postalcode ?? '').replace(/\D/g, '')
  if (cep.length !== 8) return
  buscandoCep.value = true
  try {
    const data = await $fetch<any>(`https://viacep.com.br/ws/${cep}/json/`)
    if (data.erro) return
    form.address  = data.logradouro ?? ''
    form.district = data.bairro     ?? ''
    form.city     = data.localidade ?? ''
    form.state    = data.uf         ?? ''
  } catch {
    // silencioso
  } finally {
    buscandoCep.value = false
  }
}
</script>

<template>
  <!-- ── MODO CADASTRO ───────────────────────────────────────────────────────── -->
  <template v-if="mode === 'create'">

    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Dados Principais</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome <span class="text-red-500">*</span></label>
          <input v-model="form.name" type="text" placeholder="Ex: Escritório Contábil XYZ"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input v-model="form.email" type="email" placeholder="contato@escritorio.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input v-model="form.website" type="text" placeholder="www.escritorio.com.br"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Telefone 1</label>
          <input v-model="form.telephone1" type="text" placeholder="(00) 0000-0000"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Telefone 2</label>
          <input v-model="form.telephone2" type="text" placeholder="(00) 0000-0000"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fax</label>
          <input v-model="form.fax" type="text" placeholder="(00) 0000-0000"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
      </div>
    </section>

    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Endereço</h2>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div class="md:col-span-3 lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">CEP</label>
          <div class="flex">
            <input v-model="form.postalcode" type="text" placeholder="00000-000"
              class="w-full px-4 py-2 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            <button type="button" @click="buscarCep" :disabled="buscandoCep"
              class="bg-gray-100 border-y border-r border-gray-300 px-3 rounded-r-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600 disabled:opacity-50"
              title="Buscar CEP">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="md:col-span-9 lg:col-span-7">
          <label class="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
          <input v-model="form.address" type="text" placeholder="Rua, Av, etc"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div class="md:col-span-3 lg:col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
          <input v-model="form.district" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div class="md:col-span-7 lg:col-span-8">
          <label class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
          <input v-model="form.city" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div class="md:col-span-2 lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">UF</label>
          <input v-model="form.state" type="text" maxlength="2"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center uppercase" />
        </div>
      </div>
    </section>

  </template>

  <!-- ── MODO EDIÇÃO ─────────────────────────────────────────────────────────── -->
  <template v-else>

    <fieldset class="mb-6">
      <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Dados Principais</legend>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-group sm:col-span-2">
          <label class="form-label">Nome <span class="text-red-500">*</span></label>
          <input v-model="form.name" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">E-mail</label>
          <input v-model="form.email" type="email" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Website</label>
          <input v-model="form.website" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Telefone 1</label>
          <input v-model="form.telephone1" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Telefone 2</label>
          <input v-model="form.telephone2" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Fax</label>
          <input v-model="form.fax" type="text" class="form-input" />
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Endereço</legend>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-group sm:col-span-2">
          <label class="form-label">Logradouro</label>
          <input v-model="form.address" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Bairro</label>
          <input v-model="form.district" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Cidade</label>
          <input v-model="form.city" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Estado</label>
          <input v-model="form.state" type="text" class="form-input" maxlength="2" />
        </div>
        <div class="form-group">
          <label class="form-label">CEP</label>
          <input v-model="form.postalcode" type="text" class="form-input font-mono" />
        </div>
      </div>
    </fieldset>

  </template>
</template>
