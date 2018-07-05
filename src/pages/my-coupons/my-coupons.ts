import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyAccountPage } from '../pages'
import {
  AppServiceProvider, 
  LoadingserviceProvider, 
  TosterserviceProvider, 
  LocalStorageProvider,
  ConstantsProvider
} from '../../providers/providers';
import moment from 'moment';
import { Clipboard } from '@ionic-native/clipboard';
/**
 * Generated class for the MyCouponsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-coupons',
  templateUrl: 'my-coupons.html',
})
export class MyCouponsPage {
  couponcode: any;
  public itemscouponall: any
  public couponchk: number = 0;
  constructor(public toasterCtrl: TosterserviceProvider,
    private clipboard: Clipboard, public loadingCtrl: LoadingserviceProvider,
    private AppService: AppServiceProvider, public navCtrl: NavController,
    public nativeStorage: LocalStorageProvider,
    public constants:ConstantsProvider,
    public navParams: NavParams) {
    this.nativeStorage.deleteItems('notificationStatus');
    this.getCoupon();
  }

  ionViewDidLoad() {
  }
  back() {
    //this.navCtrl.push(MyAccountPage);
    this.navCtrl.pop();
  }
  getCoupon() {
    this.loadingCtrl.presentLoadingCustom();
    //......................Event product ................//

    this.AppService.getCouponInfo().subscribe((res) => {
      if (res && res.data.length != 0) {
        this.couponchk = 0;
        this.itemscouponall = res.data;
        this.couponcode=res.data[0].couponcode;
        if(this.couponcode==''){
          this.couponchk=1;
        }
        this.loadingCtrl.dismissLoadingCustom();
      } else {
        this.couponchk = 1;
        this.loadingCtrl.dismissLoadingCustom();
      }
    }, error => {
      this.couponchk = 1;
      this.loadingCtrl.dismissLoadingCustom();
    });
    //..............................end............................//

  }
  getdatformat(dt: any) {
    let dat = moment(dt).format("DD/MM/YY");
    return dat;
  }
  shareInfo(couponcode: any) {
    this.clipboard.copy(couponcode);
    this.toasterCtrl.presentToast(this.constants.toastConfig().copyCoupon, 'bottom', '3000', false);

  }

}
