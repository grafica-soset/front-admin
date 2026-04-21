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
    <div>
        <form @submit.prevent="handleSubmit">

            <div>
                <label>Nome Fantasia *</label>
                <input type="text" v-model="form.name" />
                <span v-if="errors.name" style="color: red; font-size: 0.85em;">{{ errors.name }}</span>
            </div>

            <div>
                <label>Razão Social</label>
                <input type="text" v-model="form.officialName" />
            </div>

            <div>
                <label>CPF / CNPJ *</label>
                <input type="text" v-model="form.document" />
                <span v-if="errors.document" style="color: red; font-size: 0.85em;">{{ errors.document }}</span>
            </div>

            <div>
                <label>Telefone</label>
                <input type="text" v-model="form.phone" />
                <span v-if="errors.phone" style="color: red; font-size: 0.85em;">{{ errors.phone }}</span>
            </div>

            <div>
                <label>E-mail</label>
                <input type="email" v-model="form.email" />
                <span v-if="errors.email" style="color: red; font-size: 0.85em;">{{ errors.email }}</span>
            </div>

            <div>
                <label>WhatsApp</label>
                <input type="text" v-model="form.whatsapp" />
                <span v-if="errors.whatsapp" style="color: red; font-size: 0.85em;">{{ errors.whatsapp }}</span>
            </div>

            <div>
                <label>Segmento</label>
                <input type="text" v-model="form.sector" />
            </div>

            <div>
                <label>Website</label>
                <input type="text" v-model="form.website" />
            </div>

            <div>
                <label>Inscrição Estadual</label>
                <input type="text" v-model="form.inscrest" />
            </div>

            <div>
                <label>Inscrição Municipal</label>
                <input type="text" v-model="form.inscrmun" />
            </div>

            <div>
                <label>Inscrição Produtor Rural</label>
                <input type="text" v-model="form.inscprodrur" />
            </div>

            <div>
                <label>CEI</label>
                <input type="text" v-model="form.cei" />
            </div>

            <div>
                <label>Cliente Ativo</label>
                <input type="checkbox" v-model="form.active" />
            </div>

            <div>
                <label>CEP</label>
                <input type="text" v-model="form.zipcode" />
                <span v-if="errors.zipcode" style="color: red; font-size: 0.85em;">{{ errors.zipcode }}</span>
            </div>

            <div>
                <label>Rua</label>
                <input type="text" v-model="form.street" />
            </div>

            <div>
                <label>Número</label>
                <input type="text" v-model="form.number" />
            </div>

            <div>
                <label>Complemento</label>
                <input type="text" v-model="form.complement" />
            </div>

            <div>
                <label>Bairro</label>
                <input type="text" v-model="form.neighborhood" />
            </div>

            <div>
                <label>Cidade</label>
                <input type="text" v-model="form.city" />
            </div>

            <div>
                <label>Estado</label>
                <input type="text" v-model="form.state" />
            </div>

            <div>
                <label>Contador</label>
                <input type="text" v-model="form.accountantid" />
            </div>

            <div>
                <label>Vendedor</label>
                <input type="text" v-model="form.salespersonid" />
            </div>

            <button type="submit" :disabled="loading">Salvar Cliente</button>

        </form>
    </div>
</template>
