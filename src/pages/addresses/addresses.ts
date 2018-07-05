import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import {
  ValidationServiceProvider,
  AppServiceProvider,
  TosterserviceProvider,
  UtilitiesProvider,
  LoadingserviceProvider,
  GtmProvider,
  BetaoutProvider,
  ConstantsProvider
} from '../../providers/providers';
import { AddAddressPage, PaymentPage } from '../pages';
import { TranslateService } from 'ng2-translate/ng2-translate';

@IonicPage()
@Component({
  selector: 'page-addresses',
  templateUrl: 'addresses.html',
})
export class AddressesPage {
  public billingAddressForm: any;
  public selectedAddress: any;
  public addressesItem: any = null;
  public cartData: any;
  public showBillingAdd = true;
  public sameAddress = true;
  public addresslen: any;
  public allStates: any;
  public defaultCountry: any;
  public noaddchk: any = 0;

  public tap: any;
  @ViewChild(Content) content: Content;
  @ViewChild('addContent') addContent: ElementRef;
  constructor(private gtm: GtmProvider, public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private AppService: AppServiceProvider,
    public loadingCtrl: LoadingserviceProvider,
    public toasterCtrl: TosterserviceProvider,
    public utitlities: UtilitiesProvider,
    public translate: TranslateService,
    public betaout: BetaoutProvider,
    public constants:ConstantsProvider
  ) {
    this.tap = this.translate.instant("android");
    this.cartData = this.navParams.get('cartData');
    this.getSavedAddress();
    this.defaultCountry = "IN";
    this.getCountryStates(this.defaultCountry);

    this.selectedAddress = 0;
  }

  getSavedAddress() {
    if (this.utitlities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.AppService.getSavedAddresses().subscribe(
        (res) => {
          if (res && !res.error) {
            if (res.data.items) {
              this.addressesItem = res.data.items;
              this.addresslen = this.addressesItem.length;

              this.loadingCtrl.dismissLoadingCustom();
            } else {

              this.addressesItem = null;
              this.loadingCtrl.dismissLoadingCustom();
            }

          } else {
            this.addressesItem = null;
            this.loadingCtrl.dismissLoadingCustom();
            this.toasterCtrl.presentToast(res.error.message, 'bottom', '3000', false);
            this.noaddchk = 2;
          }
        },
        (err) => {
          console.log(err);
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(err.message, 'bottom', '3000', false);

        }
      )
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  editAddress(address) {
    this.navCtrl.push(AddAddressPage, { isEdit: address, cartData: this.cartData });
  }

  deleteAddress(address) {
    let data2 = 'Pincode=' + address.postcode + "&city=" + address.city + "&state=" + address.region + "&country=" + address.country_id;
    this.gtm.gtminfo('page-address', '/listing', 'Delete address', data2);
    let id = parseInt(address.entity_id);

    this.AppService.deleteSavedAddresses(id).subscribe(
      (res) => {

        this.getSavedAddress();

      },
      (err) => {
        console.log(err);
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressesPage');
  }

  addNew() {
    this.navCtrl.push(AddAddressPage, { cartData: this.cartData });
  }

  toggleGroup(group, city, postcode, street, country_id) {

    let data2 = 'Pincode=' + postcode + "&city=" + city + "&state=" + street + "&country=" + country_id;
    this.gtm.gtminfo('page-address', '/listing', 'Select saved address', data2);
    this.selectedAddress = group;


  };


  toggleBilling() {
    this.showBillingAdd = !this.showBillingAdd;
  }

  isGroupShown(group: any) {

    return this.selectedAddress == group;
  };

  selectAddress() {
    let item = this.addressesItem[this.selectedAddress];
    let data;
    if (this.sameAddress) {
      var billing_address = {
        billing_name: item.firstname + " " + item.lastname,
        billing_telephone: item.telephone,
        billing_street: item.street,
        billing_city: item.city,
        billing_postcode: item.postcode,
        billing_country_id: item.country_id,
        billing_region_id: item.region_id,
      };
      let address = Object.assign({}, item, billing_address);
      data = {
        address: address,
        cartData: this.cartData
      };
      console.log(billing_address);
      this.betaoutSetUserProperties(billing_address);
      this.navCtrl.push(PaymentPage, data);
    } else {
      let address = Object.assign({}, item, this.billingAddressForm.value);
      data = {
        address: address,
        cartData: this.cartData
      };
      console.log(this.billingAddressForm.value);
      this.betaoutSetUserProperties(this.billingAddressForm.value);
      this.navCtrl.push(PaymentPage, data);
    }
  }

  betaoutSetUserProperties(data) {
    let betaoutData = [];
    if (data.billing_region_id) {
      if (this.allStates && this.allStates.length > 0) {
        this.allStates.forEach((val) => {
          if (data.billing_region_id == val.region_id) {
            betaoutData.push({ name: "state", value: val.name });
          }
        });
      }
    }

    betaoutData.push(
      { name: "city", value: data.billing_city },
      { name: "country", value: data.billing_country_id },
      //{ name: "phone", value: data.billing_telephone },
      { name: "fullname", value:data.billing_name }
    )
    //console.log(betaoutData);
    this.betaout.updateUserProperty(betaoutData);
    this.betaout.updateUserPhone(data.billing_telephone);
    
  }


  updateBillingAddress(e: any) {

    let vm = this;

    if (e.checked) {

      this.sameAddress = true;
    } else {

      this.sameAddress = false;
    }

    if (this.sameAddress != true) {
      this.billingAddressForm = this.formBuilder.group({
        billing_name: ['', Validators.compose([Validators.required, ValidationServiceProvider.nameValidator])],
        billing_telephone: ["", Validators.compose([Validators.required, ValidationServiceProvider.mobileValidator])],
        billing_street: ["", [Validators.required]],
        billing_city: ["", [Validators.required]],
        billing_postcode: ["", [Validators.required]],
        billing_country_id: ["IN", [Validators.required]],
        billing_region_id: ["", [Validators.required]],
      });

      let el = document.getElementById('billingAdd');
      setTimeout(() => vm.goToDestination(el), 200);
    }
  }

  getCountryStates(id) {
    this.AppService.getStates(id).subscribe(
      (res) => {
        this.allStates = res.data;

      },
      (err) => {
        console.log(err);
      }
    )
  }

  goToDestination(el): void {
    if (el) {
      el.scrollIntoView();
    }

  }

}
