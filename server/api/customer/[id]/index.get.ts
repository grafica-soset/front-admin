const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { apiServer } = config
    const { token } = getQuery(event)
    const { id } = getRouterParams(event)

    /**
     * Return
     *
     * {
     *     "id": 1,
     *     "name": "",
     *     "officialname": "Canarinho E Roxinol",
     *     "document": "",
     *     "sector": "",
     *     "website": "",
     *     "inscrest": "",
     *     "inscrmun": "",
     *     "inscrprodrur": "",
     *     "cei": "",
     *     "salespersonid": 3,
     *     "accountantid": 128,
     *     "active": true,
     *     "address": "",
     *     "district": "",
     *     "city": "Registro",
     *     "postalcode": "11900-000",
     *     "state": ""
     * }
     */
    try {
        const response = await $fetch(`${apiServer}/api/customer/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        })
        return { success: true, data: response }
    } catch (e: any) {
        if (e.statusCode === 401) throw e
        return { success: false, data: null }
    }
})
