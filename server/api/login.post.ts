import { type Account } from '@/utils/models'

export default defineEventHandler(async (event) => {

    const body: Account = await readBody(event)


    const {username, password} = body

    console.log("Servidor", username, password)

    if( username == "test" && password == "password1234" ){
        return {
            success : true,
            message : 'Login successful',
            token : "token",
            username: "login"
        }
    }else{
        return {
            success : false,
            message : 'Login invalido',
        }
    }

})
