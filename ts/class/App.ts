import { Marker } from "./Marker";
import { Shop } from "./Shop";
import { Seller } from "./Seller";
import { Product } from "./Product";

const 
    STORAGE_KEY: string = "shops";

export class App {

    public map: google.maps.Map;
    private position: {
        lat: number, 
        lng: number
    } = {
        lat: 0, 
        lng: 0
    };

    private div_shop: HTMLDivElement;
    private div_seller: HTMLDivElement;
    private div_product: HTMLDivElement;
    private div_shop_details: HTMLDivElement;
    private tabDiv: {div_id: string; div: HTMLDivElement}[] = [];

    public form_shop: HTMLFormElement;
    private shop: HTMLInputElement;
    public latitude: HTMLInputElement;
    public longitude: HTMLInputElement;

    public form_seller : HTMLFormElement;
    private first_name: HTMLInputElement;
    private last_name: HTMLInputElement;
    private shop_selected: HTMLSelectElement;

    public form_product : HTMLFormElement;
    private label: HTMLInputElement;
    private price: HTMLInputElement;
    private image: HTMLInputElement;
    private shops_selected : NodeList;

    private markers: Marker[] = []; 
    private shops: Shop[] = [];
    private sellers: Seller[] = [];
    private products: Product[] = [];

    constructor( idElement: string ) {
        this.initMap(idElement);
        this.getCurrentPosition();
        this.getElementsInterface();
        this.getElementsFormShop();
        this.div_shop_details.style.display = 'none';
    };
    
