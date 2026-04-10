<script setup lang="ts">
import { type Account } from '@/utils/models'

const account = ref<Account>({} as Account)

const performLogin = async () => {
  console.log("Efetuar o login")

  const todo = await $fetch('/api/login', {
    method: 'POST',
    body: account.value,
  })

}

</script>

<template>

  <div>
    <form @submit.prevent="performLogin" >
      Login: <input name="username" type="text" required v-model="account.username" />
      Senha: <input name="password" type="text" required v-model="account.password" />
      <input type="submit" value="Enviar" />
    </form>
  </div>


</template>

<style scoped>

</style>
