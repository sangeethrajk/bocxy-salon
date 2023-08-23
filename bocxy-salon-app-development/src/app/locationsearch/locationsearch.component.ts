import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { GeoAddress } from '../_models/geo-address.model';

declare var google;

@Component({
  selector: 'app-locationsearch',
  templateUrl: './locationsearch.component.html',
  styleUrls: ['./locationsearch.component.scss'],
})
export class LocationsearchComponent implements OnInit {

  modalTitle: string;
  modelId: number;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  geoAddress: GeoAddress = new GeoAddress();
  autocomplete: { input: string; };
  autocompleteItems: any[];
  placeid: any;
  GoogleAutocomplete: any;

  constructor(private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, public zone: NgZone,
    private modalController: ModalController,
    private navParams: NavParams) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
  // LOAD THE MAP ONINIT.
  ngOnInit() {
    console.table(this.navParams);
    this.modelId = this.navParams.data.modalId;
    this.modalTitle = this.navParams.data.modalTitle;
    this.loadMap();
  }
  // Close Modal
  async closeModal() {
    this.geoAddress.location = this.autocomplete.input;
    await this.modalController.dismiss(this.geoAddress);
  }
  // LOADING THE MAP HAS 2 PARTS.
  loadMap() {

    // FIRST GET THE LOCATION FROM THE DEVICE.
    this.geolocation.getCurrentPosition().then((resp) => {
      const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      // LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.addListener('tilesloaded', () => {
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
        this.geoAddress.latitude = this.map.center.lat();
        this.geoAddress.longitude = this.map.center.lng();
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }


  getAddressFromCoords(lattitude, longitude) {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.geoAddress.address = '';
        const responseAddress = [];
        for (const [key, value] of Object.entries(result[0])) {
          if (value.length > 0) {
            if (key !== 'latitude' && key !== 'longitude') {
              responseAddress.push(value);
            }
          }
        }
        responseAddress.reverse();
        for (const value of responseAddress) {
          this.geoAddress.address += value + ', ';
        }
        this.geoAddress.address = this.geoAddress.address.slice(0, -2);
        this.geoAddress.country = result[0].countryName;
        this.geoAddress.adminAreaLevel1 = result[0].administrativeArea;
        this.geoAddress.adminAreaLevel2 = result[0].subAdministrativeArea;
        this.geoAddress.locality = result[0].locality;
        this.geoAddress.subLocality = result[0].subLocality;
        this.geoAddress.postalCode = result[0].postalCode;
        console.log(this.geoAddress);

      })
      .catch((error: any) => {
        this.geoAddress.address = 'Address Not Available!';
      });
  }

  // FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
  ShowCords() {
    alert('lat' + this.geoAddress.latitude + ', long' + this.geoAddress.longitude);
  }

  // AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults() {
    if (this.autocomplete.input === '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  // wE CALL THIS FROM EACH ITEM.
  SelectSearchResult(item) {
    /// WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.forwardGeocode(item.description, options)
      .then((coordinates: NativeGeocoderResult[]) => {
        const latLng = new google.maps.LatLng(coordinates[0].latitude, coordinates[0].longitude);
        const mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.getAddressFromCoords(coordinates[0].latitude, coordinates[0].longitude);
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.map.addListener('tilesloaded', () => {
          this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
          this.geoAddress.latitude = this.map.center.lat();
          this.geoAddress.longitude = this.map.center.lng();
        });
      })
      .catch((error: any) => console.log(error));
    const geocoder = new google.maps.Geocoder();
    this.autocomplete.input = item.description;
    this.placeid = item.place_id;
    this.autocompleteItems.length = 0;
  }

  // lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
  ClearAutocomplete() {
    this.autocompleteItems = [];
    this.autocomplete.input = '';
  }

  // sIMPLE EXAMPLE TO OPEN AN URL WITH THE PLACEID AS PARAMETER.
  GoTo() {
    return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=' + this.placeid;
  }

  cancel() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
