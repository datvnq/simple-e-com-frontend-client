export class ShippingMethod {
    price: number;
    method: string;

    constructor(price: number, method: string) {
        this.price = price;
        this.method = method;
    }
}
