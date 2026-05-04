const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { apiServer } = config
    const { token } = getQuery(event)
    const { id } = getRouterParams(event)

    try {
        /**
         * Return
         * {
         *     "items": [
         *         {
         *             "id": 1,
         *             "firstName": "Bete",
         *             "lastName": "",
         *             "email": "",
         *             "telephone1": "13-3821-6041"
         *         }
         *     ],
         *     "totalItems": 1,
         *     "totalPages": 1,
         *     "currentPage": 0,
         *     "pageSize": 20
         * }
         *
         */
        const response = await $fetch(`${apiServer}/api/customer/${id}/contact`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        })
        return { success: true, data: response }
    } catch (e: any) {
        if (e.statusCode === 401) throw e
        return { success: false, data: null }
    }
})
