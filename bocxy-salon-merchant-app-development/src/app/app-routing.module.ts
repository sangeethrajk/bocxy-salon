import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: './signup/signup.module#SignupComponentModule'
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
    path: 'merchant-info',
    loadChildren: () => import('./merchant-info/merchant-info.module').then(m => m.MerchantInfoPageModule)
  },
  {
    path: 'security-question',
    loadChildren: () => import('./security-question/security-question.module').then(m => m.SecurityQuestionPageModule)
  },
  {
    path: 'createpw',
    loadChildren: () => import('./createpw/createpw.module').then(m => m.CreatepwPageModule)
  },
  {
    path: 'updatepw',
    loadChildren: () => import('./updatepw/updatepw.module').then(m => m.UpdatepwPageModule)
  },
  {
    path: 'calendarsettings',
    loadChildren: () => import('./calendarsettings/calendarsettings.module').then(m => m.CalendarsettingsPageModule)
  },
  {
    path: 'specialbhhistory',
    loadChildren: () => import('./specialbhhistory/specialbhhistory.module').then(m => m.SpecialbhhistoryPageModule)
  },
  {
    path: 'regularbhhistory',
    loadChildren: () => import('./regularbhhistory/regularbhhistory.module').then(m => m.RegularbhhistoryPageModule)
  },
  {
    path: 'createspecialbh',
    loadChildren: () => import('./createspecialbh/createspecialbh.module').then(m => m.CreatespecialbhPageModule)
  },
  {
    path: 'createregularbh',
    loadChildren: () => import('./createregularbh/createregularbh.module').then(m => m.CreateregularbhPageModule)
  },
  {
    path: 'slotconfig',
    loadChildren: () => import('./slotconfig/slotconfig.module').then(m => m.SlotconfigPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'addstylist',
    loadChildren: () => import('./addstylist/addstylist.module').then(m => m.AddstylistPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'addstylist/:accountId',
    loadChildren: () => import('./addstylist/addstylist.module').then(m => m.AddstylistPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'stylistmgmt',
    loadChildren: () => import('./stylistmgmt/stylistmgmt.module').then(m => m.StylistmgmtPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'announcements',
    loadChildren: () => import('./announcements/announcements.module').then(m => m.AnnouncementsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'expenses',
    loadChildren: () => import('./expenses/expenses.module').then(m => m.ExpensesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'myaccount',
    loadChildren: () => import('./myaccount/myaccount.module').then(m => m.MyaccountPageModule)
  },
  {
    path: 'helpsupport',
    loadChildren: () => import('./helpsupport/helpsupport.module').then(m => m.HelpsupportPageModule)
  },
  {
    path: 'appointmentlist',
    loadChildren: () => import('./appointmentlist/appointmentlist.module').then(m => m.AppointmentlistPageModule)
  },
  {
    path: 'walkincustomers',
    loadChildren: () => import('./walkincustomers/walkincustomers.module').then(m => m.WalkincustomersPageModule)
  },
  {
    path: 'cancelled',
    loadChildren: () => import('./cancelled/cancelled.module').then(m => m.CancelledPageModule)
  },
  {
    path: 'addservices',
    loadChildren: () => import('./addservices/addservices.module').then(m => m.AddservicesPageModule)
  },
  {
    path: 'addservices/:merchantStoreServiceId',
    loadChildren: () => import('./addservices/addservices.module').then(m => m.AddservicesPageModule)
  },
  {
    path: 'forgotpw',
    loadChildren: () => import('./forgotpw/forgotpw.module').then(m => m.ForgotpwPageModule)
  },
  {
    path: 'slotduration',
    loadChildren: () => import('./slotduration/slotduration.module').then(m => m.SlotdurationPageModule)
  },
  {
    path: 'recoveryoption',
    loadChildren: () => import('./recoveryoption/recoveryoption.module').then(m => m.RecoveryoptionPageModule)
  },
  {
    path: 'recoveryotp',
    loadChildren: () => import('./recoveryotp/recoveryotp.module').then(m => m.RecoveryotpPageModule)
  },
  {
    path: 'answerquestion',
    loadChildren: () => import('./answerquestion/answerquestion.module').then(m => m.AnswerquestionPageModule)
  },
  {
    path: 'shoplocation',
    loadChildren: () => import('./shoplocation/shoplocation.module').then(m => m.ShoplocationPageModule)
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
    path: 'referral',
    loadChildren: () => import('./referral/referral.module').then(m => m.ReferralPageModule)
  },
  {
    path: 'quickreport',
    loadChildren: () => import('./quickreport/quickreport.module').then(m => m.QuickreportPageModule)
  },
  {
    path: 'requestservice',
    loadChildren: () => import('./requestservice/requestservice.module').then(m => m.RequestservicePageModule)
  },
  {
    path: 'stylist-profile-complete',
    loadChildren: () => import('./stylist-profile-complete/stylist-profile-complete.module').then(m => m.StylistProfieCompletePageModule)
  },
  { path: 'tab2', loadChildren: './tab2/tab2.module#Tab2PageModule' },
  {
    path: 'locationsearch',
    loadChildren: () => import('./locationsearch/locationsearch.module').then(m => m.LocationsearchPageModule)
  },
  {
    path: 'invoice',
    loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoicePageModule)
  },
  {
    path: 'offersmgmt',
    loadChildren: () => import('./offersmgmt/offersmgmt.module').then(m => m.OffersmgmtPageModule)
  },
  {
    path: 'storetimemgmt',
    loadChildren: () => import('./storetimemgmt/storetimemgmt.module').then(m => m.StoretimemgmtPageModule)
  },
  {
    path: 'storetimecreate',
    loadChildren: () => import('./storetimecreate/storetimecreate.module').then(m => m.StoretimecreatePageModule)
  },
  {
    path: 'stylistpermission',
    loadChildren: () => import('./stylistpermission/stylistpermission.module').then(m => m.StylistpermissionPageModule)
  },
  {
    path: 'stylistpermission/:accountId',
    loadChildren: () => import('./stylistpermission/stylistpermission.module').then(m => m.StylistpermissionPageModule)
  },
  {
    path: 'grademgmt',
    loadChildren: () => import('./grademgmt/grademgmt.module').then(m => m.GrademgmtPageModule)
  },
  {
    path: 'creategrade',
    loadChildren: () => import('./creategrade/creategrade.module').then(m => m.CreategradePageModule)
  },
  {
    path: 'newappointmentlist',
    loadChildren: () => import('./newappointmentlist/newappointmentlist.module').then(m => m.NewAppointmentlistPageModule)
  },
  {
    path: 'appoinmenthistory',
    loadChildren: () => import('./appointmenthistory/appointmenthistory.module').then(m => m.AppointmentHistoryPageModule)
  },
  {
    path: 'appointmentservcie',
    loadChildren: () => import('./appointmentservice/appointmentservice.module').then(m => m.AppointmentServicePageModule)
  },
  {
    path: 'holidaymgmt',
    loadChildren: () => import('./holidaymgmt/holidaymgmt.module').then(m => m.HolidaymgmtPageModule)
  },
  {
    path: 'holidaymgmt/:merchantHolidayId',
    loadChildren: () => import('./holidaymgmt/holidaymgmt.module').then(m => m.HolidaymgmtPageModule)
  },
  // {
  //   path: 'permanentslots',
  //   loadChildren: () => import('./permanentslots/permanentslots.module').then(m => m.PermanentslotsPageModule)
  // },
  // {
  //   path: 'specialslots',
  //   loadChildren: () => import('./specialslots/specialslots.module').then(m => m.SpecialslotsPageModule)
  // },
  {
    path: 'holidaylist',
    loadChildren: () => import('./holidaylist/holidaylist.module').then(m => m.HolidaylistPageModule)
  },
  {
    path: 'mystorehelp',
    loadChildren: () => import('./mystorehelp/mystorehelp.module').then(m => m.MystorehelpPageModule)
  },
  {
    path: 'specialbooking',
    loadChildren: () => import('./specialbooking/specialbooking.module').then(m => m.SpecialbookingPageModule)
  },
  {
    path: 'defaultservicetime',
    loadChildren: () => import('./defaultservicetime/defaultservicetime.module').then(m => m.DefaultservicetimePageModule)
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
    path: 'detailannouncement',
    loadChildren: () => import('./detailannouncement/detailannouncement.module').then(m => m.DetailannouncementPageModule)
  },
  {
    path: 'addanotherservice/:appointmentId',
    loadChildren: () => import('./addanotherservice/addanotherservice.module').then(m => m.AddanotherservicePageModule)
  },





  // {
  //   path: 'usermanual',
  //   loadChildren: () => import('./usermanual/usermanual.module').then( m => m.UsermanualPageModule)
  // },






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
