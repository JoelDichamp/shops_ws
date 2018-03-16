System.register("class/Seller", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Seller;
    return {
        setters: [],
        execute: function () {
            Seller = class Seller {
                constructor(first_name, last_name) {
                    this.first_name = first_name;
                    this.last_name = last_name;
                }
                getFirst_name() {
                    return this.first_name;
                }
                getLast_name() {
                    return this.last_name;
                }
            };
            exports_1("Seller", Seller);
        }
    };
});
System.register("class/Product", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Product;
    return {
        setters: [],
        execute: function () {
            Product = class Product {
                constructor(label, price, image) {
                    this.label = label;
                    this.price = price;
                    this.image = image;
                }
                getLabel() {
                    return this.label;
                }
                getPrice() {
                    return this.price;
                }
                getImage() {
                    return this.image;
                }
            };
            exports_2("Product", Product);
        }
    };
});
System.register("class/Shop", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Shop;
    return {
        setters: [],
        execute: function () {
            Shop = class Shop {
                constructor(shop, localisation) {
                    this.sellers_shop = [];
                    this.products_shop = [];
                    this.shop = shop;
                    this.localisation = localisation;
                }
                getShop() {
                    return this.shop;
                }
                getLocalisation() {
                    return this.localisation;
                }
                getSellers_shop() {
                    return this.sellers_shop;
                }
                getProducts_shop() {
                    return this.products_shop;
                }
                addSeller_shop(seller) {
                    this.sellers_shop.push(seller);
                }
                addProduct_shop(product) {
                    this.products_shop.push(product);
                }
                toJSON() {
                    return {
                        shop: this.shop,
                        localisation: this.localisation,
                        sellers_shop: this.sellers_shop,
                        products_shop: this.products_shop
                    };
                }
            };
            exports_3("Shop", Shop);
        }
    };
});
System.register("class/Marker", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Marker;
    return {
        setters: [],
        execute: function () {
            Marker = class Marker {
                constructor(map, position, shop, app) {
                    this.shop = shop;
                    this.createG_marker(map, position);
                    this.linkMarkerWindow(app);
                }
                createG_marker(map, position) {
                    this.g_marker = new google.maps.Marker({
                        position: position,
                        title: this.shop.getShop(),
                        map: map
                    });
                }
                linkMarkerWindow(app) {
                    this.g_marker.addListener("click", () => {
                        app.createShopInfosWindow(this.shop);
                    });
                }
            };
            exports_4("Marker", Marker);
        }
    };
});
System.register("class/App", ["class/Marker", "class/Shop", "class/Seller", "class/Product"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Marker_1, Shop_1, Seller_1, Product_1, STORAGE_KEY, App;
    return {
        setters: [
            function (Marker_1_1) {
                Marker_1 = Marker_1_1;
            },
            function (Shop_1_1) {
                Shop_1 = Shop_1_1;
            },
            function (Seller_1_1) {
                Seller_1 = Seller_1_1;
            },
            function (Product_1_1) {
                Product_1 = Product_1_1;
            }
        ],
        execute: function () {
            STORAGE_KEY = "shops";
            App = class App {
                constructor(idElement) {
                    this.position = {
                        lat: 0,
                        lng: 0
                    };
                    this.tabDiv = [];
                    this.markers = [];
                    this.shops = [];
                    this.sellers = [];
                    this.products = [];
                    this.initMap(idElement);
                    this.getCurrentPosition();
                    this.getElementsInterface();
                    this.getElementsFormShop();
                    this.div_shop_details.style.display = 'none';
                }
                ;
                initMap(idElement) {
                    this.map = new google.maps.Map(document.getElementById(idElement), {
                        center: { lat: -34.397, lng: 150.644 },
                        zoom: 15
                    });
                }
                getCurrentPosition() {
                    navigator.geolocation.getCurrentPosition((pos) => {
                        this.setPosition(pos.coords.latitude, pos.coords.longitude);
                    }, (error) => {
                        this.setPosition(42.6827642, 2.7930558999999997);
                    });
                }
                setPosition(lat, lng) {
                    this.position.lat = lat;
                    this.position.lng = lng;
                    this.centerOnAppPosition();
                }
                centerOnAppPosition() {
                    this.map.setCenter({
                        lat: this.position.lat,
                        lng: this.position.lng
                    });
                }
                getElementsInterface() {
                    this.div_shop = document.getElementById('div-shop');
                    this.div_seller = document.getElementById('div-seller');
                    this.div_product = document.getElementById('div-product');
                    this.div_shop_details = document.getElementById('div-shop-details');
                    this.initTabDiv();
                    this.form_seller = document.getElementById("form-seller");
                    this.form_product = document.getElementById("form-product");
                }
                initTabDiv() {
                    this.tabDiv.push({ div_id: 'div-shop', div: this.div_shop });
                    this.tabDiv.push({ div_id: 'div-seller', div: this.div_seller });
                    this.tabDiv.push({ div_id: 'div-product', div: this.div_product });
                    this.tabDiv.push({ div_id: 'div-shop-details', div: this.div_shop_details });
                }
                getElementsFormShop() {
                    this.form_shop = document.getElementById("form-shop");
                    this.shop = document.getElementById("shop");
                    this.latitude = document.getElementById("latitude");
                    this.longitude = document.getElementById("longitude");
                }
                filterFloat(value) {
                    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
                        .test(value))
                        return Number(value);
                    return NaN;
                }
                putErrorStatus(msg_err, status) {
                    status.ok = false;
                    status.msg += msg_err + '<br>';
                }
                validLatLng(v_latLng, s_latLng, status) {
                    if (!v_latLng) {
                        this.putErrorStatus("La " + s_latLng + " n'a pas été saisie !", status);
                    }
                    else {
                        if (isNaN(this.filterFloat(v_latLng))) {
                            this.putErrorStatus("La " + s_latLng + " est invalide !", status);
                        }
                        else {
                            let v = parseFloat(v_latLng);
                            switch (s_latLng) {
                                case "latitude":
                                    if (v < -90 || v > 90) {
                                        this.putErrorStatus("La " + s_latLng + " doit être comprise entre -90 et +90 !", status);
                                    }
                                    break;
                                case "longitude":
                                    if (v < -180 || v > 180) {
                                        this.putErrorStatus("La " + s_latLng + " doit être comprise entre -180 et +180 !", status);
                                    }
                                    break;
                            }
                        }
                    }
                }
                validStringValue(s, msg_err, status) {
                    if (!s) {
                        this.putErrorStatus(msg_err, status);
                    }
                }
                checkShop() {
                    var status = { ok: true, msg: "" };
                    this.validStringValue(this.shop.value, "Le magasin n'a pas été saisi !", status);
                    if (status.ok) {
                        for (let s of this.shops) {
                            if (s.getShop() == this.shop.value) {
                                this.putErrorStatus("Ce magasin existe déjà !", status);
                                break;
                            }
                        }
                    }
                    this.validLatLng(this.latitude.value, 'latitude', status);
                    this.validLatLng(this.longitude.value, 'longitude', status);
                    return status;
                }
                addShopMarker(shop_name, lat, lng) {
                    const position = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
                    const shop = new Shop_1.Shop(shop_name, position);
                    this.shops.push(shop);
                    const marker = new Marker_1.Marker(this.map, position, shop, this);
                    this.markers.push(marker);
                }
                add_shop() {
                    var status = { ok: true, msg: "" };
                    status = this.checkShop();
                    if (!status.ok)
                        return status;
                    this.addShopMarker(this.shop.value, this.latitude.value, this.longitude.value);
                    if (status.ok)
                        status.msg = "Magasin '" + this.shop.value + "' OK !";
                    this.clearForm(this.form_shop);
                    return status;
                }
                addShop() {
                    this.putMsg(this.add_shop(), 'form-shop');
                }
                getElementsFormSeller() {
                    this.first_name = document.getElementById("seller-firstname");
                    this.last_name = document.getElementById("seller-lastname");
                    this.shop_selected = document.getElementById("shop-seller");
                }
                getShopByName(shop_name) {
                    for (let shop of this.shops) {
                        if (shop.getShop() == shop_name) {
                            return shop;
                        }
                    }
                    const position = new google.maps.LatLng(0, 0);
                    return new Shop_1.Shop('null', position);
                }
                checkSeller() {
                    var status = { ok: true, msg: "" };
                    this.validStringValue(this.first_name.value, "Le prénom du vendeur n'a pas été saisi !", status);
                    this.validStringValue(this.last_name.value, "Le nom du vendeur n'a pas été saisi !", status);
                    if (status.ok) {
                        for (let s of this.sellers) {
                            if (s.getFirst_name() == this.first_name.value &&
                                s.getLast_name() == this.last_name.value) {
                                this.putErrorStatus("Ce vendeur existe déjà !", status);
                                break;
                            }
                        }
                    }
                    return status;
                }
                add_seller() {
                    var status = { ok: true, msg: "" };
                    this.getElementsFormSeller();
                    status = this.checkSeller();
                    if (!status.ok)
                        return status;
                    const seller = new Seller_1.Seller(this.first_name.value, this.last_name.value);
                    this.sellers.push(seller);
                    this.getShopByName(this.shop_selected.value).addSeller_shop(seller);
                    if (status.ok)
                        status.msg = "Vendeur '" + this.first_name.value + " " + this.last_name.value + "' OK !";
                    this.clearForm(this.form_seller);
                    return status;
                }
                addSeller() {
                    this.putMsg(this.add_seller(), 'form-seller');
                }
                getElementsFormProduct() {
                    this.label = document.getElementById("product-label");
                    this.price = document.getElementById("product-price");
                    this.image = document.getElementById("product-image");
                    this.shops_selected = document.querySelectorAll("input[type='checkbox']");
                }
                checkProduct() {
                    var status = { ok: true, msg: "" };
                    this.validStringValue(this.label.value, "Le label n'a pas été saisi !", status);
                    if (status.ok) {
                        for (let p of this.products) {
                            if (p.getLabel() == this.label.value) {
                                this.putErrorStatus("Ce produit existe déjà !", status);
                                break;
                            }
                        }
                    }
                    if (isNaN(this.filterFloat(this.price.value))) {
                        this.putErrorStatus("Le prix est invalide !", status);
                    }
                    this.validStringValue(this.image.value, "L'image n'a pas été saisie !", status);
                    return status;
                }
                add_product() {
                    var status = { ok: true, msg: "" };
                    this.getElementsFormProduct();
                    status = this.checkProduct();
                    if (!status.ok)
                        return status;
                    const product = new Product_1.Product(this.label.value, parseFloat(this.price.value), this.image.value);
                    var product_affected = false;
                    for (let shop_selected of this.shops_selected) {
                        let checkbox_shop = shop_selected;
                        if (checkbox_shop.checked) {
                            let shop = this.getShopByName(checkbox_shop.value);
                            shop.addProduct_shop(product);
                            product_affected = true;
                        }
                    }
                    if (!product_affected) {
                        this.putErrorStatus("Le produit n'a été affecté à aucun magasin !", status);
                    }
                    else {
                        this.products.push(product);
                        status.msg = "Produit '" + this.label.value + "' OK !";
                        this.clearForm(this.form_product);
                    }
                    return status;
                }
                addProduct() {
                    this.putMsg(this.add_product(), 'form-product');
                }
                clearForm(form) {
                    form.reset();
                    const div_msg = document.getElementById(form.id + '-msg');
                    div_msg.innerHTML = "";
                }
                getShops() {
                    return this.shops;
                }
                putDivInterface(idDiv) {
                    for (let d of this.tabDiv) {
                        if (d.div_id == idDiv) {
                            d.div.style.display = 'block';
                        }
                        else {
                            d.div.style.display = 'none';
                        }
                    }
                }
                createFormSeller() {
                    this.form_seller.innerHTML = this.buildFormSeller();
                    this.putDivInterface('div-seller');
                }
                buildFormSeller() {
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
                buildShopList() {
                    let html = '';
                    for (let shop of this.getShops()) {
                        html += '<option value="' + shop.getShop() + '">' + shop.getShop() + '</option>';
                    }
                    return html;
                }
                createFormProduct() {
                    this.form_product.innerHTML = this.buildFormProduct();
                    this.putDivInterface('div-product');
                }
                buildFormProduct() {
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
                buildProductList() {
                    let html = '';
                    for (let shop of this.getShops()) {
                        html += '<label><span>' + shop.getShop() + '</span>';
                        html += '<input type="checkbox" id="' + shop.getShop() + '" value = "' + shop.getShop() + '">';
                        html += '</label>';
                    }
                    return html;
                }
                putMsg(status, idForm) {
                    const div_msg = document.getElementById(idForm + '-msg');
                    div_msg.classList.remove("error", "msg-info");
                    if (status.ok) {
                        div_msg.classList.add("msg-info");
                    }
                    else {
                        div_msg.classList.add("error");
                    }
                    div_msg.innerHTML = status.msg;
                }
                createShopInfosWindow(shop) {
                    this.putDivInterface('div-shop-details');
                    let html = '<h3>' + shop.getShop() + '</h3>';
                    html += '<h4>( lat : ' + shop.getLocalisation().lat() + ', lng : ' + shop.getLocalisation().lng() + ' )</h4>';
                    html += '<div id="div-sellers">';
                    html += '<p>Vendeurs : </p>';
                    html += '<div id="sellers">';
                    for (let s of shop.getSellers_shop()) {
                        html += s.getFirst_name() + ' ' + s.getLast_name() + '<br>';
                    }
                    if (shop.getSellers_shop().length == 0) {
                        html += "Aucun vendeur n'a été affecté à ce magasin";
                    }
                    html += '</div>';
                    html += '</div>';
                    html += '<div id="div-products">';
                    if (shop.getProducts_shop().length == 0) {
                        html += "<p>Aucun produit n'est actuellement vendu par ce magasin</p>";
                    }
                    else {
                        html += '<table>';
                        html += '<tr>';
                        html += '<th class="head-product">Produit</th>';
                        html += '<th class="head-price">Prix</th>';
                        html += '<th class="head-image">Image</th>';
                        html += '</tr>';
                        for (let p of shop.getProducts_shop()) {
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
                    const string_fields = JSON.stringify(this.shops);
                    localStorage.setItem(STORAGE_KEY, string_fields);
                }
                getShopsFromLocalStorage() {
                    if (localStorage.shops) {
                        const string_fields = localStorage.getItem(STORAGE_KEY);
                        if (string_fields) {
                            let parsed_shops = JSON.parse(string_fields);
                            for (let parsed_shop of parsed_shops) {
                                this.addShopMarker(parsed_shop.shop, parsed_shop.localisation.lat, parsed_shop.localisation.lng);
                                let lg_shops = this.shops.length;
                                for (let parsed_seller of parsed_shop.sellers_shop) {
                                    let seller = new Seller_1.Seller(parsed_seller.first_name, parsed_seller.last_name);
                                    this.sellers.push(seller);
                                    this.shops[lg_shops - 1].addSeller_shop(seller);
                                }
                                for (let parsed_product of parsed_shop.products_shop) {
                                    let product = new Product_1.Product(parsed_product.label, parseFloat(parsed_product.price), parsed_product.image);
                                    this.shops[lg_shops - 1].addProduct_shop(product);
                                    var exists = false;
                                    for (let p of this.products) {
                                        if (p.getLabel() == parsed_product.label) {
                                            exists = true;
                                            break;
                                        }
                                    }
                                    if (!exists) {
                                        this.products.push(product);
                                    }
                                }
                            }
                        }
                    }
                }
            };
            exports_5("App", App);
        }
    };
});
System.register("main", ["class/App"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var App_1, app, li_shop, li_seller, li_product;
    return {
        setters: [
            function (App_1_1) {
                App_1 = App_1_1;
            }
        ],
        execute: function () {
            app = new App_1.App("map");
            app.getShopsFromLocalStorage();
            li_shop = document.getElementById('li-shop');
            li_seller = document.getElementById('li-seller');
            li_product = document.getElementById('li-product');
            li_shop.onclick = function () {
                app.putDivInterface('div-shop');
            };
            app.form_shop.onsubmit = function (event) {
                event.preventDefault();
                app.addShop();
            };
            li_seller.onclick = function () {
                app.createFormSeller();
            };
            app.form_seller.onsubmit = function (event) {
                event.preventDefault();
                app.addSeller();
            };
            li_product.onclick = function () {
                app.createFormProduct();
            };
            app.form_product.onsubmit = function (event) {
                event.preventDefault();
                app.addProduct();
            };
            app.map.addListener("click", function (event) {
                app.latitude.value = event.latLng.lat();
                app.longitude.value = event.latLng.lng();
            });
            window.addEventListener('beforeunload', function () {
                app.registerShopsInLocalStorage();
            });
        }
    };
});
//# sourceMappingURL=main.js.map