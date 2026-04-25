const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { token, query } = getQuery(event)
  const { apiServer } = config

  if (!query) return { success: false, data: null }

  try {
    const response = await $fetch<any[]>(`${apiServer}/api/customer/fulltext`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      query: { query }
    })

    const customer = response?.find((c: any) => String(c.id) === String(id)) ?? null
    return { success: true, data: customer }
  } catch (e) {
    console.log('Get Customer Error', e)
    return { success: false, data: null }
  }
})
