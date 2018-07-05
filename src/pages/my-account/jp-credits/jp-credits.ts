import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyAccountPage } from '../../pages';
import {
  AppServiceProvider,
  TosterserviceProvider,
  UtilitiesProvider,
  LoadingserviceProvider,
  LocalStorageProvider,
  ConstantsProvider
} from '../../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-jp-credits',
  templateUrl: 'jp-credits.html',
})
export class JpCreditsPage {
  public userCredit: any;
  constructor(private apiService: AppServiceProvider, public loadingCtrl: LoadingserviceProvider,
    public utilities: UtilitiesProvider, public navCtrl: NavController,
    public navParams: NavParams,
    public constants:ConstantsProvider,
    public nativeStorage: LocalStorageProvider, public toasterCtrl: TosterserviceProvider) {
    this.nativeStorage.deleteItems('notificationStatus');
    this.getUserCredits();
  }
  goToMyAccount() {
    //this.navCtrl.push(MyAccountPage);
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
  }

  getUserCredits() {
    this.userCredit = {};
    this.userCredit.available_credit = {};
    this.userCredit.available_credit.current = 0;
    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.apiService.getUserCredits().subscribe(
        (res) => {
          this.loadingCtrl.dismissLoadingCustom();
          if (!res.error) {
            this.userCredit = res.data;
          } else {
            this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);;
          }
        },
        (err) => {
          this.loadingCtrl.dismissLoadingCustom();
          console.log(err);
        });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

}
