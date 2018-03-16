import { Shop } from "./Shop";
import { App } from "./App";

export class Marker {

    private g_marker: google.maps.Marker;
    private g_infoWindow: google.maps.InfoWindow;
    private shop: Shop;
    

    constructor( map: google.maps.Map, position: google.maps.LatLng, shop: Shop, app: App ) {
        this.shop = shop;
        this.createG_marker( map, position );
        this.linkMarkerWindow( app );
    }

    createG_marker( map: google.maps.Map, position: google.maps.LatLng ){
        this.g_marker = new google.maps.Marker({
            position: position,
            title: this.shop.getShop(),
            map : map
        });
    }

    linkMarkerWindow( app: App  ) {
        this.g_marker.addListener( "click", () => {
            app.createShopInfosWindow( this.shop );
        });
    }
}