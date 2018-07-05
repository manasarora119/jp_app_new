import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events,App } from 'ionic-angular';
import { AuthPage, HomePage,TermsPage,PrivacyPage } from '../pages';
import {
  GtmProvider, AppServiceProvider,
  BetaoutProvider, LoadingserviceProvider,
  UtilitiesProvider, TosterserviceProvider,
  GlobalFunctionProvider,
  LocalStorageProvider,
  ConstantsProvider
} from '../../providers/providers';
import { Vibration } from '@ionic-native/vibration';

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  public backinfo: any;
  public pid: any;
  public pqty: any;
  public backInfoType: any;
  public itemsToBag: any;
  public parrentId: any;
  public wishlistId: any;
  private listUrl: any;
  public productInfoObj: any;
  public isDeepLink: any;
  noNotification: any;
  constructor(private vibration: Vibration, public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: LocalStorageProvider,
    public loadingCtrl: LoadingserviceProvider,
    public toasterCtrl: TosterserviceProvider,
    public menuCtrl: MenuController,
    private AppService: AppServiceProvider,
    public utilities: UtilitiesProvider,
    public gtm: GtmProvider,
    private app: App,
    public betaout: BetaoutProvider,
    public events: Events,
    public globalFuntion: GlobalFunctionProvider,
    public constants:ConstantsProvider
  ) {
    this.gtm.gtminfo('page-landing', '/landing', 'landingView', 'landingView');
    this.backinfo = this.navParams.get('pageinfo');
    this.pid = this.navParams.get('pid');
    this.pqty = this.navParams.get('pqty');
    this.parrentId = this.navParams.get('parrentId');
    this.noNotification = this.navParams.get('data');
    this.backInfoType = this.navParams.get('type');
    this.isDeepLink = (this.navParams.get('isDeepLink') ? this.navParams.get('isDeepLink') : false);
    console.log(this.isDeepLink);

    this.wishlistId = this.navParams.get("wishlistIid");
    this.listUrl = this.navParams.get("listUrl");
    this.productInfoObj = (this.navParams.get('productInfoObj') ? this.navParams.get('productInfoObj') : "");
    console.log(this.productInfoObj);

    console.log("landing page type " + this.backInfoType)


    this.menuCtrl.enable(false);
    console.log("============= " + this.backinfo);
    console.log("============= " + this.parrentId);
  }

  ionViewDidLoad() {
  }

  goToAuth(type) {
    if (this.backinfo == 'list') {
      this.pid = 'list';
    }
    else if (this.backinfo == 'InviteEarnPage') {
      this.pid = 'InviteEarnPage';
    } else if (this.backinfo == 'wishlist') {
      this.pid = 'wishlist';
    } else if (this.backinfo == 'listingWishlist') {
      this.pid = 'listingWishlist';
    }
    else if (this.backinfo == 'component') {
      this.parrentId = this.pid;
      this.pid = 'component';
    }
    else if (this.backinfo == 'GiftCardPage') {
      this.pid = 'GiftCardPage';
    }
    else if (this.backinfo == 'MyAccountPage') {
      this.pid = 'MyAccountPage';
    }
    else if (this.backinfo == 'Qrhistory') {

      this.parrentId = this.pid;
      this.pid = 'Qrhistory';
    } else if (this.backinfo == 'gotohome') {
      this.parrentId = this.pid;
      this.pid = 'gotohome';
    } else if (this.backinfo == 'addToWishlist') {
      console.log("addToWishlist");
      console.log(this.pid);
      this.parrentId = this.pid;
      this.pid = 'addToWishlist';
    }


    if (type == 'login') {
      console.log("landing listing url login 2 " + this.listUrl);
      console.log("landing listing id login " + this.wishlistId);

      this.gtm.gtminfo('page-landing', '/landing', 'Login button', 'Login button');
      this.navCtrl.setRoot(AuthPage, { tabIndex: 1, pid: this.pid, pqty: this.pqty, parrentId: this.parrentId, pushNotification: this.noNotification, type: this.backInfoType, listUrl: this.listUrl, wishlistId: this.wishlistId, fromListing: this.backinfo, productInfoObj: this.productInfoObj });
    } else {
      console.log("landing listing url login 3 " + this.listUrl);
      console.log("landing listing id login " + this.wishlistId);
      this.gtm.gtminfo('page-landing', '/landing', 'Register button', 'Login button');
      this.navCtrl.setRoot(AuthPage, { tabIndex: 0, pid: this.pid, pqty: this.pqty, parrentId: this.parrentId, pushNotification: this.noNotification, type: this.backInfoType, listUrl: this.listUrl, wishlistId: this.wishlistId, fromListing: this.backinfo, productInfoObj: this.productInfoObj });
    }
  }

  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  openTnc() {
    this.app.getRootNav().push(TermsPage);
  }
  openPP() {
    this.app.getRootNav().push(PrivacyPage);
  }

  login(provider) {
    this.nativeStorage.deleteItems('token');
    if (this.utilities.isOnline()) {
      if (provider == 'facebook') {
        this.gtm.gtminfo('page-landing', '/landing', 'Facebook button', 'Facebook button');
        this.AppService.facebookLogin().then((res: any) => {

          this.nativeStorage.setnativeStorage('token', { token: res.data['_token'] });
          this.nativeStorage.setnativeStorage('provider', provider);
          this.gtm.gtminfo('page-login', '/login', 'Success login', 'Source=Facebook');
          this.accountInfo('Facebook');
        }, error => {
          console.log(error);
          this.toasterCtrl.presentToast(error, 'bottom', '5000', false);
        });
      } else {
        this.gtm.gtminfo('page-landing', '/landing', 'Google button', 'Facebook button');
        this.AppService.googleLogin().then((res: any) => {
          this.nativeStorage.setnativeStorage('token', { token: res.data['_token'] });
          this.nativeStorage.setnativeStorage('provider', provider);
          this.gtm.gtminfo('page-login', '/login', 'Success login', 'Source=Google');
          this.accountInfo('Google');
        }, error => {
          console.log("error");
        });
      }
    }
    else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  accountInfo(source) {
    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.AppService.acountinfo().subscribe((res) => {
        if (!res.error) {
          let user = res.data;
          let claetap = "email=" + user.email_id + "&name=" + user.first_name + "&source=" + source;
          // this.gtm.cleverTapSignup('User profile tracking', claetap);

          var atpos = user.email_id.indexOf("@");
          var dotpos = user.email_id.lastIndexOf(".");
          if (atpos < 1 || (dotpos - atpos < 2 || dotpos + 2 >= user.email_id.length)) {
            this.toasterCtrl.presentToast(this.constants.toastConfig().loginWithNotRegisteredEmailID, 'bottom', '3000', false);
            this.AppService.logout();
            this.navCtrl.setRoot(LandingPage);
            this.loadingCtrl.dismissLoadingCustom();
          }
          else {
            this.nativeStorage.setnativeStorage('user', user);
            console.log("user data on landing page");
            console.log(this.nativeStorage.getnativeStorage('user'));
            this.betaout.setCustomerProperties();
            console.log(this.backinfo);
            if (this.backinfo) {
              console.log("In" + this.backinfo)
              if (this.backinfo == 'list') {
                this.navCtrl.setRoot(HomePage, { pid: this.pid, frompdp: "fromlist" });
                this.loadingCtrl.dismissLoadingCustom();
                this.notificationEvents();
              } else if (this.backinfo == 'InviteEarnPage') {
                this.navCtrl.setRoot(HomePage, { pid: this.parrentId, frompdp: "InviteEarnPage" });
                this.loadingCtrl.dismissLoadingCustom();
              } else if (this.backinfo == 'GiftCardPage') {
                this.navCtrl.setRoot(HomePage, { pid: this.parrentId, frompdp: "GiftCardPage" });
                this.loadingCtrl.dismissLoadingCustom();
              } else if (this.backinfo == 'MyAccountPage') {
                this.navCtrl.setRoot(HomePage, { pid: this.parrentId, frompdp: "MyAccountPage" });
                this.loadingCtrl.dismissLoadingCustom();
              } else if (this.backinfo == 'component') {
                this.navCtrl.setRoot(HomePage, { pid: this.pid, frompdp: "component" });
                this.loadingCtrl.dismissLoadingCustom();
              } else if (this.backinfo == 'wishlist') {
                this.navCtrl.setRoot(HomePage, { pid: this.parrentId, frompdp: "wishlist" });
                this.loadingCtrl.dismissLoadingCustom();
              } else if (this.backinfo == 'gotohome') {
                this.globalFuntion.addToBag(this.pid, this.pqty);
                this.navCtrl.setRoot(HomePage);
                this.loadingCtrl.dismissLoadingCustom();
              } else if (this.backinfo == 'addToWishlist') {
                this.globalFuntion.addToWishList(this.pid);
                this.loadingCtrl.dismissLoadingCustom();
                this.navCtrl.setRoot(HomePage);
              }
              else if (this.backinfo == 'Qrhistory') {


                this.navCtrl.setRoot(HomePage, { pid: this.parrentId, frompdp: "Qrhistory" });
                //  this.loadingCtrl.dismissLoadingCustom();
                if (this.navParams.get('type') == 'wishlist') {
                  this.AppService.manageWishlist(this.pid).subscribe((res) => {
                    console.log(res);
                    if (res.error === false) {
                      this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
                    }
                  })
                }
                else if (this.navParams.get('type') == 'addtobag') {
                  this.AppService.addToBag(this.pid, 1).subscribe((res) => {
                    this.itemsToBag = res;
                    if (this.itemsToBag.error) {

                      if (this.itemsToBag.message == 'Record not found') {
                        let checkProductInCart = this.globalFuntion.checkProductInCart(this.pid);
                        if (checkProductInCart && checkProductInCart === true) {
                          this.toasterCtrl.presentToast(this.constants.toastConfig().productAlreadyInCart, 'bottom', '3000', false);
                        } else {
                          this.toasterCtrl.presentToast(this.constants.toastConfig().productOutOffStock, 'bottom', '3000', false);
                        }
                        //this.toasterCtrl.presentToast('Product out of stock', 'bottom', '3000', false);
                      } else {
                        this.toasterCtrl.presentToast(this.constants.toastConfig().productNotAvailable, 'bottom', '3000', false);
                      } 
                    } else {
                      this.vibration.vibrate(300);
                      this.toasterCtrl.presentToast(this.itemsToBag.data.message, 'bottom', '3000', false);
                      if (this.productInfoObj && this.productInfoObj != '') {
                        this.betaout.productAddedInCart(this.productInfoObj);
                      }
                      this.globalFuntion.saveProductToLocal(this.pid);
                      this.nativeStorage.setnativeStorage('cartCount', this.itemsToBag.data.productsCount);
                      this.events.publish('CartUpdated', this.itemsToBag.data.productsCount);

                    }

                  }, error => {

                  });

                }
                this.loadingCtrl.dismissLoadingCustom();
              }
              else if (this.backinfo == 'listingWishlist') {
                console.log("wishlist if backinfo 1 ============== ");
                this.navCtrl.setRoot(HomePage, { wId: this.wishlistId, listUrl: this.listUrl, fromListing: this.backinfo });
                if (this.wishlistId) {
                  console.log("if wishlist id =====" + this.wishlistId);
                  this.AppService.manageWishlist(this.wishlistId).subscribe((res) => {
                    console.log(res);
                    if (res.error === false) {
                      this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
                    }
                  })
                }
                this.loadingCtrl.dismissLoadingCustom();
              } else {
                if (this.backInfoType == 'wishlist') {
                  this.AppService.manageWishlist(this.parrentId).subscribe((res) => {
                    console.log(res);
                    if (res.error === false) {
                      this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
                    }
                  })
                } else {
                  //..............add to bag .............//
                  this.AppService.addToBag(this.pid, this.pqty).subscribe((res) => {
                    this.itemsToBag = res;
                    if (this.itemsToBag.error) {
                      if (this.itemsToBag.message == 'Record not found') {
                        let checkProductInCart = this.globalFuntion.checkProductInCart(this.pid);
                        if (checkProductInCart && checkProductInCart === true) {
                          this.toasterCtrl.presentToast(this.constants.toastConfig().productAlreadyInCart, 'bottom', '3000', false);
                        } else {
                          this.toasterCtrl.presentToast(this.constants.toastConfig().productOutOffStock, 'bottom', '3000', false);
                        }
                      } else {
                        this.toasterCtrl.presentToast(this.constants.toastConfig().productNotAvailable, 'bottom', '3000', false);
                      }
                    } else {
                      if (this.productInfoObj && this.productInfoObj != '') {
                        this.betaout.productAddedInCart(this.productInfoObj);
                      }
                      this.globalFuntion.saveProductToLocal(this.pid);
                      this.vibration.vibrate(300);
                      this.toasterCtrl.presentToast(this.itemsToBag.data.message, 'bottom', '3000', false);
                    }
                  }, error => {
                  });
                }

                //..............end....................//
                this.navCtrl.setRoot(HomePage, { pid: this.parrentId, frompdp: "frompdp" });
                this.loadingCtrl.dismissLoadingCustom();
                this.notificationEvents();
              }
            } else {
              this.loadingCtrl.dismissLoadingCustom();
              console.log('loader off');
              if (this.noNotification != undefined && this.noNotification['pushnotification'] != undefined) {
                // this.goToHome();
              } else {
                //this.loadingCtrl.dismissLoadingCustom();
                console.log('this.noNotification != undefined --->> else case')
                this.goToHome();
              }
              // this.goToHome();
              this.notificationEvents();
            }
            // this.loadingCtrl.dismissLoadingCustom();
          }
        } else {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
        }
      }, error => {
        this.loadingCtrl.dismissLoadingCustom();
      });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  notificationEvents() {
    console.log("Notification Data");
    console.log(this.noNotification);
    if (this.noNotification != undefined && this.noNotification['pushnotification'] != undefined) {
      console.log("Evenets fire");
      this.events.publish('user:pushNotification', this.noNotification, Date.now());
    }

  }

}
