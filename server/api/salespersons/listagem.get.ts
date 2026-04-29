const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { apiServer } = config
    const { token, page, size } = getQuery(event)

    try {
        const response = await $fetch(`${apiServer}/api/salespersons`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            query: {
                page: Number(page ?? 0),
                size: Number(size ?? 20),
            }
        })
        return { success: true, data: response }
    } catch (e: any) {
        if (e.statusCode === 401) {
            throw e
        }
        return { success: false, data: null }
    }
})
