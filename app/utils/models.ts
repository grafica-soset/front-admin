export interface Account {

    username: string
    password: string
}

export interface Customer {
    id: number,
    name: string,
    officialName: string
    document: string
    state: string
    city: string
    active?: boolean
}

export const formatDocument = (doc: string): string => {
    const digits = doc?.replace(/\D/g, '') ?? ''
    if (digits.length === 11) {
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    if (digits.length === 14) {
        return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    return doc ?? ''
}
