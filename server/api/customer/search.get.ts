import { type Account } from '~/utils/models'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {

    const {apiServer} = config
    const { search , token } = getQuery(event)

    console.log("Busccar cliente ", search)

    try{
        const response = await $fetch(`${apiServer}/api/customer`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            query : {
                query : search
            }
        })
        console.log("Buscar cliente response",response)
        return {
            success : true,
            message : 'Clientes encontrados',
            list: response
        }
    }catch (e: any){
        if (e.statusCode === 401) {
            throw e;
        }
        console.log("Fetch Customer Error", e)
        return {
            success : false,
            message : 'Error fetching customers',
        }
    }


})
