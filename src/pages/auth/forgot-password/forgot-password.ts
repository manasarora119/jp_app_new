import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthPage } from '../../pages';
import { Validators, FormBuilder } from '@angular/forms';
import {TranslateService} from 'ng2-translate/ng2-translate';

import {
  UtilitiesProvider,
 TosterserviceProvider,
  LoadingserviceProvider,
  ValidationServiceProvider,
  ModelinfoProvider,
  AppServiceProvider,GtmProvider,
  ConstantsProvider
} from '../../../providers/providers';



@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})

export class ForgotPasswordPage {
  public forgotForm: any;
  itemspartners: any;
  backinfo:any;
  product_id:any;
  public tap:any;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public utilities: UtilitiesProvider,
    public loadingCtrl: LoadingserviceProvider,
    public toasterCtrl: TosterserviceProvider,
    public Modelinfo: ModelinfoProvider,
    public constants:ConstantsProvider,
    private AppService: AppServiceProvider,private gtm: GtmProvider,public translate : TranslateService
  ) {
    this.tap=this.translate.instant("android");
      this.backinfo = this.navParams.get('frompdp');
    this.product_id = this.navParams.get('pid');
    this.forgotForm = this.formBuilder.group({
      'email': ['', [Validators.required, ValidationServiceProvider.emailValidator]],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }


  forgot() {
      this.gtm.gtminfo('page-ForgotPassword','/ForgotPassword','Forgot password','Forgot password');
    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.AppService.forgotPassword(this.forgotForm.value).subscribe(res => {
        console.log(res);
        if (res.error) {
          this.loadingCtrl.dismissLoadingCustom();
          this.forgotForm.controls['email'].setValue('');
          this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
          // this.Modelinfo.showModal(this.valuessplit[0], this.valuessplit[1]);          
        } else {
          this.loadingCtrl.dismissLoadingCustom();
          console.log(this.backinfo);
          // this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
          if(this.backinfo){
             this.navCtrl.setRoot(AuthPage, { tabIndex: 1, pid: this.product_id, frompdp: "frompdp" });
             this.Modelinfo.showModal(res.message,  this.forgotForm.value.email);
           }else{
              this.navCtrl.setRoot(AuthPage, { tabIndex: 1 });
              this.Modelinfo.showModal(res.message,  this.forgotForm.value.email);
          }
        }
      }, error => {
        this.loadingCtrl.dismissLoadingCustom();
        // this.toasterCtrl.presentToast('please check your internet connection', 'bottom', '3000', false);
        console.log("error");
      });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }

  }

  back() {
    this.navCtrl.setRoot(AuthPage, { tabIndex: 1, pid: this.product_id, frompdp: "frompdp" });
  }




}
