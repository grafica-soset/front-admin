const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const { apiServer } = config
    const { token, ...customerData } = body

    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        const response = await $fetch(`${apiServer}/api/customer`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: customerData
        })
        return {
            success: true,
            message: 'Cliente criado com sucesso',
            data: response
        }
    } catch (e) {
        console.log("Create Customer Error", e)
        return {
            success: false,
            message: 'Erro ao criar cliente',
        }
    }

})
