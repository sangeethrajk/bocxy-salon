import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Pages } from './interfaces/pages';
import { Storage } from '@ionic/storage';
import { AuthService } from './_services/auth.service';
import { SharedService } from './_services/shared.service';
import { Subscription } from 'rxjs';
import { ActionSheetController, ModalController, MenuController, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonContent } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  login: boolean;
  selectedIcon: any = 'assets/icon/male_icon.svg';
  userData: any;
  skipLogin: boolean;

  backButtonSubscription: Subscription;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  lang: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private navCtrl: NavController,
    private authService: AuthService,
    private sharedService: SharedService,
    private actionSheetCtrl: ActionSheetController,
    private modalController: ModalController,
    private menu: MenuController,
    private toastController: ToastController,
    public router: Router,
    private location: Location,
    public translate: TranslateService,
    public TranslateModule: TranslateModule,
    private firebaseX: FirebaseX

  ) {
    this.lang = 'en';
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.initializeApp();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.toLowerCase() == '/home') {
          this.skipLogin = false;
          this.storage.get('skipLogin').then(x => {
            if (x == 'Y') {
              this.skipLogin = true;
              this.init();
            } else {
              this.init();
              this.skipLogin = false;
            }
          });
          this.loadUserData();
        }
      }
    });
    this.init();
    this.initializeApp();

  }

  public appPages: Array<Pages>;
  pages = [];
  init() {
    this.pages = [
      {
        title: 'SIDE_MENU_ITEMS.HOME',
        url: '/home',
        direct: 'root',
        icon: 'home-outline',
        hide: false
      },
      {
        title: 'SIDE_MENU_ITEMS.MY_BOOKINGS',
        url: this.skipLogin ? '/login' : '/home/tabs/tab3',
        direct: 'forward',
        icon: 'calendar-outline',
        // hide: this.skipLogin,
        hide: false
      },
      // {
      //   title: 'Offers',
      //   url: '/home/tabs/tab2',
      //   direct: 'root',
      //   icon: 'pricetags-outline'
      // },
      {
        title: 'SIDE_MENU_ITEMS.MY_NOTIFICATION',
        url: this.skipLogin ? '/login' : '/notifications',
        direct: 'forward',
        icon: 'notifications-outline',
        // hide: this.skipLogin,
        hide: false
      },
      // {
      //   title: 'Style Gallery',
      //   url: '/home',
      //   direct: 'forward',
      //   icon: 'glasses-outline'
      // },
      // {
      //   title: 'Referal',
      //   url: '/home',
      //   direct: 'root',
      //   icon: 'trophy-outline'
      // },
      // {
      //   title: 'My Reviews',
      //   url: '/myreviews',
      //   direct: 'forward',
      //   icon: 'chatbubbles-outline'
      // },
      {
        title: 'SIDE_MENU_ITEMS.PROFILE',
        url: this.skipLogin ? '/login' : '/home/tabs/tab4',
        direct: 'root',
        icon: 'person-outline',
        hide: false
      },
      {
        title: 'SIDE_MENU_ITEMS.HELP_SUPPORT',
        url: '/helpsupport',
        direct: 'root',
        icon: 'help-circle-outline',
        hide: false
      },
      {
        title: this.skipLogin ? 'SIDE_MENU_ITEMS.SIGN_IN' : 'SIDE_MENU_ITEMS.SIGN_OUT',
        url: '/login',
        direct: 'forward',
        icon: 'log-out-outline',
        hide: false
      },
      {
        title: 'COMMON.LANGUAGES',
        icon: 'language-outline',
        name: '',
        disable: false,
        children: [
          {
            title: 'English',
            value: 'en'
          },
          {
            title: 'தமிழ்',
            value: 'ta'
          }
        ]
      }
    ];
  }
  switchLanguage() {
    this.translate.use(this.lang);
    console.log(this.lang);
    this.scrollToBottom();
  }
  backButtonEvent() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(
      1,
      async () => {
        // close action sheet
        try {
          const element = await this.actionSheetCtrl.getTop();
          if (element) {
            element.dismiss();
          }
        } catch (error) {
          alert(error.error);
        }
        // close modal
        try {
          const element = await this.modalController.getTop();
          if (element) {
            element.dismiss();
          }
        } catch (error) {
          alert(error.error);
        }
        // close side menu
        try {
          const element = await this.menu.getOpen();
          if (element) {
            this.menu.close();
          }
        } catch (error) {
          alert(error.error);
        }
        if (
          this.router.url === '/home/tabs/tab1' ||
          // this.router.url === '/home/tabs/storeconfig' ||
          // this.router.url === '/home/tabs/tab3' ||
          // this.router.url === '/home/tabs/tab4' ||
          this.router.url === '/login' ||
          this.router.url === '/signup' ||
          this.router.url === '/'
        ) {
          if (
            new Date().getTime() - this.lastTimeBackPress <
            this.timePeriodToExit
          ) {
            navigator[`app`].exitApp();
          } else {
            await this.presentToast(
              'Press back again to exit App'
            );
            this.lastTimeBackPress = new Date().getTime();
          }
        } else {
          this.location.back();
        }
      }
    );
  }

  async ngOnInit() {
    await this.loadUserData();
    this.backButtonEvent();
  }

  async presentToast(messageToPresent: string) {
    const toast = await this.toastController.create({
      duration: 1000,
      header: messageToPresent,
      position: 'bottom',
      cssClass: 'exitToast'
    });
    toast.present();
  }

  async loadUserData() {
    this.userData = await this.storage.get('userData');
    if (this.userData) {
      if (this.userData.pictureUrl == null) {
        this.selectedIcon = 'assets/icon/male_icon.svg';
      } else {
        this.selectedIcon = this.userData.pictureUrl;
      }
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // let status bar overlay webview
      this.statusBar.overlaysWebView(false);
      // set status bar to black
      // this.statusBar.backgroundColorByHexString('#222469');
      this.statusBar.backgroundColorByHexString('#f7f7f7');
      // this.statusBar.styleLightContent();

      this.statusBar.styleDefault();
      this.authService.isLoggedIn().then((data) => {
        this.login = data;
        if (data) {
          this.navCtrl.navigateRoot('/home');
        } else {
          this.storage.get('skipLogin').then(x => {
            if (x === 'Y') {
              this.navCtrl.navigateRoot('/home');
            } else {
              this.storage.get('introscreenflag').then(x => {
                if (x === 'Y') {
                  this.navCtrl.navigateRoot('/login');
                }
              });
            }
          });
        }
      });
      this.notificationSubscribe();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 2000);
    }).catch(() => { });



  }

  notificationSubscribe() {
    this.firebaseX.onMessageReceived().subscribe(data => {
      console.log(data, 'notfications data');
      console.log(data.wasTapped, 'notfications data');

      if (data.wasTapped) {
        console.log('Received in background');
      } else {
        console.log('Received in foreground');
      }
      setTimeout(() => {
        if (data.Type === 'Annoucement') {
          this.navCtrl.navigateRoot('/notifications');
        } else if (data.Type === 'Appointment') {
          this.navCtrl.navigateRoot('/home/tabs/tab3');
        }
      }, 4000);
    });
  }

  async logout() {
    this.authService.logout();
    this.sharedService.changeAuthTokenCheck(null);
    this.sharedService.changeLoginCheck(await this.authService.isLoggedIn());
    this.navCtrl.navigateRoot('/login');
  }
  scrollToBottom() {
    this.content.scrollToBottom();
  }
}
