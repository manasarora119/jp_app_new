import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController } from 'ionic-angular';
import {MyCouponsPage,LandingPage,HomePage,GiftCardsPage, MyOrdersPage, OrdersDetailPage, JpCreditsPage,InviteEarnPage,SavedCardsPage,SavedAddressPage, FavouriteLookPage,EmptyOrderPage} from '../pages'
import {
  GtmProvider,AppServiceProvider,LocalStorageProvider,BetaoutProvider
} from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {


  constructor(public navCtrl: NavController, 
    private nativeStorage: LocalStorageProvider,public navParams: NavParams,private gtm: GtmProvider,  public menuCtrl: MenuController,public AppService :AppServiceProvider,
    public betaout:BetaoutProvider,
  ) {
   this.gtm.gtminfo('page-myAccount','/myAccount','myAccountView','myAccountView');
   this.nativeStorage.deleteItems('notificationStatus');
  }

  goToOrders() {
     this.gtm.gtminfo('page-myAccount','/myAccount','My orders','My orders');
    this.navCtrl.push(MyOrdersPage);
  }
  goToOrdersDetail() {
    this.navCtrl.push(OrdersDetailPage);
  }
  goToCredits() {
     this.gtm.gtminfo('page-myAccount','/myAccount','My Account Credit','My Account Credit');
    this.navCtrl.push(JpCreditsPage);
  }
  goToInviteEarn() {
     this.gtm.gtminfo('page-myAccount','/myAccount','Referral','Referral');
    this.navCtrl.push(InviteEarnPage);
  }
  goToSavedCard() {
    this.gtm.gtminfo('page-myAccount','/myAccount','My Account Saved cards','My Account Saved cards');
    this.navCtrl.push(SavedCardsPage);
  }
  goToSavedAddress() {
     this.gtm.gtminfo('page-myAccount','/myAccount','My Account address','My Account address');
    this.navCtrl.push(SavedAddressPage);
  }
  goToFavouriteLook(){
    this.navCtrl.push(FavouriteLookPage);
  }
  goToNotLogin(){
    this.navCtrl.push(EmptyOrderPage);
  }
  ionViewDidLoad() {
  }
  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }
  goToGiftCard() {
    this.gtm.gtminfo('page-myAccount','/myAccount','Gift card','Gift card');
    this.navCtrl.push(GiftCardsPage);
  }
  logout()
  {
      this.gtm.gtminfo('page-Side nav','/Side nav','Logout','Logout');
      //logout from betaout
      this.betaout.logout();      
      this.menuCtrl.close(); 
      this.AppService.logout();
      this.navCtrl.setRoot(LandingPage);
  }
  goToMycoupon(){
      this.navCtrl.push(MyCouponsPage);
  }

}
