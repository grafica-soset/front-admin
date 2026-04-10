export const sessionStore = defineStore('session', {
    state: () => ({
        username: "",
        nome: "",
        token: "",
    }),
    getters: {
        isLogged: (state) => state.token != null && state.token.length > 5,
    },
    actions: {
        login({ username, token }) {

            console.log("LOGIN", username, token)

            this.username= username;
            this.token = token;
        },
    },
    persist: true,
})
