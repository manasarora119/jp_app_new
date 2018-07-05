import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PdpPage } from '../pages';
import { Validators, FormBuilder } from '@angular/forms';
import { ValidationServiceProvider, 
  AppServiceProvider,
  ConstantsProvider, 
  TosterserviceProvider } from '../../providers/providers';
@IonicPage()
@Component({
  selector: 'page-qr-modal',
  templateUrl: 'qr-modal.html',
})
export class QrModalPage {
  sharemsg: any;
  msgForm: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController, 
    public formBuilder: FormBuilder,
    private AppService: AppServiceProvider,
    private toasterCtrl: TosterserviceProvider,
    public constants:ConstantsProvider 
  ) {

    this.sharemsg = this.navParams.get('sharemsg');
    this.msgForm = this.formBuilder.group({
      mobile_number: ["", Validators.compose([Validators.required, ValidationServiceProvider.mobileValidator])],
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrModalPage');
  }
  dismiss() {
    this.viewCtrl.dismiss(QrModalPage);
  }
  sendMessage() {

    console.log(this.sharemsg);
    this.AppService.sendMsg(this.msgForm.value.mobile_number, this.sharemsg).subscribe(
      (res) => {
        console.log(res);
        if (res && res == 'Sent.') {
          this.msgForm.controls['mobile_number'].setValue('');
          //this.msgForm.value.mobile_number = '';
          this.toasterCtrl.presentToast(this.constants.toastConfig().msgSent, 'bottom', '3000', false);
        } else {
          this.toasterCtrl.presentToast(this.constants.toastConfig().msgNotSent, 'bottom', '3000', false);
        }
      },
      error => {
        this.toasterCtrl.presentToast(this.constants.toastConfig().msgNotSent, 'bottom', '3000', false);
      });


  }
}
