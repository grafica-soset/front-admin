const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { apiServer } = config
  const { token, officialName, street, neighborhood, zipcode, inscprodrur, salespersonid, accountantid, phone, email, whatsapp, number, complement, document, ...rest } = body

  const customerData = {
    ...rest,
    document: document || null,
    officialname: officialName || null,
    address: street || null,
    district: neighborhood || null,
    postalcode: zipcode || null,
    inscrprodrur: inscprodrur || null,
    salespersonid: salespersonid ? Number(salespersonid) : null,
    accountantid: accountantid ? Number(accountantid) : null,
  }

  try {
    const response = await $fetch(`${apiServer}/api/customer/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: customerData
    })
    return { success: true, data: response }
  } catch (e) {
    console.log('Update Customer Error', e)
    return { success: false, message: 'Erro ao atualizar cliente' }
  }
})
