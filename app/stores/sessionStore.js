import { defineStore } from 'pinia'

const initialState = {
    username: "",
    nome: "",
    token: "",
    savedUsername: "", // Novo campo para armazenar o usuário se "Lembrar-me" estiver marcado
}

export const sessionStore = defineStore('session', {
    state: () => ({ ...initialState }),
    getters: {
        isLogged: (state) => state.token != null && state.token.length > 5,
    },
    actions: {
        login({ username, token }) {
            this.username = username;
            this.token = token;
        },
        setSavedUsername(username) {
            this.savedUsername = username;
        },
        async logout() {
            this.username = "";
            this.token = "";
            this.nome = "";
            // Não limpamos o 'savedUsername' para manter a conveniência do login
        }
    },
    persist: true,
})
