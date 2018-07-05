import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {
  AppServiceProvider
} from '../../providers/providers';

import { Response } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {
  termsdata: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public AppService: AppServiceProvider) {
    this.terms();
  }

  ionViewDidLoad() {
  }
  terms() {
    this.AppService.TermsAndCondtion().map((res: Response) => res.json())
      .subscribe(
      (res) => {
        this.termsdata = res.data;
      }, error => {
        //   this.toasterCtrl.presentToast(error.message, 'bottom', '3000', false);
      });
  }
back(){
  this.navCtrl.pop();
}
  
}

