import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { IonContent } from "@ionic/angular";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { helpSupportService } from "./helpsupport.service";
import { ToastService } from "../_services/toast.service";

import { LoadingController, NavController } from "@ionic/angular";

@Component({
  selector: "app-helpsupport",
  templateUrl: "./helpsupport.page.html",
  styleUrls: ["./helpsupport.page.scss"],
})
export class HelpsupportPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  helpSupport = "usermanual";
  helpsupportForm: FormGroup;
  formSubmitted: boolean;
  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private helpSupportService: helpSupportService,
    private loadingctrl: LoadingController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    this.helpsupportForm = this.formBuilder.group({
      Subject: [null, Validators.compose([Validators.required])],
      Message: [null, Validators.compose([Validators.required])],
    });
  }

  async segmentChanged(ev) {
    this.scrollToTop();
    console.log(this.helpSupport);
  }

  formSubmit() {
    this.formSubmitted = true;
    if (!this.helpsupportForm.valid) {
      return;
    } else {
      const formData: any = {
        Subject: this.helpsupportForm.value.Subject,
        Message: this.helpsupportForm.value.Message,
      };    
      this.helpSupportService.sendMail(formData).subscribe(
        (data) => {
          if (data && data.status === "SUCCESS") {
            this.navCtrl.navigateRoot("/home");
            this.toast.showToast("Your mail has been sent successfuly ! Thank you");
          } else {
            this.toast.showToast("Problem sending Mail.Please try again later");
          }
        },
        async (err) => {
          this.toast.showToast("Problem sending Mail.Please try again later");
        }
      );
    }
  }

  scrollToTop() {
    this.content.scrollToTop();
  }
  previous() {
    this.location.back();
  }
}
