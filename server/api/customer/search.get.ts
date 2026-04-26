const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { apiServer } = config
  const { search, token } = getQuery(event)

  try {
    const [fullResults, allByName] = await Promise.all([
      $fetch<any[]>(`${apiServer}/api/customer/fulltext`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        query: { query: search }
      }),
      $fetch<any>(`${apiServer}/api/customer`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        query: { active: false, name: search, size: 100 }
      })
    ])

    const activeIds = new Set((fullResults ?? []).map((c: any) => c.id))

    const activeList = (fullResults ?? []).map((c: any) => ({ ...c, active: true }))

    const inactiveList = (allByName?.items ?? [])
      .filter((c: any) => !activeIds.has(c.id))
      .map((c: any) => ({ ...c, active: false }))

    return { success: true, list: [...activeList, ...inactiveList] }
  } catch (e) {
    console.log('Fetch Customer Error', e)
    return { success: false, list: [] }
  }
})
