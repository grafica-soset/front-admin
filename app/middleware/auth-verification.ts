export default defineNuxtRouteMiddleware((to, from) => {

    console.log('Middleware',to, from);

    if (to.path !== '/login') {
        return navigateTo('/login')
    }
})
