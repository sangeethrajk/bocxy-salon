import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import {
  MerchantServiceDetails,
  ServiceList,
  ServiceCategoryList,
  serviceGroupList,
  ServiceGenderCategory
} from './addservices.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AddServiceService } from './addservices.service';
import { ToastService } from '../_services/toast.service';
import { LoadingController, NavController, AlertController, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Params } from '@angular/router';
import { take } from 'rxjs/operators';
import { DateService } from '../_services/date.service';
import { SharedService } from '../_services/shared.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { StylistGrade } from '../_models/stylistgrade.model';
import { Crop, CropOptions } from '@ionic-native/crop/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-addservices',
  templateUrl: './addservices.page.html',
  styleUrls: ['./addservices.page.scss'],
  providers: [Keyboard]
})
export class AddservicesPage implements OnInit {

  constructor(
    private _location: Location,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    private addServiceService: AddServiceService,
    private toast: ToastService,
    private loadingctrl: LoadingController,
    public route: ActivatedRoute,
    private dateService: DateService,
    private navCtrl: NavController,
    private sharedService: SharedService,
    private nav: NavigationHandler,
    private crop: Crop,
    private imagePicker: ImagePicker,
    private file: File,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    public keyboard: Keyboard
  ) {

  }
  timeSec: number;
  hours: number;
  temp: number;
  mins: number;
  secs: number;
  Hours: any;
  minutes: any;
  Dmin: number;
  Dhour: number;
  durationErr: boolean;
  requiredFormat: string;
  showOffer = false;
  showDisable = false;
  paramSubscription: Subscription;
  merchantStoreServiceId: number;
  editData: MerchantServiceDetails;
  services: ServiceList[]
  servicesGroupList: serviceGroupList[];
  serviceCategories: ServiceCategoryList[];
  merchantServiceForm: FormGroup;
  endDateErr: boolean;
  endTimeErr: boolean;
  categoryTouched: boolean;
  formSubmitted: boolean;
  title: boolean;
  isKeyboardHide = true;
  duration: number;

  selectedStylistGrades: number[];
  selectedServiceGenderCategory: number[];
  keyword = 'name';
  public serviceType = [];
  serviceGenderCategoryList: ServiceGenderCategory[];
  isLoading: boolean;
  // agencyUrlForm: string;
  customActionSheetOptions: any = {
    header: 'Select Services',
  };

