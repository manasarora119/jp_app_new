import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {
  AppServiceProvider
} from '../../providers/providers';

import { Response } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  contactdata: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public AppService: AppServiceProvider) {
     this.contact();
  }

  ionViewDidLoad() { }

  contact() {
   
    this.AppService.contactUs().map((res: Response) => res.json())
      .subscribe(
      (res) => {
        this.contactdata = res.data;
      }, error => {
        //   this.toasterCtrl.presentToast(error.message, 'bottom', '3000', false);
      });
  }
back(){
  this.navCtrl.pop();
}
}
