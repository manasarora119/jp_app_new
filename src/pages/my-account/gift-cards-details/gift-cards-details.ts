import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App,Events } from 'ionic-angular';
import { GiftcardPaymentPage } from '../../pages';
import { Validators, FormBuilder } from '@angular/forms';
import {
  AppServiceProvider,
  TosterserviceProvider,
  UtilitiesProvider,
  LoadingserviceProvider,
  ValidationServiceProvider,
  LocalStorageProvider,
  ConstantsProvider
} from '../../../providers/providers';

/**
 * Generated class for the GiftCardsDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gift-cards-details',
  templateUrl: 'gift-cards-details.html',
})
export class GiftCardsDetailsPage {
  card_id:any;
  fullname : string;
  receiver_email:string;
  gift_currency:string;
  gift_amount:number;
  allCountrys:any;
  defaultCountry: any;
  giftAddress:boolean = false;
  showGiftForm:boolean = true;
  giftForm: any;
  allStates:any;
  gift_message:string;
  giftCurrencyData = [{id:'INR',label:'Indian Rupees'},{id:'USD',label:'US Dollar'}];
  giftAmountData:any;
  sender_fullname: any;

  constructor(private apiService: AppServiceProvider, public loadingCtrl: LoadingserviceProvider, public utilities: UtilitiesProvider, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
     public toasterCtrl: TosterserviceProvider,
     public app :App,
     public events:Events,
     public constants:ConstantsProvider,
     public nativeStorage :LocalStorageProvider,
   ) {
    this.card_id = this.navParams.get('card_id');
    this.giftAmountData=this.navParams.get('giftAmountData').data;
    console.log("Gift cart data :");
    console.log(this.giftAmountData);

    this.giftForm = this.formBuilder.group({
      gift_currency: ["", [Validators.required]],
      gift_amount: ["", [Validators.required]],
      receiver_email: ["", [Validators.required, ValidationServiceProvider.emailValidator]],
      fullname: ["", Validators.compose([Validators.required, ValidationServiceProvider.nameValidator])],
      gift_message: ["", [Validators.required]],
      senderName: ["", Validators.compose([Validators.required, ValidationServiceProvider.nameValidator])],

      bill_Name: ["", Validators.compose([Validators.required, ValidationServiceProvider.nameValidator])],
      bill_Telephone: ["", Validators.compose([Validators.required, ValidationServiceProvider.mobileValidator])],
      bill_Street: ["", [Validators.required]],
      bill_City: ["", [Validators.required]],
      bill_post_code: ["", [Validators.required]],
      bill_country_id: ["IN", [Validators.required]],
      bill_region_id: ["", [Validators.required]],

    });

    this.defaultCountry = "IN";
    this.getCountryStates(this.defaultCountry);
    
  }
  goToMyAccount() {
    this.navCtrl.pop();
  }

  addGiftBillingAddress(){
    this.giftAddress = !this.giftAddress;
  }
   
  ionViewDidLoad() {
    }

  giftCardSave(){
    //API CALL
    if(this.card_id!=undefined&&this.card_id!=null){
      this.giftForm.value['card_type']=this.card_id;
    }
    console.log( this.giftForm.value );
      if (this.utilities.isOnline()) {
        this.loadingCtrl.presentLoadingCustom();
        this.apiService.buyGiftCard(this.giftForm.value).subscribe(
          (res) => {
            this.loadingCtrl.dismissLoadingCustom();
            if (res && !res.error) {
              this.giftForm.value['cart_id']=res['cart_id'];
              this.navCtrl.push(GiftcardPaymentPage , {giftCardData:this.giftForm.value});
              // this.navCtrl.pop();
            } else {
              this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);      
            }
          },
          (error) => {
            console.log(error);
            this.loadingCtrl.dismissLoadingCustom();
            this.toasterCtrl.presentToast(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', '3000', false);      
          });
      } else {
        this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
      }
    
  }

  

  getAllCountrys() {
    this.apiService.getCountrys().subscribe(
      (res) => {
        this.allCountrys = res.data;
      },
      (err) => {
        console.log(err);
      }
    )
  }
  getCountryStates(id) {
    this.apiService.getStates(id).subscribe(
      (res) => {
        this.allStates = res.data;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  currencyChange(){
    this.gift_amount=0;
  }

}
