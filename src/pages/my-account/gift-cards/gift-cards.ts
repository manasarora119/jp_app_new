import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GiftCardsDetailsPage } from '../../pages';
import {
  TosterserviceProvider,
  AppServiceProvider,
  UtilitiesProvider,
  LoadingserviceProvider, LocalStorageProvider,
  ConstantsProvider
} from '../../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-gift-cards',
  templateUrl: 'gift-cards.html',
})
export class GiftCardsPage {
  public collection: any;
  public bannerData: any;
  giftAmountData: any;
  internetflag: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private AppService: AppServiceProvider,
    public toasterCtrl: TosterserviceProvider,
    public loadingCtrl: LoadingserviceProvider,
    public nativeStorage: LocalStorageProvider,
    public constants:ConstantsProvider,
    public utilities: UtilitiesProvider) {
    this.nativeStorage.deleteItems('notificationStatus');
    this.getGiftAmountData();
    this.getGiftCarddata();
  }

  goToMyAccount() {
    this.navCtrl.pop();
  }
  goToGiftDetail(card_id) {
    this.navCtrl.push(GiftCardsDetailsPage, { 'card_id': card_id, giftAmountData: this.giftAmountData });
  }
  ionViewDidLoad() {
  }

  getGiftCarddata() {
    var ts = this;
    this.AppService.getGiftCardData().subscribe(
      (result) => {
        if (result.error == false) {
          this.bannerData = result.data[0];
        } else {
          ts.toasterCtrl.presentToast(result.message, 'bottom', '3000', false);
        }
      }, error => {
        ts.internetflag = 1;
        ts.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
      });
  }

  getGiftAmountData() {
    return new Promise((resolve, reject) => {
      if (this.utilities.isOnline()) {
        this.AppService.getGiftAmountData().subscribe(
          (res) => {
            if (!res.error) {
              this.giftAmountData = res;
              this.collection = res['data']['items'];
              resolve("Success");
            } else {
              this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
              reject('fails');
            }
          },
          (err) => {
            console.log(err);
            reject('fails');
          });
      } else {
        this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
      }
    });
  }

}
