const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { apiServer } = config
  const { search, token } = getQuery(event)

  try {
    const response = await $fetch<any[]>(`${apiServer}/api/customer/fulltext`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      query: { query: search }
    })
    return { success: true, list: response ?? [] }
  } catch (e) {
    console.log('Fetch Customer Error', e)
    return { success: false, list: [] }
  }
})
