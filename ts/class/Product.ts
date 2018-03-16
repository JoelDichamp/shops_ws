export class Product {

    private label: string;
    private price: number;
    private image: string;

    constructor( label: string, price: number, image: string) {
        this.label = label;
        this.price = price;
        this.image = image;
    }

    getLabel(): string {
        return this.label;
    }

    getPrice(): number {
        return this.price;
    }

    getImage(): string {
        return  this.image;
    }
}