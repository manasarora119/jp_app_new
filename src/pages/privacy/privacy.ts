import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {
  AppServiceProvider
} from '../../providers/providers';

import { Response } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
})
export class PrivacyPage {
  privacydata: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public AppService: AppServiceProvider) {
    this.private();
  }

  ionViewDidLoad() {
  }
  private() {
    this.AppService.Privacy().map((res: Response) => res.json())
      .subscribe(
      (res) => {
        this.privacydata = res.data;
      }, error => {
        //   this.toasterCtrl.presentToast(error.message, 'bottom', '3000', false);
      });

  }

  back(){
    this.navCtrl.pop();
  }
}
