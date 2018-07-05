import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyAccountPage } from '../../pages';


@IonicPage()
@Component({
  selector: 'page-saved-cards',
  templateUrl: 'saved-cards.html',
})
export class SavedCardsPage {
  public savedCard:object;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.savedCard = [
      {
        bankName:"Yes Bank",
        cardNo  :"**** **** **** 1234",
        expires :"Expires on 10/19"
      },
      {
        bankName:"Kotak Bank",
        cardNo  :"**** **** **** 3453",
        expires :"Expires on 10/30"
      }
    ]
  }
  goToMyAccount() {
    this.navCtrl.setRoot(MyAccountPage);
  }
  ionViewDidLoad() {
  }

}
