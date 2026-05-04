const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { apiServer } = config
    const { token } = getQuery(event)
    const { id, contactId } = getRouterParams(event)

    try {
        /**
         * Return
         *
         * {
         *     "id": 1,
         *     "firstName": "Bete",
         *     "lastName": "",
         *     "jobTitle": "",
         *     "department": "",
         *     "telephone1": "13-3821-6041",
         *     "telephone2": "",
         *     "cellular": "",
         *     "fax": "",
         *     "email": "",
         *     "comments": "",
         *     "address": "",
         *     "district": "",
         *     "city": "",
         *     "zipcode": "",
         *     "extension1": null,
         *     "extension2": null
         * }
         */
        const response = await $fetch(`${apiServer}/api/customer/${id}/contact/${contactId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        })
        return { success: true, data: response }
    } catch (e: any) {
        if (e.statusCode === 401) throw e
        return { success: false, data: null, message: e.data?.error ?? 'Erro ao obter contato' }
    }
})
