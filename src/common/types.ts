export type Product = {
    id: number,
    productName: string,
    specialOffer: number,
    normalPrice: number,
    imageName: string,
    description: string,
}

export type Cart = {
    price: number,
    items: Item[]
}

export type Item = {
    id: number,
    amount: number
}