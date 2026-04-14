<script setup lang="ts">

const session = sessionStore()
const router = useRouter()

const token = session.token

const loading = ref(false)

const form = ref({
    name: '',
    officialName: '',
    document: '',
    state: '',
    city: ''
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
                <label>Nome</label>
                <input type="text" v-model="form.name" />
            </div>

            <div>
                <label>Razão Social</label>
                <input type="text" v-model="form.officialName" />
            </div>

            <div>
                <label>CNPJ/CPF</label>
                <input type="text" v-model="form.document" />
            </div>

            <div>
                <label>Estado</label>
                <input type="text" v-model="form.state" />
            </div>

            <div>
                <label>Cidade</label>
                <input type="text" v-model="form.city" />
            </div>

            <button type="submit" :disabled="loading">Salvar Cliente</button>

        </form>
    </div>
</template>
