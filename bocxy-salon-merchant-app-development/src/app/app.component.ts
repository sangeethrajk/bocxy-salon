import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Platform, NavController, AlertController, ActionSheetController, PopoverController, MenuController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Pages } from './interfaces/pages';
import { timer } from 'rxjs/observable/timer';
import { AuthService } from './_services/auth.service';
import { SharedService } from './_services/shared.service';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { StylistProfieCompletePage } from './stylist-profile-complete/stylist-profile-complete.page';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
import { PermissionService } from './_services/permission.service';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonContent } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(IonContent) content: IonContent;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
    private navCtrl: NavController,
    private authService: AuthService,
    private sharedService: SharedService,
    private deeplinks: Deeplinks,
    private storage: Storage,
    public alertController: AlertController,
    private location: Location,
    private permissionService: PermissionService,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private modalController: ModalController,
    private menu: MenuController,
    private toastController: ToastController,
    public translate: TranslateService,
    public TranslateModule: TranslateModule,
    private firebaseX: FirebaseX
  ) {

    this.lang = 'en';
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.initializeApp();

    this.sharedService.currentProfileCheck.subscribe(async (d) => {
      // if (d) {
      await this.updateProfileData();
      this.checkMyStore();
      if (this.userData && !this.userData.roleCodes.includes('MR')) {
        this.pages.map(async data => {
          if (this.userData.permissions.length > 0) {
            if (data.name) {
              const available = this.userData.permissions.includes(data.name);
              if (!available) {
                data.disable = true;
              }
              else {
                data.disable = false;
              }
            }
          } else {
            if (data.name === 'CUSTOMER_MANAGEMENT' || data.name === 'EXPENSE_MANAGEMENT' || data.name === 'ANNOUNCEMENT_MANAGEMENT') {
              data.disable = true;
            } else {
              data.disable = false;
            }
          }
        });
      }
      // }
    });
  }

  selectedmenu: any;
  login: boolean;
  selectedIcon: any = 'assets/icon/male_icon.svg';
  roleCode: string;

  showSplash = true;
  userData: any;
  lang: any;

  backButtonSubscription: Subscription;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  public appPages: Array<Pages>;
  pages = [
    {
      title: 'SIDE_MENU_ITEMS.HOME',
      url: '/home',
      direct: 'root',
      icon: 'home-outline',
      name: '',
      disable: false
    },
    {
      title: 'SIDE_MENU_ITEMS.MY_STORE',
      url: '/home/tabs/storeconfig',
      direct: 'forward',
      icon: 'briefcase-outline',
      name: '',
      class: 'icon-shop',
      disable: false
    },
    {
      title: 'SIDE_MENU_ITEMS.CUSTOMERS',
      url: '/home/tabs/tab4',
      // url: '/home',
      direct: 'root',
      icon: 'people-outline',
      name: 'CUSTOMER_MANAGEMENT',
      disable: false
    },
    {
      title: 'SIDE_MENU_ITEMS.APPOINTMENT_HISTORY',
      url: '/appoinmenthistory',
      // url: '/home',
      direct: 'forward',
      icon: 'document-text-outline',
      name: '',
      disable: false
    },
    // {
    //   title: 'Appointment Config',
    //   url: '/slotconfig',
    //   // url: "/home",
    //   direct: 'forward',
    //   icon: 'calendar-outline',
    // },
    // {
    //   title: 'Expenses',
    //   url: '/home',
    //   direct: 'root',
    //   icon: 'cash-outline',
    //   name: 'EXPENSE_MANAGEMENT',
    //   disable: false
    // },
    {
      title: 'SIDE_MENU_ITEMS.ANNOUNCEMENT',
      url: '/announcements',
      // url: '/home',
      direct: 'forward',
      icon: 'megaphone-outline',
      name: 'ANNOUNCEMENT_MANAGEMENT',
      disable: false
    },

    // {
    //   title: 'Stylist Management',
    //   url: '/stylistmgmt',
    //   direct: 'root',
    //   icon: 'lock-closed-outline',
    // },
    {
      title: 'SIDE_MENU_ITEMS.MY_ACCOUNT',
      url: '/myaccount',
      direct: 'forward',
      icon: 'person-outline',
      name: '',
      disable: false
    },
    {
      title: 'SIDE_MENU_ITEMS.HELP_SUPPORT',
      url: '/helpsupport',
      direct: 'root',
      icon: 'help-circle-outline',
      name: '',
      disable: false
    },
    {
      title: 'SIDE_MENU_ITEMS.SIGN_OUT',
      url: '/login',
      direct: 'forward',
      icon: 'log-out-outline',
      name: '',
      disable: false
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

  switchLanguage() {
    this.translate.use(this.lang);
    console.log(this.lang);
    this.scrollToBottom();
  }


  ngAfterViewInit(): void {
    this.backButtonEvent();
  }

  async updateProfileData() {
    this.userData = await this.storage.get('userData');
    if (this.userData) {
      this.roleCode = this.userData.roleCodes;
      if (this.userData.pictureUrl == null) {
        this.selectedIcon = 'assets/icon/male_icon.svg';
      } else {
        this.selectedIcon = this.userData.pictureUrl;
      }
    }
  }

  checkMyStore() {
    const storeIndex = this.pages.findIndex(data => data.title == 'SIDE_MENU_ITEMS.MY_STORE');
    this.storage.get('userData').then(x => {
      if (x) {
        this.roleCode = x.roleCodes;
        if (!this.roleCode.includes('MR')) {
          if (x.permissions && x.permissions.length > 0) {
            if (
              (!x.permissions.includes('SERVICE_MANAGEMENT')) &&
              (!x.permissions.includes('STYLIST_MANAGEMENT')) &&
              (!x.permissions.includes('STYLIST_SLOT_CONFIGURATION')) &&
              (!x.permissions.includes('BANNERS_MANAGEMENT')) &&
              (!x.permissions.includes('STORE_TIME_MANAGEMENT'))) {
              this.pages[storeIndex].disable = true;
            }
            else {
              this.pages[storeIndex].disable = false;
            }
          }
          else {
            this.pages[storeIndex].disable = true;
          }
        }
        else {
          this.pages[storeIndex].disable = false;
        }
      }
    });
  }




  async initializeApp() {
    this.platform
      .ready()
      .then(() => {
        // let status bar overlay webview
        this.statusBar.overlaysWebView(false);
        // set status bar to black
        this.statusBar.backgroundColorByHexString('#f7f7f7');
        // this.statusBar.styleLightContent();

        this.statusBar.styleDefault();
        // this.splashScreen.hide();
        setTimeout(() => {
          this.splashScreen.hide();
        }, 1000);
        timer(3000).subscribe(() => (this.showSplash = false));

        this.authService.isLoggedIn().then((data) => {
          this.login = data;
          if (data) {
            this.storage.get('firstLogin').then(x => {
              if (x === 'Y') {
                this.navCtrl.navigateRoot('/slotduration');
              } else {
                this.navCtrl.navigateRoot('/home');
              }
            });
          }
          // else { this.navCtrl.navigateRoot('/login'); }
        });
        this.notificationSubscribe();
      })
      .catch(() => { });

    await this.platform.ready();

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
        if (data.Type === 'Appointment') {
          this.navCtrl.navigateRoot('/newappointmentlist');
        }
      }, 4000);
    });
  }
  openPage(page) {
    this.selectedmenu = page.title;
    console.log(this.selectedmenu);
  }

  onSplitPaneVisible(e) { }
  async logout() {
    this.authService.logout();
    this.sharedService.changeAuthTokenCheck(null);
    this.sharedService.changeLoginCheck(await this.authService.isLoggedIn());
    this.navCtrl.navigateRoot('/login');
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

        // close popover
        try {
          const element = await this.popoverCtrl.getTop();
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
  async presentToast(messageToPresent: string) {
    const toast = await this.toastController.create({
      duration: 1000,
      header: messageToPresent,
      position: 'bottom',
      cssClass: 'exitToast'
    });
    toast.present();
  }
  scrollToBottom() {
    this.content.scrollToBottom();
  }
}
