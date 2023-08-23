import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// Image Crop
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './_interceptors/auth.interceptor';
// Geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

// ionic storage
import { IonicStorageModule } from '@ionic/storage';
import { ToastService } from './_services/toast.service';
import { HardbackService } from './_services/hardback.service';
import { ErrorhandlerService } from './_services/errorhandler.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { DashboardService } from './tab1/tab1.service';

// FCM
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

// Fontawesome
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// ngx-translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    Ng2TelInputModule,
    NgOtpInputModule,
    ReactiveFormsModule, FormsModule,
    NgxStarRatingModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Crop,
    FirebaseX,
    ImagePicker,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ToastService,
    HardbackService,
    // ADD GEOLOCATION Y GEOCODER ON THE PROVIDERS.
    Geolocation,
    NativeGeocoder,
    GooglePlus,
    Facebook,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ErrorhandlerService,
    DashboardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
  }
}
