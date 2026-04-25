const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { token } = getQuery(event)
  const { apiServer } = config

  try {
    await $fetch(`${apiServer}/api/customer/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      body: {}
    })
    return { success: true }
  } catch (e) {
    console.log('Delete Customer Error', e)
    return { success: false, message: 'Erro ao excluir cliente' }
  }
})
