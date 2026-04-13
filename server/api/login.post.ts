import { type Account } from '@/utils/models'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {

    const body: Account = await readBody(event)

    const {username, password} = body

    const {apiServer} = config

    try{
        const { token } = await $fetch(`${apiServer}/api/auth/login`, {
            method: 'POST',
            body
        })
        return {
            success : true,
            message : 'Login successful',
            token : token,
            username: username
        }
    }catch (e){
        console.log("Authentication Error", e)
        return {
            success : false,
            message : 'Login invalido',
        }
    }

})