    initMap( idElement: string ): void {
        this.map = new google.maps.Map(document.getElementById(idElement), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 15
        });
    }

    getCurrentPosition(): void {
        navigator.geolocation.getCurrentPosition(
            ( pos: Position) => { //success
                this.setPosition( pos.coords.latitude, 
                                  pos.coords.longitude );
            },
    
            ( error: PositionError ) => {
                this.setPosition( 42.6827642, 
                                 2.7930558999999997 );
            }
        );
    }

    setPosition( lat: number, lng: number ): void {
        this.position.lat = lat;
        this.position.lng = lng;

        this.centerOnAppPosition();
        // this.setAppMarker();
    }

    centerOnAppPosition(): void {
        this.map.setCenter( {
            lat: this.position.lat,
            lng: this.position.lng
        });
    } 

    getElementsInterface(): void {
        this.div_shop = document.getElementById('div-shop') as HTMLDivElement;
        this.div_seller = document.getElementById('div-seller') as HTMLDivElement;
        this.div_product = document.getElementById('div-product') as HTMLDivElement;
        this.div_shop_details = document.getElementById('div-shop-details') as HTMLDivElement;
        this.initTabDiv();

        this.form_seller = document.getElementById("form-seller") as HTMLFormElement;
        this.form_product = document.getElementById("form-product") as HTMLFormElement;
    }

    initTabDiv(): void {  
        this.tabDiv.push({div_id: 'div-shop', div: this.div_shop});
        this.tabDiv.push({div_id: 'div-seller',div: this.div_seller});
        this.tabDiv.push({div_id: 'div-product',div: this.div_product});
        this.tabDiv.push({div_id: 'div-shop-details',div: this.div_shop_details});  
    }

    getElementsFormShop(): void {
        this.form_shop = document.getElementById("form-shop") as HTMLFormElement;
        this.shop = document.getElementById("shop") as HTMLInputElement;
        this.latitude = document.getElementById("latitude") as HTMLInputElement;
        this.longitude = document.getElementById("longitude") as HTMLInputElement;
    }

    filterFloat( value: string ): number {
        if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
          .test(value))
          return Number( value );
      return NaN;
    }

    putErrorStatus( msg_err: string, status: { ok: boolean, msg: string } ): void {
        status.ok = false; 
        status.msg += msg_err + '<br>';
    }

    validLatLng( v_latLng : string, s_latLng : string, status: { ok: boolean, msg: string } ): void {
        if ( !v_latLng ) {
            this.putErrorStatus( "La " + s_latLng + " n'a pas été saisie !", status );
        } else {
            if ( isNaN( this.filterFloat(v_latLng) ) ){
                this.putErrorStatus( "La " + s_latLng + " est invalide !", status );
            } else {
                let v: number = parseFloat(v_latLng);
                switch (s_latLng) {
                    case "latitude":
                        if ( v < -90 || v > 90 ) {
                            this.putErrorStatus( "La " + s_latLng + " doit être comprise entre -90 et +90 !", status );
                        }
                    break;

                    case "longitude":
                        if ( v < -180 || v > 180 ) {
                            this.putErrorStatus( "La " + s_latLng + " doit être comprise entre -180 et +180 !", status );
                        }
                    break;
                }
            }
        }
    }

    validStringValue( s: string, msg_err: string, status: { ok: boolean, msg: string } ): void {
        if ( !s ) {
            this.putErrorStatus( msg_err, status );
        }
    }

    checkShop(): {ok: boolean, msg: string} {
        var status: { ok: boolean, msg: string } = { ok: true, msg: "" };

        this.validStringValue( this.shop.value, "Le magasin n'a pas été saisi !", status);

        if ( status.ok ) {
            for (let s of this.shops) {
                if ( s.getShop() == this.shop.value ) {
                    this.putErrorStatus( "Ce magasin existe déjà !", status );
                    break;
                }
            }
        }

        this.validLatLng( this.latitude.value, 'latitude', status);
        this.validLatLng( this.longitude.value, 'longitude', status);

        return status;
    }

    addShopMarker( shop_name: string, lat: string, lng: string ) {
        const position: google.maps.LatLng = new google.maps.LatLng(
            parseFloat(lat),
            parseFloat(lng)
        );
        const shop: Shop = new Shop( shop_name, position);
        this.shops.push( shop );
        
        const marker: Marker = new Marker( 
            this.map, 
            position, 
            shop,
            this
        );
        this.markers.push( marker );
    }

    add_shop(): {ok: boolean, msg: string} {
        var status: { ok: boolean, msg: string } = { ok: true, msg: "" };

        status = this.checkShop();
        if ( !status.ok ) return status;

        this.addShopMarker( this.shop.value, this.latitude.value, this.longitude.value);

        if ( status.ok ) status.msg = "Magasin '" + this.shop.value + "' OK !";
        this.clearForm(this.form_shop);

        return status;
    }

    addShop(): void {
        this.putMsg( this.add_shop(), 'form-shop' );
    }

    getElementsFormSeller(): void {
        this.first_name = document.getElementById("seller-firstname") as HTMLInputElement;
        this.last_name = document.getElementById("seller-lastname") as HTMLInputElement;
        this.shop_selected = document.getElementById("shop-seller") as HTMLSelectElement;
    }

    getShopByName( shop_name: string ): Shop {
        for ( let shop of this.shops ) {
            if ( shop.getShop() == shop_name ) {
                return shop;
            }
        }
        const position: google.maps.LatLng = new google.maps.LatLng(0,0);
        return new Shop( 'null', position );
    }

    checkSeller(): {ok: boolean, msg: string} {
        var status: { ok: boolean, msg: string } = { ok: true, msg: "" };

        this.validStringValue( this.first_name.value, "Le prénom du vendeur n'a pas été saisi !", status);
        this.validStringValue( this.last_name.value, "Le nom du vendeur n'a pas été saisi !", status);
        
        if ( status.ok ) {
            for (let s of this.sellers) {
                if ( s.getFirst_name() == this.first_name.value && 
                    s.getLast_name() == this.last_name.value ) {
                        this.putErrorStatus( "Ce vendeur existe déjà !", status );
                        break;
                }
            }
        }

        return status;
    }

    add_seller(): {ok: boolean, msg: string} {
        var status: { ok: boolean, msg: string } = { ok: true, msg: "" };

        this.getElementsFormSeller();
 
        status = this.checkSeller();
        if ( !status.ok ) return status;

        const seller: Seller = new Seller(this.first_name.value, this.last_name.value);
        this.sellers.push( seller );
        this.getShopByName(this.shop_selected.value).addSeller_shop( seller );

        if ( status.ok ) status.msg = "Vendeur '" + this.first_name.value + " " + this.last_name.value + "' OK !";
        this.clearForm(this.form_seller);

        return status;
    }

    addSeller(): void {
        this.putMsg( this.add_seller(), 'form-seller' );
    }

    getElementsFormProduct(): void {
        this.label = document.getElementById("product-label") as HTMLInputElement;
        this.price = document.getElementById("product-price") as HTMLInputElement;
        this.image = document.getElementById("product-image") as HTMLInputElement;
        this.shops_selected = document.querySelectorAll("input[type='checkbox']") as NodeList;
    }

    checkProduct(): {ok: boolean, msg: string} {
        var status: { ok: boolean, msg: string } = { ok: true, msg: "" };

        this.validStringValue( this.label.value, "Le label n'a pas été saisi !", status);
        if ( status.ok ) {
            for ( let p of this.products ) {
                if ( p.getLabel() == this.label.value ) {
                    this.putErrorStatus( "Ce produit existe déjà !", status );
                    break;
                }
            }
        }

        if ( isNaN( this.filterFloat(this.price.value) ) ){
            this.putErrorStatus( "Le prix est invalide !", status );
        }

        this.validStringValue( this.image.value, "L'image n'a pas été saisie !", status);

        return status;
    }

    add_product(): {ok: boolean, msg: string} {
        var status: { ok: boolean, msg: string } = { ok: true, msg: "" };

        this.getElementsFormProduct();

        status = this.checkProduct();
        if ( !status.ok ) return status;

        const product: Product = new Product( this.label.value, 
                                              parseFloat(this.price.value), 
                                              this.image.value);

        var product_affected: boolean = false;        
        for (let shop_selected of this.shops_selected) {
            let checkbox_shop: HTMLInputElement = shop_selected as HTMLInputElement;
            if (checkbox_shop.checked) {
                let shop: Shop = this.getShopByName(checkbox_shop.value);
                shop.addProduct_shop( product );
                product_affected = true;
            }
        }

        if ( !product_affected) {
            this.putErrorStatus( "Le produit n'a été affecté à aucun magasin !", status );
        } else {
            this.products.push( product );
            status.msg = "Produit '" + this.label.value + "' OK !";
            this.clearForm(this.form_product);
        }
        
        return status;
    }

    addProduct(): void {
        this.putMsg( this.add_product(), 'form-product' );
    }

    clearForm( form: HTMLFormElement ): void {
        form.reset();
        const div_msg: HTMLDivElement = document.getElementById(form.id + '-msg') as HTMLDivElement; 
        div_msg.innerHTML = "";
    }

    getShops(): Shop[] {
        return this.shops;
    }

    putDivInterface( idDiv: string ): void {
        for (let d of this.tabDiv) {
            if (d.div_id == idDiv) {
                d.div.style.display = 'block';
            } else {
                d.div.style.display = 'none';
            }
        }         
    }

    createFormSeller(): void {
        this.form_seller.innerHTML = this.buildFormSeller();
        this.putDivInterface( 'div-seller' );
    }

    buildFormSeller(): string {
        let html = '<fieldset>';
            html += '<h3>Vendeur</h3>';
            html += '<label><span>Nom :</span>';
                html += '<input type="text" id="seller-lastname">';
            html += '</label>';
            html += '<label><span>Prénom :</span>';
                html += '<input type="text" id="seller-firstname">';
            html += '</label>';
            html += '<label><span>Magasin :</span>';
                html += '<select id="shop-seller">';
                html += this.buildShopList();
                html += '</select>';
            html += '</label>';
            html += '<div class="form-validation">';
                html += '<input type="submit" value="Ajouter">';
                html += '<div id="form-seller-msg"></div>';
            html += '</div>';
        html += '</fieldset>';

        return html;
    }

    buildShopList(): string {
        let html = '';
        for (let shop of this.getShops()) {
            html += '<option value="' + shop.getShop() + '">' + shop.getShop() + '</option>';
        }
        return html;
    }

    createFormProduct(): void {
        this.form_product.innerHTML = this.buildFormProduct();
        this.putDivInterface( 'div-product' );
    }

    buildFormProduct(): string {
        let html = '<fieldset>';
            html += '<h3>Produit</h3>';
            html += '<label><span>Label :</span>';
                html += '<input type="text" id="product-label">';  
            html += '</label>';
            html += '<label><span>Prix :</span>';
                html += '<input type="text" id="product-price">';
            html += '</label>';
            html += '<label><span>Image :</span>';
                html += '<input type="text" id="product-image">'; 
            html += '</label>';
            html += '<fieldset>';
                html += this.buildProductList();
            html += '</fieldset>';
            html += '<div class="form-validation">';
                html += '<input type="submit" value="Ajouter">';
                html += '<div id="form-product-msg"></div>';
            html += '</div>';
        html += '</fieldset>';

        return html;
    }

    buildProductList(): string {
        let html = '';
        for (let shop of this.getShops()) {
            html += '<label><span>' + shop.getShop() + '</span>';
                html += '<input type="checkbox" id="' + shop.getShop() + '" value = "' + shop.getShop() + '">';
            html += '</label>';
        }
    
        return html;
    }

    putMsg( status: { ok: boolean, msg: string }, idForm: string ): void {
        const div_msg: HTMLDivElement = document.getElementById(idForm + '-msg') as HTMLDivElement; 
        div_msg.classList.remove( "error", "msg-info" );
        if ( status.ok ) {
            div_msg.classList.add("msg-info");
        } else {
            div_msg.classList.add("error");
        }
        div_msg.innerHTML = status.msg;
    }

    createShopInfosWindow( shop: Shop): void {
        this.putDivInterface( 'div-shop-details' );

        let html = '<h3>' + shop.getShop() + '</h3>';
        html += '<h4>( lat : ' + shop.getLocalisation().lat() + ', lng : ' + shop.getLocalisation().lng() + ' )</h4>';
        html += '<div id="div-sellers">';
            html += '<p>Vendeurs : </p>';
            html += '<div id="sellers">';
            for ( let s of shop.getSellers_shop() ) {
                html += s.getFirst_name() + ' ' + s.getLast_name() + '<br>';
            }
            if ( shop.getSellers_shop().length == 0 ) {
                html += "Aucun vendeur n'a été affecté à ce magasin";
            }
            html += '</div>';
        html += '</div>'; 

        html += '<div id="div-products">';
        if ( shop.getProducts_shop().length == 0 ) {
            html += "<p>Aucun produit n'est actuellement vendu par ce magasin</p>";
        } else {
            html += '<table>';
                html += '<tr>';
                    html += '<th class="head-product">Produit</th>';
                    html += '<th class="head-price">Prix</th>';
                    html += '<th class="head-image">Image</th>';
                html += '</tr>';
                for ( let p of shop.getProducts_shop() ) {
                    html += '<tr>';
                        html += '<td>' + p.getLabel() + '</td>';
                        html += '<td class="td_center">' + p.getPrice().toString() + '€</td>';
                        html += '<td class="td_center">' + p.getImage() + '</td>';
                    html += '</tr>';
                }
            html += '</table>';
        } 
        html += '</div>'; 

        this.div_shop_details.innerHTML = html;
    }

    registerShopsInLocalStorage() {
        const string_fields: string = JSON.stringify( this.shops );
        localStorage.setItem( STORAGE_KEY, string_fields );
    }

    getShopsFromLocalStorage() {
        if (localStorage.shops) {
            // console.log("ici");
            const string_fields = localStorage.getItem( STORAGE_KEY );
            if (string_fields) {
                let parsed_shops = JSON.parse(string_fields);
                for (let parsed_shop of parsed_shops) {
                    this.addShopMarker( parsed_shop.shop, parsed_shop.localisation.lat, parsed_shop.localisation.lng);
                    let lg_shops = this.shops.length; 

                    for (let parsed_seller of parsed_shop.sellers_shop) {
                        let seller: Seller = new Seller( parsed_seller.first_name, parsed_seller.last_name );
                        this.sellers.push( seller );
                        this.shops[lg_shops-1].addSeller_shop( seller );
                    }

                    for (let parsed_product of parsed_shop.products_shop) {
                        let product: Product = new Product(parsed_product.label, 
                                parseFloat(parsed_product.price), parsed_product.image);
                        this.shops[lg_shops-1].addProduct_shop( product ); 

                        var exists: boolean = false;
                        for (let p of this.products) {
                            if ( p.getLabel() == parsed_product.label ) {
                                exists = true;
                                break;
                            }
                        }
                        if ( !exists ) {
                            this.products.push( product );
                        }                        
                    }
                }
            }  
        }  
    }
}