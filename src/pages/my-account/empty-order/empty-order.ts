import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyAccountPage,HomePage } from '../../pages';
/**
 * Generated class for the EmptyOrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-empty-order',
  templateUrl: 'empty-order.html',
})
export class EmptyOrderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  goToMyAccount() {
    this.navCtrl.setRoot(MyAccountPage);
  }
  ionViewDidLoad() {
  }

  gotoHome(){
    this.navCtrl.setRoot(HomePage);
  }

}
