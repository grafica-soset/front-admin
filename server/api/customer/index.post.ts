const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
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
    const response = await $fetch(`${apiServer}/api/customer`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: customerData
    })
    return { success: true, message: 'Cliente criado com sucesso', data: response }
  } catch (e: any) {
    console.log('Create Customer Error', e)
    const backendMessage = e?.data?.error || e?.data?.message
    return { success: false, message: backendMessage || 'Erro ao criar cliente' }
  }
})
