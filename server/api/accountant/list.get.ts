const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { apiServer } = config
    const { token, name } = getQuery(event)

    const query: Record<string, unknown> = {}
    if (name) query.name = name

    try {
        /**
         * Return
         *
         * [
         *     {
         *         "key": 189,
         *         "value": "João da Silva"
         *     },
         *     {
         *         "key": 125,
         *         "value": "João Popadiuk Neto"
         *     },
         *     {
         *         "key": 39,
         *         "value": "José Camargo (Zezo)"
         *     },
         *     {
         *         "key": 87,
         *         "value": "Jose Goncalves Passos"
         *     },
         *     {
         *         "key": 6,
         *         "value": "Unicel Contab. João Vitorino"
         *     }
         * ]
         */
        const response = await $fetch(`${apiServer}/api/accountant/list`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            query
        })
        return { success: true, data: response }
    } catch (e: any) {
        if (e.statusCode === 401) throw e
        return { success: false, data: null }
    }
})
