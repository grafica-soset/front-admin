const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { apiServer } = config
    const { token } = getQuery(event)
    const { id } = getRouterParams(event)

    try {
        const response = await $fetch(`${apiServer}/api/salespersons/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })
        return { success: true, data: response }
    } catch (e: any) {
        if (e.statusCode === 401) throw e
        return { success: false, data: null, message: e.data?.error ?? 'Erro ao deletar vendedor' }
    }
})
