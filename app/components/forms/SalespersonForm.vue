<script setup lang="ts">
defineProps<{
  form: Record<string, any>
  mode: 'create' | 'edit'
}>()
</script>

<template>
  <!-- ── MODO CADASTRO ───────────────────────────────────────────────────────── -->
  <template v-if="mode === 'create'">
    <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Dados do Vendedor</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome <span class="text-red-500">*</span></label>
          <input v-model="form.firstName" type="text" placeholder="Ex: João"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Sobrenome <span class="text-red-500">*</span></label>
          <input v-model="form.lastName" type="text" placeholder="Ex: Silva"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div class="lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Código <span class="text-red-500">*</span></label>
          <input v-model="form.personCode" type="text" placeholder="Ex: JS" maxlength="2"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono uppercase" />
        </div>
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input v-model="form.telephone" type="text" placeholder="(00) 0000-0000"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Celular</label>
          <input v-model="form.cellular" type="text" placeholder="(00) 90000-0000"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
      </div>
    </section>
  </template>

  <!-- ── MODO EDIÇÃO ─────────────────────────────────────────────────────────── -->
  <template v-else>
    <fieldset>
      <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Dados do Vendedor</legend>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Nome <span class="text-red-500">*</span></label>
          <input v-model="form.firstName" type="text" class="form-input" placeholder="Ex: João" />
        </div>
        <div class="form-group">
          <label class="form-label">Sobrenome <span class="text-red-500">*</span></label>
          <input v-model="form.lastName" type="text" class="form-input" placeholder="Ex: Silva" />
        </div>
        <div class="form-group">
          <label class="form-label">Código <span class="text-red-500">*</span></label>
          <input v-model="form.personCode" type="text" class="form-input font-mono uppercase" maxlength="2" placeholder="Ex: JS" />
        </div>
        <div class="form-group">
          <label class="form-label">Telefone</label>
          <input v-model="form.telephone" type="text" class="form-input" placeholder="(00) 0000-0000" />
        </div>
        <div class="form-group">
          <label class="form-label">Celular</label>
          <input v-model="form.cellular" type="text" class="form-input" placeholder="(00) 90000-0000" />
        </div>
      </div>
    </fieldset>
  </template>
</template>
