import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import {
  TosterserviceProvider,
  UtilitiesProvider,
  LoadingserviceProvider,
  AppServiceProvider,
  ConstantsProvider,
  LocalStorageProvider
} from '../../providers/providers';

import { PaymentStatusPage } from '../pages';


@IonicPage()
@Component({
  selector: 'page-giftcard-payment',
  templateUrl: 'giftcard-payment.html',
})
export class GiftcardPaymentPage {

  paymentsFlag: any;
  options: any;
  debitCardAddBtn: boolean;
  giftCardData: any;
  userData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public payPal: PayPal,
    public loadingCtrl: LoadingserviceProvider,
    public toasterCtrl: TosterserviceProvider,
    private nativeStorage: LocalStorageProvider,
    public utitlities: UtilitiesProvider,
    private apiService: AppServiceProvider,
    private constant: ConstantsProvider
  ) {
    this.giftCardData = this.navParams.get('giftCardData');
    this.userData = this.nativeStorage.getnativeStorage('user');
    console.log("This is gift card data :" + JSON.stringify(this.giftCardData));
    let key = this.constant.getPaymentKey();
    console.log("Gateway key ");
    console.log(key);
    this.options = {
      description: "Thanks for shopping with us.",
      image: 'https://cdn.razorpay.com/logos/6I0GVhXXxFl9tK_medium.png',
      currency: this.giftCardData['gift_currency'],
      // key: 'rzp_test_gcZxmwYYOcgLKJ',
      key: key,
      amount: this.giftCardData['gift_amount'] * 100,
      name: this.giftCardData['bill_Name'],
      theme: {
        hide_topbar: true
      },
      email: this.userData['email_id']
    }
  }

  paymentsOption(type) {
    this.paymentsFlag = type;
    if (type == 'card') {
      this.debitCardAddBtn = true
    } else {
      this.debitCardAddBtn = false
    }
  }

  payByRazorPay() {

    let vm = this;
    this.options.prefill = {
      method: this.paymentsFlag,
      contact: this.giftCardData['bill_Telephone'],
      email: this.userData['email_id']
    }
    this.options.notes = {
      shopping_order_id: 'GIFTCARDID_' + this.giftCardData['cart_id']
    }

    RazorpayCheckout.on('payment.success', (payment_id) => {
      this.updateGiftcardOnSuccess();
    });

    RazorpayCheckout.on('payment.cancel', (error) => {
      let statusData = {};
      statusData['paymentStatus'] = 'cancel';
      statusData['paymentFrom'] = "gift_cart";
      this.navCtrl.push(PaymentStatusPage, { statusData: statusData });
    });
    RazorpayCheckout.open(this.options);

  }

  updateGiftcardOnSuccess() {

    this.loadingCtrl.presentLoadingCustom();
    console.log("success data:" + JSON.stringify(this.giftCardData));
    let statusData = {};
    statusData['paymentStatus'] = 'gift_success';
    statusData['paymentFrom'] = "gift_cart";
    statusData['email'] = this.giftCardData['receiver_email'];

    let values = { txnid:this.giftCardData['cart_id']};
    this.apiService.updateGiftCard(values).subscribe(
      (res) => {
        this.loadingCtrl.dismissLoadingCustom();
        let msg = res.message;
        if (res && !res.error) {
          this.navCtrl.push(PaymentStatusPage, { statusData: statusData });
        } else {
          this.toasterCtrl.presentToast(msg, 'bottom', '3000', false);
        }
      },
      (error) => {
        this.loadingCtrl.dismissLoadingCustom();
        this.toasterCtrl.presentToast(this.constant.toastConfig().giftCartSuccessPaymentsError, 'bottom', '3000', false);
      });

  }

}
