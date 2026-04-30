const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { apiServer } = config
    const { token, name, page, size } = getQuery(event)

    const query: Record<string, unknown> = {
        page: Number(page ?? 0),
        size: Number(size ?? 20),
    }
    if (name) query.filter = name

    try {
        const response = await $fetch(`${apiServer}/api/accountant`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            query
        })
        return { success: true, data: response }
    } catch (e: any) {
        if (e.statusCode === 401) {
            throw e
        }
        return { success: false, data: null }
    }
})
