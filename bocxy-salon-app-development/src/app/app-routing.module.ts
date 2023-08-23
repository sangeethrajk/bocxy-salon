import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./intro/intro.module').then(m => m.IntroPageModule)
    // loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: './signup/signup.module#SignupComponentModule'
  },
  {
    path: 'home',
    loadChildren: './tabs/tabs.module#TabsPageModule'
  },
  {
    path: 'intro',
    loadChildren: () => import('./intro/intro.module').then(m => m.IntroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'customer-info',
    loadChildren: () => import('./customer-info/customer-info.module').then(m => m.CustomerInfoPageModule)
  },
  {
    path: 'security-question',
    loadChildren: () => import('./security-question/security-question.module').then(m => m.SecurityQuestionPageModule)
  },
  {
    path: 'formen',
    loadChildren: () => import('./formen/formen.module').then(m => m.FormenPageModule)
  },
  {
    path: 'bookappointment/:merchantStoreServiceId',
    loadChildren: () => import('./bookappointment/bookappointment.module').then(m => m.BookappointmentPageModule)
  },
  {
    path: 'paylater/:appointmentId',
    loadChildren: () => import('./paylater/paylater.module').then(m => m.PaylaterPageModule)
  },
  {
    path: 'paymentmode',
    loadChildren: () => import('./paymentmode/paymentmode.module').then(m => m.PaymentmodePageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'helpsupport',
    loadChildren: () => import('./helpsupport/helpsupport.module').then(m => m.HelpsupportPageModule)
  },
  {
    path: 'myreviews',
    loadChildren: () => import('./myreviews/myreviews.module').then(m => m.MyreviewsPageModule)
  },
  {
    path: 'accountsettings',
    loadChildren: () => import('./accountsettings/accountsettings.module').then(m => m.AccountsettingsPageModule)
  },
  {
    path: 'changepassword',
    loadChildren: () => import('./changepassword/changepassword.module').then(m => m.ChangepasswordPageModule)
  },
  {
    path: 'forgotpw',
    loadChildren: () => import('./forgotpw/forgotpw.module').then(m => m.ForgotpwPageModule)
  },
  {
    path: 'createpw',
    loadChildren: () => import('./createpw/createpw.module').then(m => m.CreatepwPageModule)
  },
  {
    path: 'locationsearch',
    loadChildren: () => import('./locationsearch/locationsearch.module').then(m => m.LocationsearchModule)
  },
  {
    path: 'recoveryoption',
    loadChildren: () => import('./recoveryoption/recoveryoption.module').then(m => m.RecoveryoptionPageModule)
  },
  {
    path: 'answerquestion',
    loadChildren: () => import('./answerquestion/answerquestion.module').then(m => m.AnswerquestionPageModule)
  },
  {
    path: 'updatepw',
    loadChildren: () => import('./updatepw/updatepw.module').then(m => m.UpdatepwPageModule)
  },
  {
    path: 'recoveryotp',
    loadChildren: () => import('./recoveryotp/recoveryotp.module').then(m => m.RecoveryotpPageModule)
  },
  {
    path: 'seealltreatment',
    loadChildren: () => import('./seealltreatment/seealltreatment.module').then(m => m.SeealltreatmentPageModule)
  },
  {
    path: 'view-servicedetail',
    loadChildren: () => import('./view-servicedetail/view-servicedetail.module').then(m => m.ViewServicedetailPageModule)
  },
  {
    path: 'findstore',
    loadChildren: () => import('./findstore/findstore.module').then(m => m.FindstorePageModule)
  },
  {
    path: 'globalsearch',
    loadChildren: () => import('./globalsearch/globalsearch.module').then(m => m.GlobalsearchPageModule)
  },
  {
    path: 'seemoreservice/:serviceGroupId',
    loadChildren: () => import('./seemoreservice/seemoreservice.module').then(m => m.SeemoreservicePageModule)
  },
  {
    path: 'seemoreservice',
    loadChildren: () => import('./seemoreservice/seemoreservice.module').then(m => m.SeemoreservicePageModule)
  },
  {
    path: 'termscondition',
    loadChildren: () => import('./termscondition/termscondition.module').then(m => m.TermsconditionPageModule)
  },
  {
    path: 'detailappointment/:appointmentId',
    loadChildren: () => import('./detailappointment/detailappointment.module').then(m => m.DetailappointmentPageModule)
  },
  {
    path: 'detailannouncement/:annoucementId',
    loadChildren: () => import('./detailannouncement/detailannouncement.module').then(m => m.DetailannouncementPageModule)
  }



  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // }
  // {
  //   path: 'tab1',
  //   loadChildren: () => import('./tab1/tab1.module').then( m => m.Tab1PageModule)
  // },
  // {
  //   path: 'tab2',
  //   loadChildren: () => import('./tab2/tab2.module').then( m => m.Tab2PageModule)
  // },
  // {
  //   path: 'tab3',
  //   loadChildren: () => import('./tab3/tab3.module').then( m => m.Tab3PageModule)
  // },
  // {
  //   path: 'tab4',
  //   loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
