const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { token } = getQuery(event)
  const { apiServer } = config

  try {
    const data = await $fetch<any>(`${apiServer}/api/customer/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data }
  } catch (e) {
    console.log('Get Customer Error', e)
    return { success: false, data: null }
  }
})
