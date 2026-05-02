const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { apiServer } = config
    const { token, name, document, active, page, size } = getQuery(event)

    const query: Record<string, unknown> = {
        page: Number(page ?? 0),
        size: Number(size ?? 20),
    }
    if (name) query.name = name
    if (document) query.document = document
    if (active !== undefined && active !== '') query.active = active


    /**
     * Return
     *
     * {
     *     "items": [
     *         {
     *             "id": 12368,
     *             "name": "",
     *             "officialName": "14ª Batalhão de Polícia Militar do Interior",
     *             "document": "",
     *             "state": "SP",
     *             "city": "Registro"
     *         },
     *     ],
     *     "totalItems": 12144,
     *     "totalPages": 608,
     *     "currentPage": 0,
     *     "pageSize": 20
     * }
     */
    try {
        const response = await $fetch(`${apiServer}/api/customer`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            query
        })
        return { success: true, data: response }
    } catch (e: any) {
        if (e.statusCode === 401) {
            throw e;
        }
        return { success: false, data: null }
    }
})
