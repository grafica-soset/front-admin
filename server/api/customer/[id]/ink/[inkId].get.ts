const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { apiServer } = config
    const { token } = getQuery(event)
    const { id, inkId } = getRouterParams(event)

    try {
        /**
         * Return
         *
         * {
         *     "id": 453,
         *     "colorName": "Colocr name",
         *     "pantoneCode": "Pantone Code"
         * }
         *
         */
        const response = await $fetch(`${apiServer}/api/customer/${id}/ink/${inkId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        })
        return { success: true, data: response }
    } catch (e: any) {
        if (e.statusCode === 401) throw e
        return { success: false, data: null, message: e.data?.error ?? 'Erro ao obter cor' }
    }
})
