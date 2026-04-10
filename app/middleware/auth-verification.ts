export default defineNuxtRouteMiddleware((to, from) => {
    // console.log('Middleware',to.query?.redirectTo , from.query?.redirectTo);
    if (to.path !== '/login') {
        return navigateTo('/login?redirectTo=' + to.path);
    }
})
