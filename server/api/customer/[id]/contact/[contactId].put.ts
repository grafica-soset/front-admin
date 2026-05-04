const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { apiServer } = config
    const { token } = getQuery(event)
    const { id, contactId } = getRouterParams(event)
    const body = await readBody(event)

    try {
        const response = await $fetch(`${apiServer}/api/customer/${id}/contact/${contactId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body
        })
        return { success: true, data: response }
    } catch (e: any) {
        if (e.statusCode === 401) throw e
        return { success: false, data: null, message: e.data?.error ?? 'Erro ao atualizar contato' }
    }
})
