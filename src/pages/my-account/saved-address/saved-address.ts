import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyAccountPage } from '../../pages';
import {
  AppServiceProvider,
  TosterserviceProvider,
  UtilitiesProvider,
  LoadingserviceProvider,
  ConstantsProvider
} from '../../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-saved-address',
  templateUrl: 'saved-address.html',
})
export class SavedAddressPage {
  public savedAddresses: any;
  constructor(private apiService: AppServiceProvider,
    public loadingCtrl: LoadingserviceProvider,
    public utilities: UtilitiesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public constants: ConstantsProvider,
    public toasterCtrl: TosterserviceProvider) {
    this.getSavedAddresses();
  }
  goToMyAccount() {
    //this.navCtrl.push(MyAccountPage);
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
  }

  getSavedAddresses() {
    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.apiService.getSavedAddresses().subscribe(
        (res) => {
          this.loadingCtrl.dismissLoadingCustom();
          if (!res.error) {
            this.savedAddresses = res.data.items;
          } else {
            this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
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
