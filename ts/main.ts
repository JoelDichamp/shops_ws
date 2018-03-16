import { App } from "./class/App";
import { Shop } from "./class/Shop";

const app: App = new App("map");
app.getShopsFromLocalStorage();

const li_shop: HTMLInputElement = document.getElementById('li-shop') as HTMLInputElement;
const li_seller: HTMLInputElement = document.getElementById('li-seller') as HTMLInputElement;
const li_product: HTMLInputElement = document.getElementById('li-product') as HTMLInputElement;

li_shop.onclick = function() {
    app.putDivInterface( 'div-shop' );
};

app.form_shop.onsubmit = function( event: Event ) {
    event.preventDefault();
    app.addShop();
};

li_seller.onclick = function() {
    app.createFormSeller();
};

app.form_seller.onsubmit = function( event: Event ){
    event.preventDefault();
    app.addSeller();
};

li_product.onclick = function() {
    app.createFormProduct();
};

app.form_product.onsubmit = function( event: Event ){
    event.preventDefault();
    app.addProduct();
};

app.map.addListener("click", function( event ){
    app.latitude.value = event.latLng.lat();
    app.longitude.value = event.latLng.lng();
});

window.addEventListener('beforeunload', function(){
    app.registerShopsInLocalStorage(); 
});



