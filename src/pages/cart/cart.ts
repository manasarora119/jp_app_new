import { Component, ViewChild } from '@angular/core';
import {
  IonicPage, NavController, NavParams, ModalController,
  App, Events, ViewController, Platform, Navbar, Select
} from 'ionic-angular';
import { HomePage, RemoveProductPage, ChangeSizePage, AddressesPage, PdpPage } from '../pages';
import {
  AppServiceProvider,
  TosterserviceProvider,
  UtilitiesProvider,
  LoadingserviceProvider,
  GtmProvider,
  LocalStorageProvider,
  BetaoutProvider,
  GlobalFunctionProvider,
  ValidationServiceProvider,
  ConstantsProvider
} from '../../providers/providers';

import { Keyboard } from '@ionic-native/keyboard';
import { Validators, FormBuilder } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  @ViewChild('myselect') select: Select;
  userData: any;
  @ViewChild(Navbar) navBar: Navbar;
  public isKeyboardShown: any = false;
  public cartData: any;
  public shownGroup = null;
  public credits: any;
  public coupon: any;
  public couponRes: any;
  public giftCardRes: any;
  public useAllCredits: any = false;
  public use_credits: string = '';
  public confirmRemoveItem: any;
  public removeModal: any;
  public wait: any = true;
  public addresses: any;
  public showFooter: any = true;
  public giftCardResMessage: any = 0;
  public removeProductMsg: any;
  public giftCard: any = null;
  public checkPattern = /^[0-9]{10,10}$/;
  public applyCartCouponmsg: any = 1;
  public errorTrue:boolean = false;
  public creditApplied:any= false;
  public isValidAmt = 0;  
  msgForm:any;
  constructor(
    public betaout: BetaoutProvider,
    public platform: Platform,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public keyboard: Keyboard,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private nativeStorage: LocalStorageProvider,
    private apiService: AppServiceProvider,
    public loadingCtrl: LoadingserviceProvider,
    public toasterCtrl: TosterserviceProvider,
    public app: App,
    public events: Events,
    public utitlities: UtilitiesProvider,
    public gtm: GtmProvider,
    public globalFuntion: GlobalFunctionProvider,
    public formBuilder: FormBuilder,
    public constants:ConstantsProvider
  ) {
    this.msgForm = this.formBuilder.group({
      use_credits: ["", Validators.compose([Validators.required])],
    });
    
    this.gtm.gtminfo('page-listing', '/listing', 'listingView', 'cartpage');
    // Register the event listener
    this.getItems();
    this.confirmRemoveItem = this.navParams.get("removeItem"); 

    keyboard.onKeyboardShow()
      .subscribe(data => {
        this.isKeyboardShown = true;

      });
    keyboard.onKeyboardHide()
      .subscribe(data => {
        this.isKeyboardShown = false;
      });

  }

  creditEntered(amount) {
    //console.log(amount);
    var price = '^[0-9]+$';
    if (amount.match(price)) {
      this.isValidAmt = 1;
    } else {
      this.isValidAmt = 0;
    }
  }

  ionViewDidLoad() {
    // console.log('micky ionViewDidLoad');
    // this.platform.registerBackButtonAction(() => {
    //   if (this.navCtrl.getActive().name == 'HomePage') {
    //     this.platform.exitApp();
    //   } else {
    //       this.navCtrl.pop();

    //   }
    // });
  }




  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
    this.giftCardResMessage = 0;
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

  removeProduct(item) {

    var options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
      cssClass: "remove-product"
    };
    let modal = this.modalCtrl.create(RemoveProductPage, { "item": item }, options);
    modal.present();
    modal.onDidDismiss(data => {

      //console.log(data);
      if (data && data.removeItem) {
        this.removeItem(item);
      }
    });
  }

  changeSize(item) {
    var options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
      cssClass: "change-product-size"
    };


    let modal = this.modalCtrl.create(ChangeSizePage, { "item": item }, options);
    modal.present();
    modal.onDidDismiss(data => {
      if (data && data.pid) {
        this.app.getRootNav().push(PdpPage, { pid: data.pid, cartitem: item }).then(() => {
          const index = this.viewCtrl.index;
          this.navCtrl.remove(index);
        });;
      }
    });
  }

  gotoPdp(item) {
    let pid = '';
    if (item.parent_id) {

      pid = item.parent_id;
    } else {
      pid = item.product_id;
    }

    this.app.getRootNav().push(PdpPage, { pid: pid, source: 'cart' }).then(() => {
      const index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }

  goToApplyCoupon(el): void {
    //this.applyCartCouponmsg=0;
    this.goToEl(el);
    this.shownGroup = 1;

  }
  goToGiftCart(el): void {
    this.goToEl(el);
    this.shownGroup = 2;
    this.giftCardResMessage = 0;
  }

  goToAppliedCredits(el): void {
    this.goToEl(el);
    this.shownGroup = 3;
  }

  goToEl(el): void {

    el.scrollIntoView();
  }

  getItems() {
    if (this.utitlities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.apiService.getItemsInCart().subscribe(
        (res) => {
          if (res && res.error) {
            this.errorTrue = true;
            this.loadingCtrl.dismissLoadingCustom();
          }
          else if (res && !res.error) {
            this.setCartData(res.data);
            this.userTagNotification(res.data.items.length);

          } else if (res == '' || res == null || typeof res == 'undefined' || res == undefined) {
            //this.toasterCtrl.presentToast('Plesae try again!', 'bottom', '3000', false);
            this.toasterCtrl.presentToastWithbutton(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', true, "Retry", 5000);
            this.toasterCtrl.toast.onDidDismiss((data, role) => {
              if (role && role == "close") {
                this.getItems();
              }
            })

          } else {
            this.wait = false;
            this.loadingCtrl.dismissLoadingCustom();
            this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
          }
        },
        (err) => {
          this.loadingCtrl.dismissLoadingCustom();
          //this.toasterCtrl.presentToast(err.message, 'bottom', '3000', false);
          this.toasterCtrl.presentToastWithbutton(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', true, "Retry", 5000);
          this.toasterCtrl.toast.onDidDismiss((data, role) => {
            if (role && role == "close") {
              this.getItems();
            }
          })
          console.log(err);
        });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  setCartData(data) {

    this.cartData = data;
    this.nativeStorage.setnativeStorage('cartCount', this.cartData.items.length);

    // save subtotal to local storage
    this.nativeStorage.saveSubtotalToLocal(this.cartData);
    this.nativeStorage.saveQuoteIdToLocal(this.cartData.txnid);

    if (this.cartData && this.cartData.applied_code) {
      this.coupon = this.cartData.applied_code;
    }
    if (this.cartData.applied_code == null) {
      this.coupon = null;
      this.couponRes = null;
    }

    if (this.cartData && this.cartData.rewardpoint_discount) {
      this.use_credits = this.cartData.rewardpoint_discount;
    }

    if (this.cartData.creditAvailable == this.cartData.rewardpoint_discount) {
      this.useAllCredits = true;
    }

    if (this.cartData.items && this.cartData.items.length > 0) {
      //   this.nativeStorage.setnativeStorage('cartCount', this.cartData.items.length);
      this.cartData.items.forEach((item) => {
        let availQty = item.availQty;
        item.availQty = [];

        if (availQty > 0) {
          for (var i = 1; i <= availQty; i++) {
            item.availQty.push(i);
          }
        }
      });
      this.wait = false;
      this.loadingCtrl.dismissLoadingCustom();

    } else {
      this.gtm.gtminfo('page-checkout', '/pdp', 'Empty cart', 'Empty cart');
      this.wait = false;
      this.loadingCtrl.dismissLoadingCustom();
    }
    this.events.publish('CartUpdated');

  }


  updateItem(item) {
    if (this.utitlities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      let id = item.product_id;
      let quantity = item.quantity;
      let addtocart = "Product_ID=" + item.product_id + "&Product_name=" + item.name + "&price=" + item.final_price + "&PreviousQty=1&NewQty" + quantity;
      this.gtm.gtminfo('page-checkout', '/pdp', 'Modify Qty', addtocart);

      this.apiService.updateCartItem(id, quantity).subscribe(
        (res) => {
          if (!res.error) {
            this.setCartData(res.data);
            res.data.items.forEach((product) => {
              if (product.product_id == item.product_id) {
                this.betaout.updateProductToCart(product, res);
              }
            });
            this.userTagNotification(res.data.items.length);
          } else if (res == '' || res == null || typeof res == 'undefined' || res == undefined) {
            //this.toasterCtrl.presentToast('Plesae try again!', 'bottom', '3000', false);
            this.toasterCtrl.presentToastWithbutton(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', true, "Retry", 5000);
            this.toasterCtrl.toast.onDidDismiss((data, role) => {
              if (role && role == "close") {
                this.updateItem(item);
              }
            })
          } else {
            this.loadingCtrl.dismissLoadingCustom();
            this.toasterCtrl.presentToast(res.error.message, 'bottom', '3000', false);
          }
        },
        (err) => {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToastWithbutton(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', true, "Retry", 5000);
          this.toasterCtrl.toast.onDidDismiss((data, role) => {
            if (role && role == "close") {
              this.updateItem(item);
            }
          })
          console.log(err);
        });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  removeItem(item) {

    if (this.utitlities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      let id = item.product_id;
      this.apiService.removeCartItem(id).subscribe(
        (res) => {
          console.log("removeItem");
          console.log(item);
          this.betaout.productRemovedFromCart(item, res);
          if (res.applied_code == null) {
            this.coupon = null;
            this.couponRes = null;
          }
          if (res.message && res.message != '') {
            this.removeProductMsg = res.message;
          } else {
            this.removeProductMsg = this.constants.toastConfig().removeProductMsg;
          }

          if (!res.error) {
            let addtocart = "Product_ID=" + item.product_id + "Product_name=" + item.name + "price=" + item.final_price + "qty=" + item.quantity;
            this.gtm.gtminfo('page-checkout', '/pdp', 'Remove from cart', addtocart);
            this.globalFuntion.RemoveProductFromCart(item.product_id);
            this.setCartData(res.data);
            this.userTagNotification(this.cartData.items.length);
            if (this.cartData.items.length == 0) {
              this.betaout.emptyCart(item);
              this.toasterCtrl.presentToast(this.removeProductMsg, 'bottom', '3000', false);
            }
          } else if (res == '' || res == null || typeof res == 'undefined' || res == undefined || res.error == true) {
            this.loadingCtrl.dismissLoadingCustom();
            this.getItems();
          } else {
            this.loadingCtrl.dismissLoadingCustom();
            this.toasterCtrl.presentToastWithbutton(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', true, "Retry", 5000);
            this.toasterCtrl.toast.onDidDismiss((data, role) => {
              if (role && role == "close") {
                this.removeItem(item);
              }
            })
          }
        },
        (err) => {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToastWithbutton(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', true, "Retry", 5000);
          this.toasterCtrl.toast.onDidDismiss((data, role) => {
            if (role && role == "close") {
              this.removeItem(item);
            }
          })
        });
    } else {
      console.log("Err");
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);

    }
  }


  applyAllCredits(useAll) {

    if (useAll) {
      if (this.cartData.creditAvailable > (this.cartData.subTotal + this.cartData.shipping_price - this.cartData.total_discount)) {
        this.use_credits = (this.cartData.subTotal + this.cartData.shipping_price - this.cartData.total_discount).toString();
      } else {
        this.use_credits = this.cartData.creditAvailable;
      }

    } else {
      this.removeCredits();
    }



  }

  checkCredits(event) {
    console.log('uses_credit');
    this.use_credits= this.use_credits.replace(/[^\/\d]/g,'');
    console.log("use credits");
    console.log(this.use_credits);
    if (this.useAllCredits &&
      (this.use_credits != this.cartData.creditAvailable)) {
      this.useAllCredits = false;
    }

  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }


  applyCredits(credits) {
    if (this.utitlities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.apiService.applyCredits(credits).subscribe(
        (res) => {
          if (!res.error) {
            if (res.data.rewardpoint_discount > 0) {
              this.creditApplied = true;
            } else {
              this.toasterCtrl.presentToast(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', '3000', false);
            }
            let itemlenght = res.data.items.length;
            let addtocart = "Total Cart Value=" + res.data.grandTotal + "&Credit Value=" + credits + "&Total Items in Cart=" + itemlenght;
            this.gtm.gtminfo('page-checkout', '/checkout', 'Promo Code Removed', addtocart);
            this.setCartData(res.data);
          } else {
            this.loadingCtrl.dismissLoadingCustom();
            this.toasterCtrl.presentToast(res.error.message, 'bottom', '3000', false);
          }
        },
        (err) => {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
          console.log(err);
        });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);

    }
  }

  removeCredits() {
    if (this.utitlities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.apiService.removeAppliedCredits().subscribe(
        (res) => {
          if (!res.error) {
            this.use_credits = null;
            if (res.data.rewardpoint_discount == 0) {
              this.creditApplied = false;
            } else {
              this.toasterCtrl.presentToast(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', '3000', false);
            }
            if (res.data) {
              this.setCartData(res.data);
            } else {
              this.loadingCtrl.dismissLoadingCustom();
            }

          } else {
            this.loadingCtrl.dismissLoadingCustom();
            this.toasterCtrl.presentToast(res.error.message, 'bottom', '3000', false);
          }
        },
        (err) => {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
          console.log(err);
        });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);

    }
  }

  applyCartCoupon() {
    if (this.utitlities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();

      this.apiService.applyCoupon(this.coupon).subscribe(
        (res) => {
          this.couponRes = res;
          if (res && !res.error) {

            this.setCartData(res.data);
            let disper = Math.round((100 * res.data.total_discount) / res.data.subTotal);
            let itemlenght = res.data.items.length;
            let addtocart = "Total Cart Value=" + res.data.subTotal + "&Promo code=" + res.data.applied_code + "&Discount Value=" + res.data.total_discount + "&Discount Percentage=" + disper + "&Total Items in Cart=" + itemlenght;
            this.gtm.gtminfo('page-checkout', '/checkout', 'Promo Code Applied', addtocart);
            this.applyCartCouponmsg = 1;
          } else {
            this.applyCartCouponmsg = 1;
            this.toasterCtrl.presentToast(res.error.message, 'bottom', '3000', false);
            this.loadingCtrl.dismissLoadingCustom();
          }
          this.showFooterDiv();
        },
        (err) => {
          this.applyCartCouponmsg = 1;
          this.loadingCtrl.dismissLoadingCustom();
          console.log(err);
          this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
          this.showFooterDiv();
        });
    } else {

      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
      this.showFooterDiv();
    }
  }


  redeemGiftCard() {
    if (this.utitlities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.apiService.redeemGiftCard(this.giftCard).subscribe(
        (res) => {
          this.giftCardRes = res;
          if (res && !res.error) {

            this.loadingCtrl.dismissLoadingCustom();
            this.giftCardResMessage = this.giftCardRes.data.message;
            // this.giftCard=
            this.getItems();

          } else {
            this.giftCard = '';
            this.giftCardResMessage = this.giftCardRes.data.message;
            this.toasterCtrl.presentToast(res.error.message, 'bottom', '3000', false);
            this.loadingCtrl.dismissLoadingCustom();
          }
        },
        (err) => {
          this.giftCardResMessage = 0;
          this.loadingCtrl.dismissLoadingCustom();
          console.log(err);
          this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
        });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }


  removeCartCoupon() {
    this.applyCartCouponmsg = 1;
    if (this.coupon && this.couponRes && this.couponRes.error) {
      this.coupon = null;
      this.couponRes = null;
    } else {
      if (this.utitlities.isOnline()) {
        this.loadingCtrl.presentLoadingCustom();

        this.apiService.removeAppliedCoupon().subscribe(
          (res) => {
            if (!res.error) {
              this.coupon = "";
              this.couponRes = res.data.removed_coupon;
              let itemlenght = res.data.items.length;
              let addtocart = "Total Cart Value=" + res.data.grandTotal + "&Promo code=" + this.coupon + "&Total Items in Cart=" + itemlenght;
              this.gtm.gtminfo('page-checkout', '/checkout', 'Promo Code Removed', addtocart);
              this.setCartData(res.data);
            } else {
              this.loadingCtrl.dismissLoadingCustom();
            }
          },
          (err) => {
            this.loadingCtrl.dismissLoadingCustom();

            console.log(err);
          });
        this.showFooterDiv();
      } else {
        this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
        this.showFooterDiv();
      }
    }
  }


  goToAddress() {
    let itemlenght = this.cartData.items.length;
    let ProductsAdded = '';
    let productSku = '';
    for (let m in this.cartData.items) {
      ProductsAdded += this.cartData.items[m].product_id + ",";
      productSku += this.cartData.items[m].sku + ",";
    }
    let addtocart = "Total Cart Value=" + this.cartData.grandTotal + "&Number Of Products In Cart=" + itemlenght + "&Coupon Applied=" + this.cartData.applied_code + "&Coupon discount=" + this.cartData.coupon_discount + "&Credits Applied=" + this.cartData.creditAvailable + "store_id" + this.cartData.store_id + "&Products Added=" + ProductsAdded;
    this.gtm.gtminfo('page-checkout', '/checkout', 'Proceed to shipping', addtocart);

    var lastChar = productSku.slice(-1);
    if (lastChar == ',') {
      productSku = productSku.slice(0, -1);
    }
    lastChar = ProductsAdded.slice(-1);
    if (lastChar == ',') {
      ProductsAdded = ProductsAdded.slice(0, -1);
    }
    let data = [];
    data.push(
      { 'name': 'total_cart_value', 'value': this.cartData.subTotal },
      { 'name': 'no_of_items', 'value': itemlenght },
      { 'name': 'coupon_applied', 'value': (this.cartData.applied_code ? this.cartData.applied_code : "") },
      { 'name': 'coupon_discount', 'value': this.cartData.coupon_discount },
      { 'name': 'skuids', 'value': productSku },
      { 'name': 'productadded', 'value': ProductsAdded },
      { 'name': 'credit_applied', 'value': (this.cartData.rewardpoint_discount ? this.cartData.rewardpoint_discount : 0) },
      { 'name': 'currency', 'value': (this.cartData.items[0].currency ? this.cartData.items[0].currency : "Rs.") },
    );
    //console.log(this.cartData);
    //console.log(data);

    this.betaout.proceedToShipping(data);


    this.navCtrl.push(AddressesPage, { cartData: this.cartData })
  }

  couponEdit(e) {
    this.applyCartCouponmsg = 0;
    if (this.couponRes) {
      this.couponRes = null
    }
  }

  focusOutCall(e) {
    console.log(e);
    this.showFooterDiv();
  }

  goToHome() {
    this.navCtrl.setRoot(HomePage);

  }

  hideFooter() {
    this.isKeyboardShown = true;
  }

  showFooterDiv() {
    this.isKeyboardShown = false;
  }

  getDiscount(normalPrice, finalPrice) {
    let discountedPrice = (((normalPrice - finalPrice) / normalPrice) * 100);
    discountedPrice = Math.round(discountedPrice);
    return discountedPrice;
  }

  userTagNotification(cartcounts) {

  }

  retryCart() {
    this.navCtrl.push(CartPage);
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
  }


}


