import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { PaymentStatusPage } from '../payment-status/payment-status';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import {
  TosterserviceProvider,
  UtilitiesProvider,
  LoadingserviceProvider,
  AppServiceProvider,
  LocalStorageProvider,
  GtmProvider, ConstantsProvider, BetaoutProvider, GlobalFunctionProvider
} from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  userAddress: any;
  storeId: number = 2;
  paymentsFlagStatus: boolean = true;
  userData: any;
  paymentsFlagwallet: boolean;
  paymentsFlag: any = null;
  debitCardAddBtn: boolean = false;
  options: any;
  public cartData: any;
  notAvailable = true;
  additionalParam: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public payPal: PayPal,
    public loadingCtrl: LoadingserviceProvider,
    public toasterCtrl: TosterserviceProvider,
    public utitlities: UtilitiesProvider,
    public events: Events,
    private apiService: AppServiceProvider,
    private nativeStorage: LocalStorageProvider, private gtm: GtmProvider,
    private constant: ConstantsProvider,
    public betaout: BetaoutProvider,
    public globalFuntion: GlobalFunctionProvider,
  ) {

    this.gtm.gtminfo('page-checkOut', '/payment', 'checkOutView', 'checkOutView');
    this.cartData = this.navParams.get('cartData');
    this.userAddress = this.navParams.get('address');
    this.userData = this.nativeStorage.getnativeStorage('user');
    events.subscribe('user:txnid', (txnid, time) => {
      this.cartData['txnid'] = txnid;
    });
    if (this.cartData.grandTotal == 0) {
      this.paymentsFlag = 'free';
    }
    this.storeId == 1 ? this.paymentsFlagStatus = true : this.paymentsFlagStatus = false;
    let key = this.constant.getPaymentKey();
    console.log(this.constant.getPaymentKey());
    console.log(key);

    this.options = {
      description: "Thanks for shopping with us.",
      image: 'https://cdn.razorpay.com/logos/6I0GVhXXxFl9tK_medium.png',
      currency: this.cartData.store_id == 2 ? 'INR' : 'USD',
      key: key,
      amount: this.cartData.grandTotal * 100,
      name: this.userData.first_name,
      theme: {
        hide_topbar: true
      },
      email: this.userData.email_id
    }

    this.additionalParam = this.nativeStorage.getAdditionalParamForPayment();
    //console.log(this.additionalParam);
  }

  ionViewDidLoad() {
  }


  paymentsOption(type) {
    this.paymentsFlag = type;
    if (type == 'card') {
      this.debitCardAddBtn = true
    } else {
      this.gtm.gtminfo('page-checkout', '/checkout', 'Wallet selected', type);
      this.debitCardAddBtn = false
    }
  }

  checkLastComma(fieldValue) {
    var lastChar = fieldValue.slice(-1);
    if (lastChar == ',') {
      fieldValue = fieldValue.slice(0, -1);
    }
    return fieldValue;
  }

  checkoutBetaout(key, order_id) {
    let itemlenght = this.cartData.items.length;
    let ProductsAdded = '';
    let productSku = '';
    console.log(this.cartData);
    for (let m in this.cartData.items) {
      ProductsAdded += this.cartData.items[m].product_id + ",";
      productSku += this.cartData.items[m].sku + ",";
    }

    productSku = this.checkLastComma(productSku);
    ProductsAdded = this.checkLastComma(ProductsAdded);

    let data = [];
    data.push(
      { 'name': 'total_cart_value', 'value': this.cartData.subTotal },
      { 'name': 'grandTotal', 'value': this.cartData.grandTotal },
      { 'name': 'no_of_items', 'value': itemlenght },
      { 'name': 'skuids', 'value': productSku },
      { 'name': 'productadded', 'value': ProductsAdded },
      { 'name': 'currency', 'value': (this.cartData.items[0].currency ? this.cartData.items[0].currency : "Rs.") },
      { 'name': 'user_id', 'value': this.nativeStorage.getUserId() },
      { 'name': 'payment_mode', 'value': this.paymentsFlag },
    );


    if (key == 'checkout_complete') {
      data.push(
        { 'name': 'order_id', 'value': order_id }
      );
      /*this.betaout.checkoutCompleted(data); */

      //console.log(this.cartData);
      let products = [];
      var orderData = {};
      var n = 0;
      this.cartData.items.forEach((value, index) => {
        //console.log(value);
        products[n] = {};
        products[n]['productId'] = value.product_id;
        products[n]['productPrice'] = value.final_price;
        products[n]['productCategories'] = [];
        products[n]['productBrand'] = value.brand_name;
        products[n]['productName'] = value.name;
        products[n]['productImageUrl'] = '';
        products[n]['productUrl'] = '';
        products[n]['productQuantity'] = (value.quantity ? value.quantity : 1);
        products[n]['productSKU'] = value.sku;
        products[n]['productGroupID'] = '';
        products[n]['productGroupName'] = '';
        products[n]['productTags'] = [];
        products[n]['productDiscount'] = 0.01;
        products[n]['productMargin'] = 0.01;
        products[n]['productOldPrice'] = 0.01;
        products[n]['productCostPrice'] = 0.01;
        products[n]['productSpecs'] = [];
        n++;
      });
      orderData['order_id'] = order_id;
      orderData['products'] = products;
      orderData['subTotal'] = this.cartData.subTotal;
      orderData['grandTotal'] = this.cartData.subTotal;
      orderData['skuids'] = productSku;
      orderData['productadded'] = ProductsAdded;
      orderData['currency'] = (this.cartData.items[0].currency ? this.cartData.items[0].currency : "Rs.");
      orderData['payment_mode'] = this.paymentsFlag;

      orderData['orderCouponCode'] = (this.cartData.applied_promo ? this.cartData.applied_promo : "");
      orderData['shipping_price'] = (this.cartData.shipping_price ? this.cartData.shipping_price : 0.01);
      orderData['total_discount'] = (this.cartData.total_discount ? this.cartData.total_discount : 0.01);
      //console.log(orderData);
      this.globalFuntion.emptyCart();
      this.betaout.orderPlaced(orderData);
      this.orderFeed(order_id);
    } else {
      data.push(
        { 'name': 'quote_id', 'value': localStorage.getItem('QuoteId') }
      );
      this.betaout.checkoutStarted(data);
    }

    //console.log(data);

  }

  orderFeed(order_id) {
    var orderData = {};
    var orderFeed = {};
    var userDetail  = this.nativeStorage.getLoginUserDetail();
    orderFeed['apikey'] = this.constant.getConfig().api_key;
    orderFeed['project_id'] = this.constant.getConfig().project_id;
    orderFeed['identifiers'] = {};
    orderFeed['identifiers']['customer_id'] = userDetail.customer_id;
    orderFeed['identifiers']['email'] = userDetail.email_id;
    orderFeed['identifiers']['phone'] = (userDetail.telephone ? userDetail.telephone : "");
    orderFeed['activity_type'] = 'purchase';
    orderFeed['timestamp'] = Math.floor((new Date()).getTime() / 1000).toString();

    var n = 0;
    let products = [];
    this.cartData.items.forEach((value, index) => {
      //console.log(value);
      products[n] = {};
      products[n]['id'] = value.product_id;
      products[n]['sku'] = value.sku;
      products[n]['name'] = value.name;
      products[n]['price'] = value.final_price.toString();
      products[n]['discount'] = "0";
      products[n]['quantity'] = (value.quantity ? value.quantity : 1).toString();
      products[n]['currency'] = 'INR';
      products[n]['product_group_id'] = '4';
      products[n]['product_group_name'] = 'Default';
      n++;
    });

    orderData['order_id'] = order_id;
    orderData['total'] = this.cartData.subTotal.toString();
    orderData['revenue'] = this.cartData.subTotal.toString();
    orderData['shipping'] = (this.cartData.shipping_price ? this.cartData.shipping_price : 0).toString();
    orderData['discount'] = (this.cartData.total_discount ? this.cartData.total_discount : 0).toString();
    orderData['coupon'] = (this.cartData.applied_promo ? this.cartData.applied_promo : "");
    orderData['currency'] = 'INR';
    
    orderData['payment_method'] = this.paymentsFlag;
    orderData['shipping_method'] = 'matrixrate_matrixrate_165';

    orderFeed['products'] = [];
    orderFeed['products'] = products;
    orderFeed['order_info'] = {};
    orderFeed['order_info'] = orderData;

    if (this.paymentsFlag != 'cod' && this.cartData.grandTotal > 0) { 
      orderData['status'] = 'payment_pending';
    } else if (this.paymentsFlag == 'cod') {
      orderData['status'] = 'payment_code';
    } else {
      orderData['status'] = 'processing';
    }
    
    this.apiService.orderPlacedFeed(orderFeed).subscribe((res) => {
      console.log(res);
        //order feed success
    }, (error) => {
      console.log(error);
    })
  }


  pay() {
    if (this.utitlities.isOnline()) {
      this.checkoutBetaout('checkout_started', null);

      let storeID = this.constant.getStore().xjypstore;
      storeID == 1 ? this.payByPayPal() : this.payByRazorPay();
    } else {
      this.toasterCtrl.presentToast(this.constant.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  payByRazorPay() {
    let vm = this;
    this.loadingCtrl.presentLoadingCustom();
    if (this.paymentsFlag != 'cod' && this.cartData.grandTotal > 0) {
      this.placeOrder('pay_online').then(res => {
        this.loadingCtrl.dismissLoadingCustom();
        this.options.prefill = {
          method: this.paymentsFlag, // or card, upi, wallet
          contact: this.userAddress.telephone,
          email: this.userData.email_id
        }
        this.options.external = {
          wallets: ['paytm']
        };
        this.options.notes = {
          shopping_order_id: res['data']['order_id']
        }

        RazorpayCheckout.on('payment.success', (payment_id) => {
          //checkout_complete event betaout
          this.checkoutBetaout('checkout_complete', res['data']['order_id']);

          let orderId = {
            orderId: res['data']['order_id'],
            payment_id: payment_id.razorpay_payment_id,
            payment_method: 'razor_pay_netbanking'
          };

          vm.apiService.changeOrderStatus(orderId).subscribe(
            (res) => {
              if (!res.error) {
                let statusData = {};
                statusData['paymentID'] = orderId['orderId'];
                statusData['paymentStatus'] = 'success';
                statusData['amount'] = this.cartData.grandTotal;
                this.navCtrl.push(PaymentStatusPage, { statusData: statusData, orderId: orderId['orderId'], orderPrice: this.cartData.grandTotal, cartData: this.cartData, address: this.userAddress });
              } else {
                this.loadingCtrl.dismissLoadingCustom();
              }
            },
            (err) => {
              this.loadingCtrl.dismissLoadingCustom();
              this.toasterCtrl.presentToast(err, 'bottom', '3000', false);
            });
        });

        RazorpayCheckout.on('payment.cancel', (error) => {
          this.cancelOrder(this.cartData.txnid)
        });
        RazorpayCheckout.open(this.options);

      }, err => {
        this.loadingCtrl.dismissLoadingCustom();
        this.toasterCtrl.presentToast(err, 'bottom', '3000', false);
      });

    } else if (this.paymentsFlag == 'cod') {
      this.placeOrder('cod').then((res: any) => {
        //checkout_complete event betaout
        this.checkoutBetaout('checkout_complete', res.data['order_id']);

        this.loadingCtrl.dismissLoadingCustom();
        this.navCtrl.push(PaymentStatusPage, {
          statusData: { paymentStatus: 'cod' },
          orderId: res.data['order_id'],
          cartData: this.cartData,
          orderPrice: this.cartData.grandTotal,
          address: this.userAddress
        })
      }, err => {
        console.log(err);
        this.loadingCtrl.dismissLoadingCustom();
        this.toasterCtrl.presentToast(err, 'bottom', '3000', false);
      });
    }
    else {
      // zero payments ..
      this.placeOrder(this.paymentsFlag).then((res: any) => {
        //checkout_complete event betaout
        this.checkoutBetaout('checkout_complete', res.data['order_id']);

        this.loadingCtrl.dismissLoadingCustom();
        this.navCtrl.push(PaymentStatusPage, {
          statusData: { paymentStatus: 'zero' },
          orderId: res.data['order_id'],
          cartData: this.cartData,
          orderPrice: this.cartData.grandTotal,
          address: this.userAddress
        })
      }, err => {
        this.loadingCtrl.dismissLoadingCustom();
        this.toasterCtrl.presentToast(err, 'bottom', '3000', false);
      });
    }
  }


  placeOrder(orderStatus = '') {
    return new Promise((resolve, reject) => {
      if (!this.userAddress.firstname && this.userAddress.name) {
        let name = this.userAddress.name.split(" ");
        this.userAddress.firstname = name[0] || " ";
        this.userAddress.lastname = name[1] || " ";
      }
      if (this.userAddress.billing_name) {
        let name = this.userAddress.billing_name.split(" ");
        this.userAddress.billing_firstname = name[0] || " ";
        this.userAddress.billing_lastname = name[1] || " ";
      }

      let data = {
        "payment_method": orderStatus,
        "shipping_firstname": this.userAddress.firstname,
        "shipping_lastname": this.userAddress.lastname,
        "shipping_street": this.userAddress.street,
        "shipping_city": this.userAddress.city,
        "shipping_country_id": this.userAddress.country_id,
        "shipping_region_id": this.userAddress.region_id,
        "shipping_postcode": this.userAddress.postcode,
        "shipping_telephone": this.userAddress.telephone,
        "billing_firstname": this.userAddress.billing_firstname,
        "billing_lastname": this.userAddress.billing_lastname,
        "billing_street": this.userAddress.billing_street,
        "billing_city": this.userAddress.billing_city,
        "billing_country_id": this.userAddress.billing_country_id,
        "billing_region_id": this.userAddress.billing_region_id,
        "billing_postcode": this.userAddress.billing_postcode,
        "billing_telephone": this.userAddress.billing_telephone,
        //quote id and subtotal added by mahesh on 17 nov 2017
        "quoteId": this.cartData['txnid'],
        "subTotal": this.additionalParam.Subtotal,
      };

      if (this.userAddress.entity_id) {
        data["shipping_addr_id"] = this.userAddress.entity_id;
        data["billing_addr_id"] = this.userAddress.entity_id;
      }


      // let placeOrderStatus: any;
      // if (this.userAddress.attribute_set_id  &&this.userAddress.attribute_set_id != '0') {
      //   data['shipping_addr_id'] = this.userAddress.attribute_set_id;
      //   data['billing_addr_id'] = this.userAddress.attribute_set_id;
      // }

      this.apiService.placeOrderApi(data).subscribe(
        (res) => {
          if (!res.error) {
            resolve(res);
          } else {
            this.loadingCtrl.dismissLoadingCustom();
            if (res && res.error === true && res.data == 'Quote was updated!') {
              let statusData = {};
              statusData['paymentID'] = '';
              statusData['paymentStatus'] = 'quotes_updated';
              this.navCtrl.push(PaymentStatusPage, { statusData: statusData })
            } else {
              this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
              reject(res.message);
            }
          }
        },
        (err) => {
          this.loadingCtrl.dismissLoadingCustom();
          reject(this.constant.toastConfig().apiNotRespondingOrTimeOut);
        });

    });
  }

  cancelOrder(quoteId) {

    this.loadingCtrl.presentLoadingCustom();

    if (this.utitlities.isOnline()) {
      this.apiService.cancelOrderApi(quoteId).subscribe((res) => {
        if (!res.error) {
          let statusData = {};
          statusData['paymentID'] = '';
          statusData['paymentStatus'] = 'cancel';
          this.userAddress['entity_id'] = res['data']['shipping_address_id'];
          this.loadingCtrl.dismissLoadingCustom();
          this.navCtrl.push(PaymentStatusPage, { statusData: statusData, cartData: this.cartData, orderPrice: null })
        }
      },
        (err) => {
          this.loadingCtrl.dismissLoadingCustom();
          let statusData = {};
          statusData['paymentID'] = '';
          statusData['paymentStatus'] = 'cancel';
          this.loadingCtrl.dismissLoadingCustom();
          this.navCtrl.push(PaymentStatusPage, { statusData: statusData, cartData: this.cartData, orderPrice: null })
        });
    } else {
      this.loadingCtrl.dismissLoadingCustom();
      this.toasterCtrl.presentToast(this.constant.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  payByPayPal() {
    let vm = this;
    let orderId = {};
    let enviromentsSetUpData = this.apiService.payPalEnviromentSetUp();
    this.placeOrder('pay_online').then(res => {
      orderId['order_id'] = res['data']['order_id'];
      this.loadingCtrl.dismissLoadingCustom();
      this.payPal.init({
        PayPalEnvironmentProduction: enviromentsSetUpData['PayPalEnvironmentProduction'],
        PayPalEnvironmentSandbox: enviromentsSetUpData['PayPalEnvironmentSandbox']
      }).then((res) => {
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({})).then((response) => {
          let payment = new PayPalPayment(vm.cartData.grandTotal, 'USD', 'Amount Payble', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then((onSuccess) => {
            vm.loadingCtrl.presentLoadingCustom();
            vm.apiService.changeOrderStatus(orderId).subscribe(
              (res) => {
                if (!res.error) {
                  //checkout_complete event betaout
                  this.checkoutBetaout('checkout_complete', orderId['order_id']);

                  let statusData = {};
                  // statusData['paymentID'] = onSuccess.response.id;
                  statusData['paymentID'] = orderId['order_id'];
                  statusData['paymentStatus'] = 'success';
                  statusData['amount'] = this.cartData.grandTotal;
                  vm.loadingCtrl.dismissLoadingCustom();
                  vm.navCtrl.push(PaymentStatusPage, {
                    statusData: statusData,
                    orderId: orderId['order_id'],
                    cartData: this.cartData,
                    orderPrice: this.cartData.grandTotal,
                    address: this.userAddress
                  });
                }
              },
              (err) => {
                this.loadingCtrl.dismissLoadingCustom();
                console.log(err);
              });
          }, () => {
            vm.loadingCtrl.presentLoadingCustom();
            vm.cancelOrder(this.cartData.txnid);
          });
        }, () => {
          vm.loadingCtrl.presentLoadingCustom();
          vm.cancelOrder(this.cartData.txnid);
        });
      }, () => {
        vm.loadingCtrl.presentLoadingCustom();
        vm.cancelOrder(this.cartData.txnid);
      });

    }, err => {
      this.loadingCtrl.dismissLoadingCustom();
      console.log("fails");
    });
  }



}