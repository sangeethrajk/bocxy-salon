import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PermissionService } from '../_services/permission.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit {

  constructor(
    private _location: Location,
    private permissionService: PermissionService,
    private navCtrl: NavController
  ) {
    this.permissionService.checkPermissionAccess('EXPENSE_MANAGEMENT').then(
      data => {
        if (!data) {
          this.navCtrl.navigateRoot('/login');
        }
      }
    )

  }

  expenses = [
    { item: "House Rent", amount: "25000" },
    { item: "Electricity", amount: "7000" },
    { item: "Shampoo", amount: "2000" },
    { item: "Brushes", amount: "1000" },
    { item: "Sprays", amount: "1500" }
  ]
  ngOnInit() {
  }

  previous() {
    this._location.back();
  }
}
