import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UrlTree } from '@angular/router';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
@Injectable({
  providedIn: 'root'
})
export class NavigationHandler {
  constructor(private navController: NavController) { }

  GoForward(
    url: string | UrlTree | any[],
    options?: NavigationOptions
  ) {
    return this.navController.navigateForward(url, options);
  }

  GoBackTo(
    url: string | UrlTree | any[],
    options?: NavigationOptions
  ) {
    return this.navController.navigateBack(url, options);
  }

  GoBack(options?: NavigationOptions) {
    return this.navController.back(options);
  }
}
