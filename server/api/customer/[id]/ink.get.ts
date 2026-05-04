const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { apiServer } = config
    const { token } = getQuery(event)
    const { id } = getRouterParams(event)

    try {
        /**
         * Return
         *
         * {
         *     "items": [
         *         {
         *             "id": 453,
         *             "colorName": "Colocr name",
         *             "pantoneCode": "Pantone Code"
         *         }
         *     ],
         *     "totalItems": 1,
         *     "totalPages": 1,
         *     "currentPage": 0,
         *     "pageSize": 20
         * }
         */
        const response = await $fetch(`${apiServer}/api/customer/${id}/ink`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        })
        return { success: true, data: response }
    } catch (e: any) {
        if (e.statusCode === 401) throw e
        return { success: false, data: null }
    }
})
