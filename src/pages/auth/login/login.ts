import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, ModalController, Events } from 'ionic-angular';
import { ForgotPasswordPage, HomePage, LandingPage,TermsPage,PrivacyPage } from '../../pages';
import { Vibration } from '@ionic-native/vibration';
import {
  LocalStorageProvider,
  UtilitiesProvider,
  TosterserviceProvider,
  LoadingserviceProvider,
  ValidationServiceProvider,
  ModelinfoProvider,
  BetaoutProvider,
  AppServiceProvider, GtmProvider, GlobalFunctionProvider, ConstantsProvider
} from '../../../providers/providers';
import { Validators, FormBuilder } from '@angular/forms';
import { HockeyApp } from 'ionic-hockeyapp';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  pushNotificationData: any;

  public loginForm: any;
  itemspartners: any;
  product_id: any = null;
  pqty: any;
  modelpopinfo: any;
  backinfo: any;
  itemsToBag: any;
  parrentId: any;
  pro_id: any;
  noNotification: any;
  wishlistId: any;
  listUrl: any;
  public productInfoObj: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public betaout: BetaoutProvider,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private app: App,
    public events: Events,
    private nativeStorage: LocalStorageProvider,
    public modalCtrl: ModalController,
    public utilities: UtilitiesProvider,
    public toasterCtrl: TosterserviceProvider,
    public loadingCtrl: LoadingserviceProvider,
    public Modelinfo: ModelinfoProvider,
    private AppService: AppServiceProvider,
    private gtm: GtmProvider,
    private vibration: Vibration,
    public globalFuntion: GlobalFunctionProvider,
    public constants:ConstantsProvider
  ) {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, ValidationServiceProvider.emailValidator]],
      password: ["", [Validators.required]]
    });
    this.backinfo = this.navParams.get('pageinfo');
    this.product_id = this.navParams.get('pageinfo');
    this.pro_id = this.navParams.get('pid');
    this.pqty = this.navParams.get('pqty');
    this.parrentId = this.navParams.get('parrentId');
    console.log(this.parrentId + "  pafent id iss +++++++++++++== ");
    this.noNotification = this.navParams.get('pushNotification');
    this.wishlistId = this.navParams.get('wishlistId');
    this.listUrl = this.navParams.get('listUrl');
    this.productInfoObj = (this.navParams.get('productInfoObj') ? this.navParams.get('productInfoObj') : "");
    console.log("login Page this.productInfoObj");
    console.log(this.productInfoObj);

    console.log("login listing page type " + this.navParams.get('type'));
    console.log(" this.backinfo " + this.backinfo);
    console.log("pro_id " + this.pro_id);
    console.log("pqty " + this.pqty);
    console.log("login parrentId " + this.parrentId);



  }

  ionViewDidLoad() {

  }

  goToForgot() {
    if (this.product_id) {
      this.app.getRootNav().setRoot(ForgotPasswordPage, { pid: this.product_id, frompdp: "frompdp" });
    } else {
      this.app.getRootNav().setRoot(ForgotPasswordPage);
    }

  }

  openTnc() {
    this.app.getRootNav().push(TermsPage);
  }
  openPP() {
    this.app.getRootNav().push(PrivacyPage);
  }


  login() {
    this.nativeStorage.deleteItems('token');
    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.AppService.login(this.loginForm.value).subscribe(
        (res) => {

          if (res.error) {

            this.loginForm.controls['password'].setValue('');
            this.Modelinfo.showModal(res.message, null);
            this.loadingCtrl.dismissLoadingCustom();
          } else {
            this.gtm.gtminfo('page-login', '/login', 'Success login', 'Source=EmailAddress');

            this.nativeStorage.setnativeStorage('token', { token: res.data['_token'] });
            this.nativeStorage.setnativeStorage('provider', 'password');
            // if(this.backinfo == 'gotohome'){

            // }else{
            this.accountInfo();
            //   }


            //this.loadingCtrl.dismissLoadingCustom();
          }
        },
        (error) => {
          console.log(error);
          this.loginForm.controls['password'].setValue('');
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
        });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }

  }


  accountInfo() {
    if (this.utilities.isOnline()) {

      this.AppService.acountinfo().subscribe((res) => {

        if (!res.error) {
          let user = res.data;
          // let claetap = "email=" + user.email_id + "&name=" + user.first_name + "&source=Email";
          // this.gtm.cleverTapSignup('User profile tracking', claetap);
          console.log(this.backinfo + '   llllllllllllllllllllllllllllllll    ll ')
          this.nativeStorage.setnativeStorage('user', user);
          this.betaout.setCustomerProperties();
          if (this.backinfo) {

            if (this.backinfo == 'list') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.product_id, frompdp: "fromlist" });
              this.loadingCtrl.dismissLoadingCustom();
              this.notificationEvents();
            } else if (this.backinfo == 'InviteEarnPage') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "InviteEarnPage" });
              this.loadingCtrl.dismissLoadingCustom();
              this.notificationEvents();
            }
            else if (this.backinfo == 'GiftCardPage') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "GiftCardPage" });
              this.loadingCtrl.dismissLoadingCustom();
              this.notificationEvents();
            }
            else if (this.backinfo == 'Qrhistory') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "Qrhistory" });

              console.log('line 151 ++++++++++++++++++++++++++===');
              console.log(this.parrentId);
              if (this.navParams.get('type') == 'wishlist') {
                this.AppService.manageWishlist(this.parrentId).subscribe((res) => {
                  console.log(res);
                  if (res.error === false) {
                    this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
                  }
                })
              }
              else if (this.navParams.get('type') == 'addtobag') {
                this.AppService.addToBag(this.parrentId, 1).subscribe((res) => {
                  this.itemsToBag = res;
                  if (this.itemsToBag.error) {

                    if (this.itemsToBag.message == 'Record not found') {
                      let checkProductInCart = this.globalFuntion.checkProductInCart(this.parrentId);
                      if (checkProductInCart && checkProductInCart === true) {
                        this.toasterCtrl.presentToast(this.constants.toastConfig().productAlreadyInCart, 'bottom', '3000', false);
                      } else {
                        this.toasterCtrl.presentToast(this.constants.toastConfig().productOutOffStock, 'bottom', '3000', false);
                      }
                    } else {
                      this.toasterCtrl.presentToast(this.constants.toastConfig().productNotAvailable, 'bottom', '3000', false);
                    }
                  } else {
                    this.vibration.vibrate(300);
                    this.toasterCtrl.presentToast(this.itemsToBag.data.message, 'bottom', '3000', false);
                    this.globalFuntion.saveProductToLocal(this.parrentId);
                    this.nativeStorage.setnativeStorage('cartCount', this.itemsToBag.data.productsCount);
                    this.events.publish('CartUpdated', this.itemsToBag.data.productsCount);
                    if (this.productInfoObj && this.productInfoObj != '') {
                      this.betaout.productAddedInCart(this.productInfoObj);
                    }

                  }

                }, error => {

                });

              }

              this.loadingCtrl.dismissLoadingCustom();
              this.notificationEvents();
            }
            else if (this.backinfo == 'gotohome') {
              console.log("back vdfjfjdjfkddf" + this.backinfo);
              this.globalFuntion.addToBag(this.parrentId, this.pqty);
              this.app.getRootNav().setRoot(HomePage);
              this.loadingCtrl.dismissLoadingCustom();
            } else if (this.backinfo == 'addToWishlist') {

              console.log("back addToWishlist" + this.backinfo);
              this.globalFuntion.addToWishList(this.parrentId);
              this.app.getRootNav().setRoot(HomePage);
              this.loadingCtrl.dismissLoadingCustom();
            }
            else if (this.backinfo == 'MyAccountPage') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "MyAccountPage" });
              this.loadingCtrl.dismissLoadingCustom();
              this.notificationEvents();
            }
            else if (this.backinfo == 'wishlist') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "wishlist" });
              this.loadingCtrl.dismissLoadingCustom();
              this.notificationEvents();
            } else if (this.backinfo == 'component') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "component" });
              this.loadingCtrl.dismissLoadingCustom();
              if (this.noNotification) {
                this.events.publish('user:pushNotification', this.noNotification, Date.now());
              }
            } else if (this.backinfo == 'listingWishlist') {
              console.log("wishlist listing url on login " + this.navParams.get('listUrl'));
              this.app.getRootNav().setRoot(HomePage, { wId: this.wishlistId, listUrl: this.listUrl, fromListing: this.navParams.get('fromListing') });
              this.loadingCtrl.dismissLoadingCustom();
              if (this.navParams.get('type') == 'listingWishlistType') {
                console.log("API wishlist listing url on login " + this.navParams.get('listUrl'));
                this.AppService.manageWishlist(this.wishlistId).subscribe((res) => {
                  console.log(res);
                  if (res.error === false) {
                    this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
                  }
                })
              }
              if (this.noNotification) {
                this.events.publish('user:pushNotification', this.noNotification, Date.now());
              }
            } else {
              if (this.navParams.get('type') == 'wishlist') {
                this.AppService.manageWishlist(this.parrentId).subscribe((res) => {
                  console.log(res);
                  if (res.error === false) {
                    this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
                  }
                })
              } else {
                //..............add to bag .............//
                this.AppService.addToBag(this.product_id, this.pqty).subscribe((res) => {
                  this.itemsToBag = res;
                  if (this.itemsToBag.error) {

                    if (this.itemsToBag.message == 'Record not found') {
                      let checkProductInCart = this.globalFuntion.checkProductInCart(this.product_id);
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
                    if (this.productInfoObj && this.productInfoObj != '') {
                      this.betaout.productAddedInCart(this.productInfoObj);
                    }
                    this.globalFuntion.saveProductToLocal(this.product_id);
                    this.vibration.vibrate(300);
                    this.toasterCtrl.presentToast(this.itemsToBag.data.message, 'bottom', '3000', false);
                  }

                }, error => {

                });
              }

              //..............end....................//
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "frompdp" });
              this.loadingCtrl.dismissLoadingCustom();
              this.notificationEvents();

            }
            //this.viewCtrl.dismiss();
          } else {

            if (this.noNotification != undefined && this.noNotification['pushnotification'] != undefined) {
              // this.app.getRootNav().setRoot(HomePage);
            } else {
              this.app.getRootNav().setRoot(HomePage);
            }

            this.loadingCtrl.dismissLoadingCustom();
            this.notificationEvents();

          }

        } else {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
        }
      }, error => {
        this.loadingCtrl.dismissLoadingCustom();
      });
    } else {
      this.loadingCtrl.dismissLoadingCustom();
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }



  toggle(item) {
    this.utilities.togglePassword(item);
  }


  back() {
    this.app.getRootNav().setRoot(LandingPage, { data: this.noNotification });

  }


  notificationEvents() {
    console.log("Notification Data");
    console.log(this.noNotification);
    if (this.noNotification != undefined && this.noNotification['pushnotification'] != undefined) {
      console.log("Events fire on login pages");
      this.events.publish('user:pushNotification', this.noNotification, Date.now());
    }

  }


}
