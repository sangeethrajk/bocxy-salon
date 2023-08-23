import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
// Image Crop
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
// Geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
// ionic storage
import { IonicStorageModule } from '@ionic/storage';
import { RandomcolorModule } from 'angular-randomcolor';

// FCM
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './_interceptors/auth.interceptor';
import { AuthGuard } from './_guards/auth.guard';
import { ErrorHandler } from './_services/error-handler.service';
import { ToastService } from './_services/toast.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { HardBackService } from './_services/hardback.service';
import { DatePicker } from '@ionic-native/date-picker/ngx';
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
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AutocompleteLibModule,
    RandomcolorModule,
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
    Deeplinks,
    AuthGuard,
    StatusBar,
    SplashScreen,
    Geolocation,
    Crop,
    ImagePicker,
    File,
    FirebaseX,
    NativeGeocoder,
    DatePicker,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ErrorHandler,
    ToastService,
    HardBackService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
