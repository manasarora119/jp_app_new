import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MyAccountPage} from '../../pages';
/**
 * Generated class for the NotLoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-not-login',
  templateUrl: 'not-login.html',
})
export class NotLoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  goToMyAccount() {
    this.navCtrl.setRoot(MyAccountPage);
  }
  ionViewDidLoad() {
  }

}
