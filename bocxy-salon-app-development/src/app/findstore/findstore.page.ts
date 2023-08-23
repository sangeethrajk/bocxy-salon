import { Component, OnInit, Input, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { FindStoreService } from './findstore.service';
import { ToastService } from '../_services/toast.service';
import { MerchantStore } from './findstore.model';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { GeoAddress } from '../_models/geo-address.model';
import * as CryptoJS from 'crypto-js';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

declare var google;

@Component({
  selector: 'app-findstore',
  templateUrl: './findstore.page.html',
  styleUrls: ['./findstore.page.scss'],
})
export class FindstorePage implements OnInit {
  @Input() storelocation: string;
  @Input() type: string;
  locatestore = 'store';

  isServcieAvailable = false;
  allStore: MerchantStore[];
  stores: MerchantStore[];
  storeName: string;
  map: any;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  geoAddress: GeoAddress = new GeoAddress();
  address: any;
  constructor(
    public modalCtrl: ModalController,
    private httpService: FindStoreService,
    private toast: ToastService,
    public zone: NgZone,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private loadingctrl: LoadingController,
    public translate: TranslateService,
    public TranslateModule: TranslateModule
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  async ngOnInit() {
    this.locatestore = this.type;
    if (this.type === 'store') {
      this.storeName = this.storelocation;
    }
    else {
      this.autocomplete.input = this.storelocation;
    }
    await this.getMerchantStoreList();
  }
  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  getMerchantStoreList() {
    return new Promise((resolve, reject) => {
      this.httpService.getMerchantStoreList().pipe().subscribe(
        (response) => {
          if (response && response.status === 'SUCCESS') {
            for (const store of response.data) {
              const location = store.locality ? `, ${store.locality}` : '';
              store.display = `${store.name}${location}`;
            }
            this.allStore = response.data;
          }
          else {
            this.toast.showToast('Something went wrong. Please try again');
          }
          resolve(1);
        },
        (error) => {
          this.toast.showToast('Something went wrong. Please try again');
          reject(1);
        }
      );
    });
  }

  filterStore(ev: any) {
    this.stores = this.allStore;
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.stores = this.stores.filter((ser) => {
        return (ser.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  async storeSelected(store: MerchantStore) {
    await this.modalCtrl.dismiss({
      type: 'store',
      storeId: store.merchantStoreId,
      display: store.display
    });
  }

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

  // lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
  ClearAutocomplete() {
    this.autocompleteItems = [];
    this.autocomplete.input = '';
  }

  // wE CALL THIS FROM EACH ITEM.
  async SelectSearchResult(item) {
    /// WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
    // this.toast.showToast('item:' + JSON.stringify(item));
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.forwardGeocode(item.description, options)
      .then(async (coordinates: NativeGeocoderResult[]) => {
        console.log(coordinates, "111");
        this.getAddressFromCoords(Number(coordinates[0].latitude), Number(coordinates[0].longitude));
      })
      .catch((error: any) => console.log(error));

  }

  async getAddressFromCoords(lattitude, longitude) {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then(async (result: NativeGeocoderResult[]) => {
        console.log(result, "222");
        this.geoAddress.address = '';
        const responseAddress = [];
        for (const [key, value] of Object.entries(result[0])) {
          if (value.length > 0) {
            responseAddress.push(value);
          }
        }
        responseAddress.reverse();
        for (const value of responseAddress) {
          this.geoAddress.address += value + ', ';
        }
        this.geoAddress.latitude = lattitude;
        this.geoAddress.longitude = longitude;
        this.geoAddress.address = this.geoAddress.address.slice(0, -2);
        this.geoAddress.country = result[0].countryName;
        this.geoAddress.adminAreaLevel1 = result[0].administrativeArea;
        this.geoAddress.adminAreaLevel2 = result[0].subAdministrativeArea;
        this.geoAddress.locality = result[0].locality;
        this.geoAddress.subLocality = result[0].subLocality;
        this.geoAddress.postalCode = result[0].postalCode;

        // this.autocomplete.input = item.description;
        this.autocompleteItems.length = 0;
        const locationObject = {
          latitude: this.geoAddress.latitude,
          longitude: this.geoAddress.longitude,
          country: this.geoAddress.country,
          adminAreaLevel1: this.geoAddress.adminAreaLevel1,
          adminAreaLevel2: this.geoAddress.adminAreaLevel2,
          locality: this.geoAddress.locality
        };

        let address: any = [];
        if (this.geoAddress.subLocality) address.push(this.geoAddress.subLocality);
        address.push(this.geoAddress.locality, this.geoAddress.adminAreaLevel2, this.geoAddress.adminAreaLevel1);
        address = [...new Set(address)];
        address = address.join(", ");
        const locationCryptAes = CryptoJS.AES.encrypt(JSON.stringify(locationObject), 'bocxy').toString();
        const locationCrypt = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(locationCryptAes));
        this.address = address


        await this.modalCtrl.dismiss({
          type: 'location',
          location: locationCrypt,
          display: address
        });
      })
      .catch((error: any) => {
        console.log('console err', error)
        this.geoAddress.address = 'Address Not Available!';
      });
  }
  async loadMap() {
    const loading = await this.loadingctrl.create({
      spinner: 'bubbles',
      message: 'Please wait...',
      cssClass: 'custom-spinner',
    });
    loading.present();
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
      loading.dismiss();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    loading.dismiss();
  }

}
