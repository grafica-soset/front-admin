<script setup lang="ts">
const props = defineProps<{
  form: Record<string, any>
  mode: 'create' | 'edit'
  vendedoresOptions?: Array<{ id: number | null; label: string }>
  contadoresOptions?: Array<{ id: number | null; label: string }>
}>()

const tipoPessoa = defineModel<'pj' | 'pf'>('tipoPessoa', { default: 'pj' })

// Labels iniciais para modo edição (resolvidos a partir das options do pai)
const salespersonLabel = computed(() =>
  props.vendedoresOptions?.find(v => v.id === props.form.salespersonid)?.label ?? ''
)
const accountantLabel = computed(() =>
  props.contadoresOptions?.find(c => c.id === props.form.accountantid)?.label ?? ''
)

const buscandoCep = ref(false)

async function buscarCep() {
  const cep = (props.form.postalcode ?? '').replace(/\D/g, '')
  if (cep.length !== 8) return
  buscandoCep.value = true
  try {
    const data = await $fetch<any>(`https://viacep.com.br/ws/${cep}/json/`)
    if (data.erro) return
    props.form.address = data.logradouro ?? ''
    props.form.district = data.bairro ?? ''
    props.form.city = data.localidade ?? ''
    props.form.state = data.uf ?? ''
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

      <div class="mb-5 flex items-center gap-6">
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="tipoPessoa" type="radio" name="tipo_pessoa" value="pj" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
          <span class="text-sm font-medium text-gray-700">Pessoa Jurídica</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="tipoPessoa" type="radio" name="tipo_pessoa" value="pf" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
          <span class="text-sm font-medium text-gray-700">Pessoa Física</span>
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ tipoPessoa === 'pj' ? 'CNPJ' : 'CPF' }} <span class="text-red-500">*</span>
          </label>
          <input v-model="form.document" type="text"
            :placeholder="tipoPessoa === 'pj' ? '00.000.000/0001-00' : '000.000.000-00'"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono">
        </div>

        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ tipoPessoa === 'pj' ? 'Razão Social' : 'Nome Completo' }} <span class="text-red-500">*</span>
          </label>
          <input v-model="form.officialname" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>

        <div v-if="tipoPessoa === 'pj'" class="lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Inscrição Estadual</label>
          <input v-model="form.inscrest" type="text" placeholder="Isento ou Número"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>

        <div v-if="tipoPessoa === 'pj'" class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
          <input v-model="form.name" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>

        <div class="lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Setor / Ramo</label>
          <input v-model="form.sector" type="text" placeholder="Ex: Gráfica, Indústria..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>

        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Site</label>
          <input v-model="form.website" type="text" placeholder="https://www.empresa.com.br"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>
      </div>
    </section>

    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Dados Fiscais</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-if="tipoPessoa === 'pj'" class="lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Inscrição Municipal</label>
          <input v-model="form.inscrmun" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>
        <div v-if="tipoPessoa === 'pj'" class="lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Inscrição Produtor Rural</label>
          <input v-model="form.inscrprodrur" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>
        <div class="lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">CEI</label>
          <input v-model="form.cei" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>
      </div>
    </section>

    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Responsáveis</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
          <UiPersonField
            v-model="form.salespersonid"
            endpoint="/api/salespersons/list"
            placeholder="Buscar vendedor pelo nome..."
            :initial-label="salespersonLabel"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contador</label>
          <UiPersonField
            v-model="form.accountantid"
            endpoint="/api/accountant/list"
            placeholder="Buscar contador pelo nome..."
            :initial-label="accountantLabel"
          />
        </div>
      </div>
    </section>

    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Endereço Principal</h2>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div class="md:col-span-3 lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">CEP</label>
          <div class="flex">
            <input v-model="form.postalcode" type="text" placeholder="00000-000"
              class="w-full px-4 py-2 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <button type="button" @click="buscarCep" :disabled="buscandoCep"
              class="bg-gray-100 border-y border-r border-gray-300 px-3 rounded-r-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600 disabled:opacity-50"
              title="Buscar CEP">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="md:col-span-9 lg:col-span-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
          <input v-model="form.address" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>

        <div class="md:col-span-4 lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Número</label>
          <input v-model="form.number" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>

        <div class="md:col-span-8 lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
          <input v-model="form.complement" type="text" placeholder="Sala, Galpão..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>

        <div class="md:col-span-5 lg:col-span-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
          <input v-model="form.district" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>

        <div class="md:col-span-5 lg:col-span-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
          <input v-model="form.city" type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>

        <div class="md:col-span-2 lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">UF</label>
          <input v-model="form.state" type="text" maxlength="2"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center uppercase">
        </div>
      </div>
    </section>

  </template>

  <!-- ── MODO EDIÇÃO ─────────────────────────────────────────────────────────── -->
  <template v-else>

    <fieldset class="mb-6">
      <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Dados Gerais</legend>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-group sm:col-span-2">
          <label class="form-label">Razão Social</label>
          <input v-model="form.officialname" type="text" class="form-input" />
        </div>
        <div class="form-group sm:col-span-2">
          <label class="form-label">Nome Fantasia</label>
          <input v-model="form.name" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">CNPJ / CPF</label>
          <input v-model="form.document" type="text" class="form-input font-mono" />
        </div>
        <div class="form-group">
          <label class="form-label">Setor</label>
          <input v-model="form.sector" type="text" class="form-input" />
        </div>
        <div class="form-group sm:col-span-2">
          <label class="form-label">Website</label>
          <input v-model="form.website" type="url" class="form-input" placeholder="https://" />
        </div>
        <div class="form-group sm:col-span-2">
          <label class="form-checkbox-label cursor-pointer">
            <div class="form-checkbox-container">
              <input v-model="form.active" type="checkbox" class="form-checkbox" />
            </div>
            <div class="form-checkbox-content">
              <span class="form-label">Cliente Ativo</span>
            </div>
          </label>
        </div>
      </div>
    </fieldset>

    <fieldset class="mb-6">
      <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Responsáveis</legend>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Vendedor</label>
          <UiPersonField
            v-model="form.salespersonid"
            endpoint="/api/salespersons/list"
            placeholder="Buscar vendedor pelo nome..."
            :initial-label="salespersonLabel"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Contador</label>
          <UiPersonField
            v-model="form.accountantid"
            endpoint="/api/accountant/list"
            placeholder="Buscar contador pelo nome..."
            :initial-label="accountantLabel"
          />
        </div>
      </div>
    </fieldset>

    <fieldset class="mb-6">
      <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Endereço</legend>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="form-group sm:col-span-3">
          <label class="form-label">Endereço</label>
          <input v-model="form.address" type="text" class="form-input" />
        </div>
        <div class="form-group sm:col-span-2">
          <label class="form-label">Bairro</label>
          <input v-model="form.district" type="text" class="form-input" />
        </div>
        <div class="form-group sm:col-span-2">
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

    <fieldset>
      <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Dados Fiscais</legend>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Inscrição Estadual</label>
          <input v-model="form.inscrest" type="text" class="form-input font-mono" />
        </div>
        <div class="form-group">
          <label class="form-label">Inscrição Municipal</label>
          <input v-model="form.inscrmun" type="text" class="form-input font-mono" />
        </div>
        <div class="form-group">
          <label class="form-label">Inscrição Prod. Rural</label>
          <input v-model="form.inscrprodrur" type="text" class="form-input font-mono" />
        </div>
        <div class="form-group">
          <label class="form-label">CEI</label>
          <input v-model="form.cei" type="text" class="form-input font-mono" />
        </div>
      </div>
    </fieldset>

  </template>
</template>
