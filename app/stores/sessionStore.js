
const initalState = {
    username: "",
    nome: "",
    token: "",
}

export const sessionStore = defineStore('session', {
    state: () => (initalState),
    getters: {
        isLogged: (state) => state.token != null && state.token.length > 5,
    },
    actions: {
        login({ username, token }) {
            this.username= username;
            this.token = token;
        },
        async logout() {
            this.username= "";
            this.token = "";
        }
    },
    persist: true,
})
