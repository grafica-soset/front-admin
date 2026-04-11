import { sessionStore } from "~/stores/sessionStore";

export default defineNuxtRouteMiddleware((to, from) => {
    // console.log('Middleware',to.query?.redirectTo , from.query?.redirectTo);
    const store = sessionStore();
    console.log( "Session", store.isLogged )
    if (!store.isLogged && to.path !== '/login') {
        return navigateTo({
            path: '/login',
            query: { redirectTo: to.fullPath },
        });
    }

})
