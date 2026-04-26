<script setup lang="ts">

const session = sessionStore()
const router = useRouter()

const token = session.token

const loading = ref(false)

const errors = ref({
    name: '',
    document: '',
    email: '',
    phone: '',
    whatsapp: '',
    zipcode: ''
})

const validate = (): boolean => {
    errors.value = { name: '', document: '', email: '', phone: '', whatsapp: '', zipcode: '' }

    if (form.value.name.trim() === '')
        errors.value.name = 'Nome é obrigatório'

    const docDigits = form.value.document.replace(/\D/g, '')
    if (docDigits === '')
        errors.value.document = 'CPF/CNPJ é obrigatório'
    else if (docDigits.length !== 11 && docDigits.length !== 14)
        errors.value.document = 'CPF deve ter 11 dígitos ou CNPJ 14'

    if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
        errors.value.email = 'E-mail inválido'

    const phoneDigits = form.value.phone.replace(/\D/g, '')
    if (phoneDigits && phoneDigits.length !== 10 && phoneDigits.length !== 11)
        errors.value.phone = 'Telefone deve ter 10 ou 11 dígitos'

    const waDigits = form.value.whatsapp.replace(/\D/g, '')
    if (waDigits && waDigits.length !== 10 && waDigits.length !== 11)
        errors.value.whatsapp = 'WhatsApp deve ter 10 ou 11 dígitos'

    const cepDigits = form.value.zipcode.replace(/\D/g, '')
    if (cepDigits && cepDigits.length !== 8)
        errors.value.zipcode = 'CEP deve ter 8 dígitos'

    return Object.values(errors.value).every(e => e === '')
}

const form = ref({
    name: '',
    officialName: '',
    document: '',
    phone: '',
    email: '',
    whatsapp: '',
    sector: '',
    website: '',
    inscrest: '',
    inscrmun: '',
    inscprodrur: '',
    cei: '',
    active: true,
    zipcode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    accountantid: '',
    salespersonid: ''
})

const handleSubmit = async () => {
    if (!validate()) return
    loading.value = true

    const { success } = await $fetch('/api/customer', {
        method: 'POST',
        body: {
            ...form.value,
            token
        }
    }).finally(() => {
        loading.value = false
    })

   if (success) {
        router.push('/clientes')
   }
}

</script>

