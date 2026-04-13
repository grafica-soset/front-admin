export interface Account {

    username: string
    password: string
}

export interface Customer {
    id: number,
    name: string,
    officialName: string
    cnpj: string
    cpf: string
    state: string
    city: string
}
