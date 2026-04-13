<script setup lang="ts">
import { type Account } from '@/utils/models'
import { sessionStore } from "~/stores/sessionStore";

const session = sessionStore()
const router = useRouter()
const route = useRoute()

const account = ref<Account>({
  username: "test",
  password: "password123",
} as Account)


const performLogin = async () => {
  console.log("Efetuar o login")

  const { success, message, token, username } = await $fetch('/api/login', {
    method: 'POST',
    body: account.value,
  })

  if(success) {
    session.login({username, token})
    await router.push( route.query.redirectTo ? String(route.query.redirectTo) : '/' )
  }else {
    alert('Cai fora')
  }

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
