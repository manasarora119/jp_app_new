import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TranslateService} from 'ng2-translate/ng2-translate';
@IonicPage()
@Component({
  selector: 'page-help-screen',
  templateUrl: 'help-screen.html',
})
export class HelpScreenPage {
public tap:any;
public returnStat:any;
public orderDetails:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public translate : TranslateService) {
    this.tap=this.translate.instant("android");
  }

  ionViewDidLoad() {
    
  }
  mailto(email) {
    window.open(`mailto:${email}`, '_system');
  }
}