  grades = [
    { title: 'Stylist Grades', serviceType: 'Body Massage', icon: 'chevron-down-outline' }
  ];
  stylistGrade: StylistGrade[];
  croppedImagepath = 'assets/img/img-placeholder.jpg';
  imagePickerOptions: ImagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50,
  };

  cropOptions: CropOptions = {
    quality: 50,
    targetHeight: 300,
    targetWidth: 736
  };

  isBannerChanged: boolean;

  async ngOnInit() {
    try {
      const loading = await this.loadingctrl.create({
        spinner: 'bubbles',
        message: 'Please wait...',
        cssClass: 'custom-spinner',
      });
      this.isBannerChanged = false;
      loading.present();
      this.loadServicesGroupList();
      await this.getSericeGenderCategory();
      console.log('sgawait');
      await this.getStylistGrade();
      await this.getHours();
      await this.getMinutes();

      this.paramSubscription = this.route.params.subscribe(
        async (params: Params) => {
          // tslint:disable-next-line: no-string-literal
          if (params['merchantStoreServiceId']) {
            // tslint:disable-next-line: no-string-literal
            this.merchantStoreServiceId = params['merchantStoreServiceId'];
            await this.getEditData();
            await this.loadServices(this.editData.serviceGroupId);
            for (const id of this.editData.professionistGrades) {
              for (const grade of this.stylistGrade) {
                if (id === grade.professionistGradeId) {
                  grade.isChecked = true;
                  break;
                }
              }
            }

            // this.editData.serviceGenderCategories = [];
            if (this.editData.serviceGenderCategories) {
              for (const id of this.editData.serviceGenderCategories) {
                for (const category of this.serviceGenderCategoryList) {
                  if (id === category.serviceGenderCategoryId) {
                    category.isSelected = true;
                    break;
                  }
                }
              }
            }


            if (this.editData.pictureUrl) {
              this.croppedImagepath = this.editData.pictureUrl;
            }
            await this.getCategories(this.editData.serviceId);

            this.DurationConversion(this.editData.duration);
            this.duration = this.editData.duration;
            this.merchantServiceForm = this.createForm();
            this.showOffer = this.editData.offer === 'Y' ? true : false;
            this.showDisable = this.editData.active === 'N' ? true : false;
            this.offerToggle();

            this.title = true;
            loading.dismiss();
          } else {
            this.merchantServiceForm = this.createForm();
            for (const grade of this.stylistGrade) {
              grade.isChecked = true;
            }
            this.offerToggle();
            loading.dismiss();
          }
        }
      );
    } catch (err) {
      console.log('something went wrong: ', err);
    }
  }
  createForm(): FormGroup {
    return this.formBuilder.group({
      serviceId: [
        this.editData ? this.editData.serviceId : null,
        Validators.compose([Validators.required]),
      ],
      serviceGroupId: [
        this.editData ? this.editData.serviceGroupId : null,
        Validators.compose([Validators.required]),
      ],
      category: [this.editData ? this.editData.serviceCategoryName : null, Validators.compose([
        Validators.required,
        this.ValidateCategory
      ])],
      price: [this.editData ? this.editData.price : null, Validators.compose([
        Validators.required,
        Validators.pattern(/^[0-9]{1,6}(\.[0-9]{1,2})?$/i),
      ])],
      offer: [
        this.editData ? (this.editData.offer === 'Y' ? true : false) : false,
      ],
      disable: [
        this.editData ? (this.editData.active === 'N' ? true : false) : false,
      ],
      showDisable: [
        null
      ],
      offerPrice: [
        this.editData ? this.editData.offerPrice : null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]{1,6}(\.[0-9]{1,2})?$/i),
        ]),
      ],
      offerStartDate: [
        this.editData && this.editData.offerStart ? this.dateService.dbDateTimeToDate(this.editData.offerStart) : null,
        Validators.compose([Validators.required])
      ],
      offerStartTime: [
        this.editData && this.editData.offerStart ? this.dateService.dbDateTimeToTime(this.editData.offerStart) : '00:00',
        Validators.compose([Validators.required])
      ],
      offerEndDate: [
        this.editData && this.editData.offerEnd ? this.dateService.dbDateTimeToDate(this.editData.offerEnd) : null,
        Validators.compose([Validators.required])
      ],
      offerEndTime: [
        this.editData && this.editData.offerEnd ? this.dateService.dbDateTimeToTime(this.editData.offerEnd) : '23:59',
        Validators.compose([Validators.required])
      ],
      // duration: [
      //   this.editData ? this.editData.duration : null,

      // ],
      durationmin: [
        this.editData ? this.editData.durationmin : null,

      ],
      durationHours: [
        this.editData ? this.editData.durationHour : null,
      ]
    });
  }
  DurationConversion(duration) {
    var minutes = duration % 60
    var hours = (duration - minutes) / 60
    this.editData.durationmin = minutes ? minutes.toString() : '0';
    this.editData.durationHour = hours ? hours.toString() : '0';
    this.Dhour = hours ? (hours * 60) : 0;
    this.Dmin = minutes ? minutes : 0;
    console.log(hours + ':' + minutes);
  }
  getEditData() {
    return new Promise((resolve, reject) => {
      this.addServiceService
        .getEditData(this.merchantStoreServiceId)
        .pipe(take(1))
        .subscribe(
          (data) => {
            // console.log(data);
            if (data && data.status === 'SUCCESS') {
              this.editData = data.data;
              console.log(this.editData);

            } else {
              this.toast.showToast('Something went wrong');
            }
            resolve(1);
          },
          (error) => {
            console.log(error);
            this.toast.showToast('Something went wrong');
            reject(error);
          }
        );
    });
  }

  loadServicesGroupList() {
    this.addServiceService
      .getserviceGroupList()
      .pipe(take(1))
      .subscribe(
        (data) => {
          if (data && data.status === 'SUCCESS') {
            this.servicesGroupList = data.data;
            console.log(this.services, 'servicevalues');
          } else {
            this.toast.showToast('Problem getting country list');
          }
        },
        async (err) => {
          this.toast.showToast('Problem getting country list');
        }
      );
  }
  loadServices(id) {
    return new Promise((resolve, reject) => {
      this.services = null;

      this.addServiceService
        .getServices(id)
        .pipe(take(1))
        .subscribe(
          (data) => {
            if (data && data.status === 'SUCCESS') {
              this.services = data.data;
              console.log(this.services, 'servicevalues');
            } else {
              this.toast.showToast('Problem getting services list');
            }
            resolve(1);
          },
          (err) => {
            this.toast.showToast('Problem getting services list');
            reject(err);
          }

        );
    });
  }

  getCategories(serviceId: number) {
    return new Promise((resolve, reject) => {
      this.addServiceService
        .getCategories(serviceId)
        .pipe(take(1))
        .subscribe(
          (data) => {
            resolve(1);
            if (data && data.status === 'SUCCESS') {
              this.serviceCategories = data.data;
              this.serviceType = data.data.map((x) => ({
                id: x.serviceCategoryId,
                name: x.name,
              }));
            } else {
              this.toast.showToast('Problem getting service categories');
            }
          },
          async (err) => {
            reject(err);
          }
        );
    });
  }
  async changeServiceGroupListDropdown(e) {
    try {
      this.services = null;
      ;
      this.merchantServiceForm.controls["serviceId"].setValue("");
      console.log(e.target.value);
      if (e.target.value) {
        await this.loadServices(e.target.value);
      }
    } catch (err) {
      this.toast.showToast('Problem getting service ');
    }
  }
  async changeServiceDropdown(e) {
    try {
      this.serviceCategories = undefined;
      if (e.target.value) {
        await this.getCategories(e.target.value);
      }
    } catch (err) {
      this.toast.showToast('Problem getting service categories');
    }
  }
  getHours() {

    this.Hours = [];
    let data;
    for (let i = 0; i <= 12; i++) {
      if (i === 1 || i === 0) {
        data = { name: i + " Hr", value: i }
      } else {
        data = { name: i + "  Hrs", value: i }
      }
      this.Hours.push(data);
    }
    console.log(this.Hours);

  }
  getMinutes() {
    this.minutes = [];
    let datas;
    for (let i = 0; i <= 12; i++) {
      const result = i * 5;
      if (i === 0) {
        datas = { name: result + " Min", value: result }
      } else {
        datas = { name: result + " Mins", value: result }
      }
      this.minutes.push(datas);
    }
  }
  durationmin() {
    this.Dmin = parseInt(this.merchantServiceForm.value.durationmin);

    console.log(this.Dmin);


    this.getDurationSeconds();

  }
  durationHours() {

    this.Dhour = parseInt(this.merchantServiceForm.value.durationHours);

    this.Dhour = Math.floor(this.Dhour * 60);
    console.log(this.Dhour);
    this.getDurationSeconds();

  }
  getDurationSeconds() {
    if (!this.Dhour && !this.Dmin) {
      this.durationErr = true;
    } else {
      this.durationErr = false;
    }
    if (!this.Dhour) {
      this.Dhour = 0;
    }
    if (!this.Dmin) {
      this.Dmin = 0;
    }

    this.duration = Math.floor((this.Dhour + this.Dmin));

  }

  offerToggle() {
    if (this.showOffer) {
      this.merchantServiceForm.get('offerPrice').enable();
      this.merchantServiceForm.get('offerStartDate').enable();
      this.merchantServiceForm.get('offerStartTime').enable();
      this.merchantServiceForm.get('offerEndDate').enable();
      this.merchantServiceForm.get('offerEndTime').enable();
    } else {
      this.merchantServiceForm.get('offerPrice').disable();
      this.merchantServiceForm.get('offerStartDate').disable();
      this.merchantServiceForm.get('offerStartTime').disable();
      this.merchantServiceForm.get('offerEndDate').disable();
      this.merchantServiceForm.get('offerEndTime').disable();
    }
  }
  ValidateCategory(control: AbstractControl) {
    if (typeof control.value === 'string') {
      return null;

    }
    return null;
  }
  checkOfferValidity() {
    setTimeout(() => {
      // tslint:disable-next-line: max-line-length
      if (
        this.merchantServiceForm.value.offerStartDate &&
        this.merchantServiceForm.value.offerStartTime &&
        this.merchantServiceForm.value.offerEndDate &&
        this.merchantServiceForm.value.offerEndTime
      ) {
        // tslint:disable-next-line: max-line-length
        const startObj = new Date(
          Date.parse(
            (
              this.merchantServiceForm.value.offerStartDate +
              ' ' +
              this.merchantServiceForm.value.offerStartTime +
              ':00'
            ).replace(/[-]/g, '/')
          )
        );
        // tslint:disable-next-line: max-line-length
        const endObj = new Date(
          Date.parse(
            (
              this.merchantServiceForm.value.offerEndDate +
              ' ' +
              this.merchantServiceForm.value.offerEndTime +
              ':00'
            ).replace(/[-]/g, '/')
          )
        );
        if (startObj < endObj) {
          this.endDateErr = false;
          this.endTimeErr = false;
        } else {
          const startPart = this.merchantServiceForm.value.offerStartDate.split(
            '-'
          );
          const startDate = new Date(
            startPart[0],
            startPart[1] - 1,
            startPart[2].substr(0, 2)
          );
          const endPart = this.merchantServiceForm.value.offerEndDate.split(
            '-'
          );
          const endDate = new Date(
            endPart[0],
            endPart[1] - 1,
            endPart[2].substr(0, 2)
          );
          if (startDate > endDate) {
            this.endDateErr = true;
            this.endTimeErr = false;
          } else {
            this.endDateErr = false;
            this.endTimeErr = true;
          }
        }
      } else {
        this.endDateErr = false;
        this.endTimeErr = false;
      }
    }, 0);
  }

  formSubmit() {
    this.formSubmitted = true;
    console.log(this.duration);
    this.getDurationSeconds();
    if (this.duration === 0 || !this.duration) {
      this.durationErr = true;
      return false;
    } else {
      this.durationErr = false;
    }
    // if ((this.Dmin === undefined && this.Dhour === undefined) || this.duration === 0 || this.duration === null) {
    //   this.durationErr = true;
    // }

    this.selectedStylistGrades = [];
    this.selectedServiceGenderCategory = [];
    for (const grade of this.stylistGrade) {
      if (grade.isChecked) {
        this.selectedStylistGrades.push(grade.professionistGradeId);
      }
    }

    for (const category of this.serviceGenderCategoryList) {
      if (category.isSelected) {
        this.selectedServiceGenderCategory.push(category.serviceGenderCategoryId);
      }
    }
    // tslint:disable-next-line: max-line-length
    if (
      this.merchantServiceForm.valid &&
      ((this.merchantServiceForm.value.offer &&
        !this.endDateErr &&
        !this.endTimeErr) ||
        !this.merchantServiceForm.value.offer) &&
      this.selectedStylistGrades.length > 0 && this.selectedServiceGenderCategory.length > 0
    ) {
      const formData: any = {
        serviceId: this.merchantServiceForm.value.serviceId,
        // tslint:disable-next-line: max-line-length
        serviceCategory: (typeof this.merchantServiceForm.value.category === 'string') ? this.merchantServiceForm.value.category.trim() : this.merchantServiceForm.value.category.name.trim(),
        price: this.merchantServiceForm.value.price,
        offer: this.merchantServiceForm.value.offer ? 'Y' : 'N',
      };
      if (this.merchantServiceForm.value.offer) {
        formData.offerPrice = this.merchantServiceForm.value.offerPrice;
        formData.offerStart =
          this.merchantServiceForm.value.offerStartDate +
          ' ' +
          this.merchantServiceForm.value.offerStartTime;
        formData.offerEnd =
          this.merchantServiceForm.value.offerEndDate +
          ' ' +
          this.merchantServiceForm.value.offerEndTime;
      }
      formData.professionistGrades = this.selectedStylistGrades;
      formData.serviceGenderCategories = this.selectedServiceGenderCategory;
      formData.pictureData = this.isBannerChanged ? this.croppedImagepath : null;
      formData.duration = this.duration;
      console.log(this.merchantServiceForm.value.duration);

      if (this.merchantServiceForm.value.disable) {
        formData.active = 'N';
      }
      else if (!this.merchantServiceForm.value.disable) {
        formData.active = 'Y';
      }
      if (this.editData) {
        formData.professionistGrades = this.selectedStylistGrades;
        this.addServiceService
          .updateMerchantService(formData, this.merchantStoreServiceId)
          .subscribe(
            (data) => {
              if (data && data.status === 'SUCCESS') {
                this.nav.GoBackTo('/tab2');
                this.sharedService.changeServiceRefresh('Refresh Services');
                this.toast.showToast('Updated successfully');
              } else {
                this.toast.showToast('Problem updating account');
              }
            },
            async (err) => {
              this.toast.showToast('Problem updating account');
            }
          );
      } else if (this.croppedImagepath) {
        this.addServiceService.insertMerchantService(formData).subscribe(
          (data) => {
            if (data && data.status === 'SUCCESS') {
              this.nav.GoBackTo('/tab2');
              this.sharedService.changeServiceRefresh('Refresh Services');
              this.toast.showToast('Added successfully');
            } else {
              this.toast.showToast('Problem creating service');
            }
          },
          async (err) => {
            this.toast.showToast('Problem creating service');
          }
        );
      }
    }
  }
  selectEvent(item) {
    // do something with selected item
  }
  onChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onFocused(e) {
    // do something
    this.categoryTouched = true;
  }
  toggleDetails(grades) {
    if (grades.showDetails) {
      grades.showDetails = false;
      grades.icon = 'chevron-down-outline';
    } else {
      grades.showDetails = true;
      grades.icon = 'chevron-forward-outline';
    }
  }


  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }
  disableToggle() {
    if (this.showDisable) {
      this.merchantServiceForm.get('showDisable').enable();
    } else {
      this.merchantServiceForm.get('showDisable').disable();
    }
  }

  getStylistGrade() {
    return new Promise((resolve, reject) => {
      this.addServiceService.getStylistGrades().pipe().subscribe(
        (response) => {
          if (response && response.status === 'SUCCESS') {
            this.stylistGrade = response.data;
          }
          else {
            this.toast.showToast('Something went wrong. Please try again');
          }
          resolve(null);
        },
        (error) => {
          this.toast.showToast('Something went wrong. Please try again');
          reject(error);
        }
      );
    });
  }

  async getSericeGenderCategory() {
    return new Promise((res, rej) => {
      this.addServiceService.getServiceGenderCategory().pipe().subscribe(
        (response) => {
          if (response && response.status === 'SUCCESS') {
            this.serviceGenderCategoryList = response.data;
          }
          else {
            this.toast.showToast('Something went wrong. Please try again');
          }

          res(1);
        },
        (error) => {
          this.toast.showToast('Something went wrong. Please try again');
          rej(error);
        }
      );
    });
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 50,
      allowEdit: false,
      correctOrientation: true,
      sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.cropImage(imageData);
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { targetHeight: 50, targetWidth: 75 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0]);
        },
        error => {
          alert('Error cropping image');
        }
      );
  }

  showCroppedImage(ImagePath) {
    this.isLoading = true;
    const copyPath = ImagePath;
    const splitPath = copyPath.split('/');
    const imageName = splitPath[splitPath.length - 1];
    const filePath = ImagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.isBannerChanged = true;
      this.croppedImagepath = base64;
      this.isLoading = false;
    }, error => {
      alert('Error in showing image' + error);
      this.isLoading = false;
    });
  }

  ionViewWillEnter() {
    this.keyboard.onKeyboardWillShow().subscribe(() => {
      this.isKeyboardHide = false;
      // console.log('SHOWK');
    });
    this.keyboard.onKeyboardWillHide().subscribe(() => {
      this.isKeyboardHide = true;
      // console.log('HIDEK');
    });
  }

}
