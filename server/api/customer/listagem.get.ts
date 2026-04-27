const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { apiServer } = config
    const { token, name, document, active, page, size } = getQuery(event)

    const query: Record<string, unknown> = {
        page: Number(page ?? 0),
        size: Number(size ?? 26),
    }
    if (name) query.name = name
    if (document) query.document = document
    if (active !== undefined && active !== '') query.active = active

    try {
        const response = await $fetch(`${apiServer}/api/customer`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            query
        })
        return { success: true, data: response }
    } catch (e) {
        return { success: false, data: null }
    }
})
