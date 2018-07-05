import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Vibration } from '@ionic-native/vibration';
import {
  UtilitiesProvider,
  LocalStorageProvider,
  TosterserviceProvider,
  LoadingserviceProvider,
  ValidationServiceProvider,
  ModelinfoProvider,
  BetaoutProvider,
  AppServiceProvider, GtmProvider,
  GlobalFunctionProvider,
  ConstantsProvider
} from '../../../providers/providers';

import { HomePage, LandingPage, TermsPage, PrivacyPage } from '../../pages';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage implements OnInit {
  pid: any;
  pushNotificationData: any;
  private registerForm: FormGroup;
  itemspartners: any;
  valuessplit: any;
  backinfo: any;
  product_id: any;
  noNotification: any;
  pqty: any;
  itemsToBag: any;
  wishlistId: any;
  listUrl: any;
  public tap: any;
  public parrentId: any;
  public productInfoObj: any;

  constructor(
    private vibration: Vibration,
    private gtm: GtmProvider,
    public betaout: BetaoutProvider,
    private app: App,
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public utilities: UtilitiesProvider,
    public modalCtrl: ModalController,
    private nativeStorage: LocalStorageProvider,
    public toasterCtrl: TosterserviceProvider,
    public loadingCtrl: LoadingserviceProvider,
    public Modelinfo: ModelinfoProvider,
    private AppService: AppServiceProvider,
    public translate: TranslateService,
    public globalFuntion: GlobalFunctionProvider,
    public constants:ConstantsProvider
  ) {
    this.tap = this.translate.instant("android");
    this.registerForm = this.formBuilder.group({
      name: ["", Validators.compose([Validators.required, ValidationServiceProvider.nameValidator])],
      email: ["", [Validators.required, ValidationServiceProvider.emailValidator]],
      password: ["", [Validators.required, ValidationServiceProvider.passwordValidator]],
      confirm_password: ["", [Validators.required]],
    });
    this.backinfo = this.navParams.get('pageinfo');
    this.product_id = this.navParams.get('pageinfo');
    this.pqty = this.navParams.get('pqty');
    this.pid = this.navParams.get('pid');
    this.parrentId = this.navParams.get('parrentId');
    this.noNotification = this.navParams.get('pushNotification');
    this.wishlistId = this.navParams.get('wishlistId');
    this.listUrl = this.navParams.get('listUrl');
    this.productInfoObj = (this.navParams.get('productInfoObj') ? this.navParams.get('productInfoObj') : "");


    console.log("sign up this.productInfoObj");
    console.log(this.productInfoObj);

    console.log(" signup backinfo " + this.backinfo);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  register() {
    this.nativeStorage.deleteItems('token');
    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.AppService.registration(this.registerForm.value).subscribe(res => {
        if (res.error) {

          this.registerForm.controls['password'].setValue('');
          this.registerForm.controls['confirm_password'].setValue('');
          this.loadingCtrl.dismissLoadingCustom();
          this.Modelinfo.showModal(res.message, null);

        } else {
          this.gtm.gtminfo('page-SignupPage', '/SignupPage', 'Success register', 'Success register');


          let message = res.message;

          this.valuessplit = res.message.split("address");

          let credentials = {
            email: this.registerForm.value.email,
            password: this.registerForm.value.password,
          };
          this.AppService.login(credentials).subscribe((res) => {
            if (res.error) {
              this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
              this.loadingCtrl.dismissLoadingCustom();
            } else {
              this.nativeStorage.setnativeStorage('token', { token: res.data['_token'] });
              this.nativeStorage.setnativeStorage('provider', 'password');
              // this.loadingCtrl.dismissLoadingCustom();
              this.accountInfo(message);
            }
          },
            (error) => {
              console.log(error);
              this.loadingCtrl.dismissLoadingCustom();
              this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
            });
        }
      }, error => {
        this.loadingCtrl.dismissLoadingCustom();
        this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
      });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  accountInfo(message) {
    if (this.utilities.isOnline()) {
      this.AppService.acountinfo().subscribe((res) => {
        if (res && !res.error) {
          let user = res.data;
          let claetap = "email=" + user.email_id + "&name=" + user.first_name + "&source=Email";
          // this.gtm.cleverTapSignup('User profile tracking',claetap);

          if (this.backinfo) {
            this.nativeStorage.setnativeStorage('user', user);
            this.betaout.setCustomerProperties();
            this.Modelinfo.showModal(this.valuessplit[0], this.valuessplit[1]);

            if (this.backinfo == 'list') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.product_id, frompdp: "fromlist" });
              this.loadingCtrl.dismissLoadingCustom();
              this.events.publish('user:pushNotification', this.noNotification, Date.now());
            } else if (this.backinfo == 'InviteEarnPage') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "InviteEarnPage" });
              this.loadingCtrl.dismissLoadingCustom();
              this.events.publish('user:pushNotification', this.noNotification, Date.now());
            } else if (this.backinfo == 'wishlist') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "wishlist" });
              this.loadingCtrl.dismissLoadingCustom();
            } else if (this.backinfo == 'MyAccountPage') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "MyAccountPage" });
              this.loadingCtrl.dismissLoadingCustom();
              this.notificationEvents();
            } else if (this.backinfo == 'GiftCardPage') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "GiftCardPage" });
              this.loadingCtrl.dismissLoadingCustom();
              this.notificationEvents();

            } else if (this.backinfo == 'component') {

              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "component" });
              this.loadingCtrl.dismissLoadingCustom();
              if (this.noNotification) {
                this.events.publish('user:pushNotification', this.noNotification, Date.now());
              }
            } else if (this.backinfo == 'gotohome') {
              this.globalFuntion.addToBag(this.parrentId, this.pqty);
              this.navCtrl.setRoot(HomePage);
              this.loadingCtrl.dismissLoadingCustom();
            } else if (this.backinfo == 'addToWishlist') {

              console.log("back addToWishlist" + this.backinfo);
              this.globalFuntion.addToWishList(this.parrentId);
              this.app.getRootNav().setRoot(HomePage);
              this.loadingCtrl.dismissLoadingCustom();

            }
            else if (this.backinfo == 'Qrhistory') {
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "Qrhistory" });
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
                      //this.toasterCtrl.presentToast('Product out of stock', 'bottom', '3000', false);
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
                    } else {
                      this.toasterCtrl.presentToast(this.constants.toastConfig().productNotAvailable, 'bottom', '3000', false);
                    }
                  } else {
                    if (this.productInfoObj && this.productInfoObj != '') {
                      this.betaout.productAddedInCart(this.productInfoObj);
                    }
                    this.globalFuntion.saveProductToLocal(this.parrentId);
                    this.vibration.vibrate(300);
                    this.toasterCtrl.presentToast(this.itemsToBag.data.message, 'bottom', '3000', false);
                  }

                }, error => {

                });
              }
              this.nativeStorage.setnativeStorage('user', user);
              this.betaout.setCustomerProperties();
              //..............end....................//
              this.app.getRootNav().setRoot(HomePage, { pid: this.parrentId, frompdp: "frompdp" });
              this.loadingCtrl.dismissLoadingCustom();
              this.notificationEvents();
            }
          } else {

            this.nativeStorage.setnativeStorage('user', user);
            this.betaout.setCustomerProperties();
            this.Modelinfo.showModal(this.valuessplit[0], this.valuessplit[1]);
            if (this.noNotification != undefined && this.noNotification['pushnotification'] != undefined) {
              // this.app.getRootNav().setRoot(HomePage);
            } else {
              this.app.getRootNav().setRoot(HomePage);
            }
            // this.app.getRootNav().setRoot(HomePage);
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
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  toggle(item) {
    this.utilities.togglePassword(item);
  }


  openTnc() {

    this.app.getRootNav().push(TermsPage);
  }
  openPP() {

    this.app.getRootNav().push(PrivacyPage);

  }

  back() {
    this.app.getRootNav().setRoot(LandingPage, { data: this.noNotification });
  }

  ngOnInit() {

  }

  notificationEvents() {
    console.log("Notification Data");
    console.log(this.noNotification);
    if (this.noNotification != undefined && this.noNotification['pushnotification'] != undefined) {
      console.log("Events fire on signup pages");
      this.events.publish('user:pushNotification', this.noNotification, Date.now());
    }

  }


}