<template>
    <div class="max-w-5xl mx-auto">

        <UiBreadcrumb :items="[{ label: 'Clientes', to: '/clientes' }, { label: 'Adicionar cliente' }]" />

        <UiPageHeader title="Adicionar cliente">
            <template #instruction>
                Preencha os dados abaixo para cadastrar um novo cliente. Apenas nome e CPF/CNPJ são obrigatórios — os demais campos podem ser preenchidos depois.
            </template>
        </UiPageHeader>

        <UiCardForm submit-label="Salvar Cliente" :loading="loading" @submitForm="handleSubmit" @cancel="router.push('/clientes')">

            <!-- Identificação -->
            <div class="form-section">
                <h2 class="form-section-title">Identificação</h2>
                <p class="form-section-desc">Dados principais do cliente</p>
            </div>
            <div class="form-section-body grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Nome Fantasia <span class="text-red-500">*</span></label>
                    <span class="form-description">Como o cliente é conhecido no mercado.</span>
                    <input type="text" v-model="form.name" placeholder="Ex: Empresa XPTO"
                        :class="['form-input', errors.name && 'form-input-error']" />
                    <p v-if="errors.name" class="form-error">
                        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                        {{ errors.name }}
                    </p>
                </div>
                <div class="form-group">
                    <label class="form-label">Razão Social</label>
                    <span class="form-description">Nome completo conforme o contrato social.</span>
                    <input type="text" v-model="form.officialName" placeholder="Razão social completa" class="form-input" />
                </div>
                <div class="form-group">
                    <label class="form-label">CPF / CNPJ <span class="text-red-500">*</span></label>
                    <input type="text" v-model="form.document" placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        :class="['form-input', errors.document && 'form-input-error']" />
                    <p v-if="errors.document" class="form-error">
                        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                        {{ errors.document }}
                    </p>
                </div>
                <div class="form-group">
                    <label class="form-label">Segmento</label>
                    <input type="text" v-model="form.sector" placeholder="Ex: Tecnologia, Saúde..." class="form-input" />
                </div>
                <div class="form-group sm:col-span-2">
                    <label class="form-label">Website</label>
                    <input type="text" v-model="form.website" placeholder="https://exemplo.com.br" class="form-input" />
                </div>
            </div>

            <!-- Contato -->
            <div class="form-section">
                <h2 class="form-section-title">Contato</h2>
            </div>
            <div class="form-section-body grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div class="form-group">
                    <label class="form-label">E-mail</label>
                    <input type="email" v-model="form.email" placeholder="contato@empresa.com.br"
                        :class="['form-input', errors.email && 'form-input-error']" />
                    <p v-if="errors.email" class="form-error">
                        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                        {{ errors.email }}
                    </p>
                </div>
                <div class="form-group">
                    <label class="form-label">Telefone</label>
                    <input type="text" v-model="form.phone" placeholder="(00) 0000-0000"
                        :class="['form-input', errors.phone && 'form-input-error']" />
                    <p v-if="errors.phone" class="form-error">
                        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                        {{ errors.phone }}
                    </p>
                </div>
                <div class="form-group">
                    <label class="form-label">WhatsApp</label>
                    <input type="text" v-model="form.whatsapp" placeholder="(00) 00000-0000"
                        :class="['form-input', errors.whatsapp && 'form-input-error']" />
                    <p v-if="errors.whatsapp" class="form-error">
                        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                        {{ errors.whatsapp }}
                    </p>
                </div>
            </div>

            <!-- Dados Fiscais -->
            <div class="form-section">
                <h2 class="form-section-title">Dados Fiscais</h2>
            </div>
            <div class="form-section-body grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Inscrição Estadual</label>
                    <input type="text" v-model="form.inscrest" class="form-input" />
                </div>
                <div class="form-group">
                    <label class="form-label">Inscrição Municipal</label>
                    <input type="text" v-model="form.inscrmun" class="form-input" />
                </div>
                <div class="form-group">
                    <label class="form-label">Inscrição Produtor Rural</label>
                    <input type="text" v-model="form.inscprodrur" class="form-input" />
                </div>
                <div class="form-group">
                    <label class="form-label">CEI</label>
                    <input type="text" v-model="form.cei" class="form-input" />
                </div>
            </div>

            <!-- Endereço -->
            <div class="form-section">
                <h2 class="form-section-title">Endereço</h2>
            </div>
            <div class="form-section-body grid grid-cols-1 gap-5 sm:grid-cols-6">
                <div class="form-group sm:col-span-2">
                    <label class="form-label">CEP</label>
                    <input type="text" v-model="form.zipcode" placeholder="00000-000"
                        :class="['form-input', errors.zipcode && 'form-input-error']" />
                    <p v-if="errors.zipcode" class="form-error">
                        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                        {{ errors.zipcode }}
                    </p>
                </div>
                <div class="form-group sm:col-span-3">
                    <label class="form-label">Rua</label>
                    <input type="text" v-model="form.street" placeholder="Nome da rua, avenida..." class="form-input" />
                </div>
                <div class="form-group sm:col-span-1">
                    <label class="form-label">Número</label>
                    <input type="text" v-model="form.number" placeholder="Nº" class="form-input" />
                </div>
                <div class="form-group sm:col-span-3">
                    <label class="form-label">Complemento</label>
                    <input type="text" v-model="form.complement" placeholder="Apto, sala, bloco..." class="form-input" />
                </div>
                <div class="form-group sm:col-span-3">
                    <label class="form-label">Bairro</label>
                    <input type="text" v-model="form.neighborhood" class="form-input" />
                </div>
                <div class="form-group sm:col-span-4">
                    <label class="form-label">Cidade</label>
                    <input type="text" v-model="form.city" class="form-input" />
                </div>
                <div class="form-group sm:col-span-2">
                    <label class="form-label">Estado</label>
                    <input type="text" v-model="form.state" placeholder="SP" class="form-input" />
                </div>
            </div>

            <!-- Interno -->
            <div class="form-section">
                <h2 class="form-section-title">Interno</h2>
                <p class="form-section-desc">Vínculos internos e status do cliente</p>
            </div>
            <div class="form-section-body grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Contador</label>
                    <input type="text" v-model="form.accountantid" class="form-input" />
                </div>
                <div class="form-group">
                    <label class="form-label">Vendedor</label>
                    <input type="text" v-model="form.salespersonid" class="form-input" />
                </div>
            </div>

            <template #footer-left>
                <label class="form-checkbox-label">
                    <span class="form-checkbox-container">
                        <input type="checkbox" v-model="form.active" class="form-checkbox" />
                    </span>
                    <span class="form-checkbox-content">
                        <span class="form-label mb-0">Cliente Ativo</span>
                        <span class="form-description">Clientes inativos não aparecem nas buscas padrão.</span>
                    </span>
                </label>
            </template>

        </UiCardForm>

    </div>
</template>
