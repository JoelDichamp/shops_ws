import { Seller } from "./Seller";
import { Product } from "./Product";

export class Shop {

    private shop: string;
    private localisation: google.maps.LatLng;
    private sellers_shop: Seller[] = [];
    private products_shop: Product[] = [];

    constructor( shop: string, localisation: google.maps.LatLng ) {
        this.shop = shop;
        this.localisation = localisation;
    }

    getShop(): string {
        return this.shop;
    }

    getLocalisation(): google.maps.LatLng {
        return this.localisation;
    }

    getSellers_shop(): Seller[] {
        return this.sellers_shop;
    }

    getProducts_shop(): Product[] {
        return this.products_shop;
    }

    addSeller_shop( seller: Seller ) {
        this.sellers_shop.push( seller );
    }

    addProduct_shop( product: Product ) {
        this.products_shop.push( product );
    }

    //méthode magique pour JSON.stringify
    toJSON(): {shop: string, localisation: google.maps.LatLng , sellers_shop: Seller[], products_shop: Product[]} {
        return {
            shop: this.shop,
            localisation: this.localisation,
            sellers_shop: this.sellers_shop,
            products_shop: this.products_shop
        };
    }
}