<script setup lang="ts">

const session = sessionStore()
const router = useRouter()

const token = session.token

const loading = ref(false)

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
                <label>Nome Fantasia</label>
                <input type="text" v-model="form.name" />
            </div>

            <div>
                <label>Razão Social</label>
                <input type="text" v-model="form.officialName" />
            </div>

            <div>
                <label>CPF / CNPJ</label>
                <input type="text" v-model="form.document" />
            </div>

            <div>
                <label>Telefone</label>
                <input type="text" v-model="form.phone" />
            </div>

            <div>
                <label>E-mail</label>
                <input type="email" v-model="form.email" />
            </div>

            <div>
                <label>WhatsApp</label>
                <input type="text" v-model="form.whatsapp" />
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
