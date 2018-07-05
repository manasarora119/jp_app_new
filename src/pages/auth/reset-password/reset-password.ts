import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Validators, FormBuilder} from '@angular/forms';
import { AuthModalsPage } from '../../pages';
import { UtilitiesProvider,GtmProvider } from '../../../providers/providers';
import {TranslateService} from 'ng2-translate/ng2-translate';


@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  public resetForm: any;
  public tap:any;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public utilities: UtilitiesProvider,
  public modalCtrl: ModalController,
  private gtm: GtmProvider,
  public translate : TranslateService) {
    this.tap=this.translate.instant("android");
    this.resetForm = this.formBuilder.group({
      password: ["", Validators.required],
      rePassword: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

   presentModal() {
    var options = {
      showBackdrop  : true,
      enableBackdropDismiss : true,
      cssClass : "reset-modal"
    };
    var data = { modal: 'resetSuccess' }
    let modal = this.modalCtrl.create(AuthModalsPage, data, options);
    modal.present();
  }


  reset() {
     this.gtm.gtminfo('page-ResetPassword','/ResetPassword','Success reset','Success reset');

    this.presentModal();
    
  }

  toggle(item) {
    this.utilities.togglePassword(item);
  }

}
