import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastController, NavController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SharedService } from '../_services/shared.service';
import { NavigationHandler } from '../_services/navigation-handler.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.page.html',
  styleUrls: ['./myaccount.page.scss'],
})
export class MyaccountPage implements OnInit {

  userData: any;
  selectedIcon: any = "assets/icon/male_icon.svg";

  constructor(private _location: Location,
    public toastController: ToastController,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private storage: Storage,
    private nav: NavigationHandler,
    private sharedService: SharedService) { }

  async ngOnInit() { 
    await this.updateProfileData();
    this.sharedService.currentProfileCheck.subscribe(
      async d => {
        if(d) {
          await this.updateProfileData();
        }
      }
    )
  }

  async updateProfileData() {
    this.userData = await this.storage.get('userData');
        console.log("img:"+this.userData.pictureUrl);
        if(this.userData.pictureUrl == null){
          this.selectedIcon = 'assets/icon/male_icon.svg';
      }else{
        this.selectedIcon  =this.userData.pictureUrl;
      }
  }
  
  gotoChangePw() {
    this.navCtrl.navigateRoot('/changepassword');
    //this.presentToast();
  }

  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {   
    this.nav.GoBackTo(url);
  }

}
