import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform } from 'ionic-angular';
import { LocalStorageProvider, 
  GtmProvider, 
  UtilitiesProvider, 
  LoadingserviceProvider, 
  AppServiceProvider,
  ConstantsProvider,
  TosterserviceProvider } from '../../providers/providers';
import { HomePage, MyOrdersPage, EmptyOrderPage, CartPage, HelpScreenPage } from '../pages';
import { DatePipe } from '@angular/common';


@IonicPage()
@Component({
  selector: 'page-payment-status',
  templateUrl: 'payment-status.html',
})
export class PaymentStatusPage {
  address: any;
  orderPrice: any;
  cartData: any;
  previousCartData: any;
  wait: boolean;
  items: any[];
  myOrdertmp: any[];
  myOrder: any;
  public success: boolean = true;
  public orderId: string = '';
  paymentsData: any;
  userData: any;
  public tap: any;
  public orderDetails:any;
  invoice: string = "invoice";

  constructor(
    public navCtrl: NavController,
    public datepipe:DatePipe,
    public navParams: NavParams,
    public platform: Platform,
    private nativeStorage: LocalStorageProvider,
    public ga:GtmProvider,
    private utilities: UtilitiesProvider,
    public constants:ConstantsProvider,
    private apiService: AppServiceProvider,
    private loadingCtrl: LoadingserviceProvider,
    public toasterCtrl: TosterserviceProvider,
    public events: Events,
  ) {

    this.ga.gtminfo('page-paymentStatus', '/paymentStatus', 'paymentStatusView', 'paymentStatusView');
    this.userData = this.nativeStorage.getnativeStorage('user');
    this.paymentsData = this.navParams.get('statusData');
    this.orderPrice = this.navParams.get('orderPrice');
    this.address = this.navParams.get('address');
    this.orderDetails = this.navParams.get('cartData');

    if (this.paymentsData['paymentStatus'] == 'quotes_updated') {
      console.log('quotes_updated call');
    }
    else if (this.paymentsData['paymentStatus'] != 'cancel') {
      console.log("success page call");
      this.ga.gaConversions(this.navParams.get('orderId'),this.orderDetails);
    }

    if (this.orderPrice != null) {
      this.userTagNotification(this.orderPrice, this.address);
    }
    
    this.orderId = this.navParams.get('orderId');

    if (this.paymentsData['paymentStatus'] == 'cancel') {
      let data = "orderid=" + this.orderId + "&orderstatus=" + this.paymentsData;
      this.ga.gtminfo('page-paymentStatus', '/paymentStatus', 'Payment failed', data);

    }

    if (this.paymentsData['paymentStatus'] == 'gift_success') {
      this.invoice = 'details';
    }

  }

  ionViewDidLoad() {
    
  }

  goToHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  goToCartPage() { 
    this.navCtrl.remove((this.navCtrl.getActive().index -1), 2);
    this.navCtrl.push(CartPage);
  }

  viewOrderDetails(orderId = '') {
    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.apiService.getMyOrders(this.orderId).subscribe(
        (res) => {
          this.loadingCtrl.dismissLoadingCustom();
          if (!res.error) {
            this.navCtrl.push(MyOrdersPage, {
              order: res,
              item: res.data.items,
              page: 'paymentStatus'
            });
          } else {
            this.navCtrl.push(EmptyOrderPage);
          }
        },
        (err) => {
          this.loadingCtrl.dismissLoadingCustom();
        });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }


  checkCartStatus() {

    // gift card condition only ... 
    console.log("status data :");
    console.log(this.paymentsData);

    if (this.paymentsData['paymentFrom'] != undefined && this.paymentsData['paymentFrom'] == 'gift_cart') {
      this.navCtrl.pop();
      return true;
    }

    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.apiService.getItemsInCart().subscribe(
        (res) => {
          if (res && !res.error) {
            this.cartData = res.data.items;
            let itemlenght = res.data.items.length;
            let ProductsAdded = '';
            for (let m in this.cartData.items) {
              ProductsAdded += this.cartData.items[m].product_id + ",";
            }
            let addtocart = "Product_ID=" + res.data.product_id + "&Product_name=" + res.data.name + "&price=" + res.data.final_price + "&Qty=" + res.data.quantity + "&Total Items in Cart=" + itemlenght + "&Products Added=" + ProductsAdded;
            this.ga.gtminfo('page-paymentStatus', '/paymentStatus', 'Failed payment retry', addtocart);
            this.loadingCtrl.dismissLoadingCustom();
            if (this.cartData.length == this.navParams.get('cartData').items.length) {
              this.updateUserCartId(res['data']['txnid']);
              this.navCtrl.pop();
            } else {
              this.toasterCtrl.presentToast(this.constants.toastConfig().cartItemsChanges, 'bottom', '3000', false);
              this.navCtrl.push(CartPage);
            }
          } else {
            this.wait = false;
            this.loadingCtrl.dismissLoadingCustom();
            this.toasterCtrl.presentToast(res.error.message, 'bottom', '3000', false);
          }
        },
        (err) => {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(err.message, 'bottom', '3000', false);
        });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  updateUserCartId(txnid) {
    this.events.publish('user:txnid', txnid, Date.now());
  }
 
  goToHelp() {
    this.navCtrl.push(HelpScreenPage);
  }

  userTagNotification(orderPrice, address) {
    
  }

}

