import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import {
  AppServiceProvider,
  GtmProvider, LoadingserviceProvider, UtilitiesProvider, LocalStorageProvider, TosterserviceProvider,
  BetaoutProvider,
  ConstantsProvider
} from '../../providers/providers';



import { CartPage, LandingPage, HomePage, SearchPage, WishlistPage } from '../pages';
/**
 * Generated class for the MicrositePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-microsite',
  templateUrl: 'microsite.html',
})
export class MicrositePage {
  public compchk: any;
  public compinfo: any;
  public bagcount: any;
  isLoggedIn: any;
  public loginchkval: number = 0;
  public micrositeinfo: any;

  constructor(public navCtrl: NavController,
    public events: Events,
    public betaout: BetaoutProvider,
    public utitlities: UtilitiesProvider,
    public toasterCtrl: TosterserviceProvider,
    public navParams: NavParams,
    public utilities: UtilitiesProvider,
    public loadingCtrl: LoadingserviceProvider,
    public nativeStorage: LocalStorageProvider,
    public constants:ConstantsProvider,
    private AppService: AppServiceProvider, private gtm: GtmProvider) {
    this.nativeStorage.deleteItems('notificationStatus');
    this.isLoggedIn = this.AppService.isLoggedIn();
    this.gtm.gtminfo('page-microSite', '/microSite', 'microSiteView', 'microSiteView');
    this.compchk = this.navParams.get('pid');
    console.log(this.compchk);
    this.micrositeinfo = 'page-microSite(' + this.compchk + ')';
    this.gtm.gtminfo(this.micrositeinfo, '/microSite', 'microSiteView', 'microSiteView');
    if (this.compchk == '' || this.compchk == null) {
      this.compchk = 'home';
    }

    if (this.compchk) {
      let data = [];
      data.push(
        { 'name': 'special_page', 'value': this.compchk }
      );
      this.betaout.specialPage(data);
    }

    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.getCartCount();
      //........................compnent ifno ................//
      this.AppService.getCoponentsinfo(this.compchk).subscribe((res) => {
        this.loadingCtrl.dismissLoadingCustom();
        if (res.data && res.data.length != 0 && res.data != 'No Data found') {
          this.compinfo = res.data;
        }
      }, error => {
        this.loadingCtrl.dismissLoadingCustom();
      });
      //................................end.......................//
    }else{
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
    this.events.subscribe('CartUpdated', () => {
      this.setCartCount();
    })

  }

  ionViewDidLoad() {
  }
  loadmenudata() {
    var statusmenudata = this.nativeStorage.getnativeStorage('menudataStatus');
    var sidenav = this.nativeStorage.getnativeStorage('sidenav');
    if (this.utilities.isOnline()) {
      if (!sidenav) {
        this.loadingCtrl.presentLoadingCustom();
        // this.events.publish('getmenudata');
        this.events.publish('sidenav');
        setTimeout(() => {
          this.loadingCtrl.dismissLoadingCustom();
        }, 1000);
      }

      if (!statusmenudata) {
        this.events.publish('getmenudata');
      }
    }
    else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }
  goToCart() {
    if (this.AppService.isLoggedIn()) {
      this.navCtrl.push(CartPage);
    } else {
      // this.navCtrl.push(LandingPage);
      this.navCtrl.setRoot(LandingPage);

    }
  }
  setCartCount() {
    this.bagcount = this.nativeStorage.getnativeStorage('cartCount');
  }


  gotoWishlist() {
    if (this.AppService.isLoggedIn()) {
      this.navCtrl.push(WishlistPage);
    } else {
      this.navCtrl.setRoot(LandingPage);
    }
  }

  getCartCount() {
    this.AppService.getItemsInCart().subscribe((res) => {
      if (!res.error) {
        this.bagcount = res.data.items.length;
        this.nativeStorage.setnativeStorage('cartCount', res.data.items.length);
      }
    });
  }

  gotohomepage() {
    this.navCtrl.setRoot(HomePage);
  }
  search() {
    this.navCtrl.push(SearchPage);
  }
}
