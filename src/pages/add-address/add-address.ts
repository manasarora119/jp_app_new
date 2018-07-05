import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { ValidationServiceProvider, AppServiceProvider, GtmProvider, LocalStorageProvider, BetaoutProvider } from '../../providers/providers';
import { PaymentPage } from '../pages';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { Keyboard } from '@ionic-native/keyboard';
@IonicPage()
@Component({
  selector: 'page-add-address',
  templateUrl: 'add-address.html',
})
export class AddAddressPage {
  KeyboardStatus: number = 0;
  public isKeyboardShown: any = false;
  public addressForm: any;
  // public addressCopy: any;
  public addressEdit: any;
  public allCountrys: any;
  public isState: boolean = false;
  public allStates: any;
  public cartData: any;
  public defaultCountry: any;
  public sameAddress = true;
  public formUpdated = false;
  public tap: any;

  //@ViewChild('focusInput') myInput ;

  constructor(private gtm: GtmProvider, public navCtrl: NavController,
    public navParams: NavParams,
    public keyboard: Keyboard,
    private formBuilder: FormBuilder,
    private AppService: AppServiceProvider,
    public translate: TranslateService,
    public app: App,
    public events: Events,
    public nativeStorage: LocalStorageProvider,
    public betaout: BetaoutProvider,
  ) {
    this.tap = this.translate.instant("android");
    this.cartData = this.navParams.get('cartData');

    console.log(this.cartData);

    this.addressForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, ValidationServiceProvider.nameValidator])],
      telephone: ["", Validators.compose([Validators.required, ValidationServiceProvider.mobileValidator])],
      street: ["", [Validators.required]],
      city: ["", [Validators.required]],
      postcode: ["", [Validators.required]],
      country_id: ["IN", [Validators.required]],
      region_id: ["", [Validators.required]],
    });


    this.addressEdit = this.navParams.get('isEdit');
    if (this.addressEdit) {

      let data2 = 'Pincode=' + this.addressEdit.postcode + "&city=" + this.addressEdit.city + "&state=" + this.addressEdit.region + "&country=" + this.addressEdit.country_id;
      this.gtm.gtminfo('page-address', '/listing', 'Edit Saved address', data2);

      this.addressForm = this.formBuilder.group({
        name: [this.addressEdit.firstname + " " + this.addressEdit.lastname, [Validators.required]],
        telephone: [this.addressEdit.telephone, [Validators.required, ValidationServiceProvider.mobileValidator]],
        street: [this.addressEdit.street, [Validators.required]],
        city: [this.addressEdit.city, [Validators.required]],
        postcode: [this.addressEdit.postcode, [Validators.required]],
        country_id: [this.addressEdit.country_id, [Validators.required]],
        region_id: [this.addressEdit.region_id, [Validators.required]],
      });
    }


    // this.getAllCountrys();

    keyboard.onKeyboardShow()
      .subscribe(data => {

        this.isKeyboardShown = true;

      });
    keyboard.onKeyboardHide()
      .subscribe(data => {

        this.isKeyboardShown = false;

      });

    this.defaultCountry = "IN";
    this.getCountryStates(this.defaultCountry);


  }

  sameAddressToggle() {
    this.sameAddress = !this.sameAddress;
  }

  onChangeState($event) {
    console.log('changeStateCalled');
    if ($event && $event != '') {
      this.isKeyboardShown = false;
    }
  }

  getAllCountrys() {
    this.AppService.getCountrys().subscribe(
      (res) => {
        this.allCountrys = res.data;

      },
      (err) => {
        console.log(err);
      }
    )
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

  ionViewDidLoad() {

  }


  saveAddress() {
    let data;
    let data2 = 'Pincode=' + this.addressForm.pin + "&city=" + this.addressForm.city + "&state=" + this.addressForm.state + "&country=" + this.addressForm.country;
    this.gtm.gtminfo('page-listing', '/listing', 'Add new address', data2);


    if (this.sameAddress) {
      data = {
        address: this.addressForm.value,
        cartData: this.cartData
      };
      data.address.billing_name = this.addressForm.value.name;
      data.address.billing_telephone = this.addressForm.value.telephone;
      data.address.billing_street = this.addressForm.value.street;
      data.address.billing_city = this.addressForm.value.city;
      data.address.billing_postcode = this.addressForm.value.postcode;
      data.address.billing_country_id = this.addressForm.value.country_id;
      data.address.billing_region_id = this.addressForm.value.region_id;

      if (this.addressEdit) {
        data.address.entity_id = this.addressEdit.entity_id;
      }
      console.log(this.addressForm);
      this.betaoutSetUserProperties(data.address);
      this.navCtrl.push(PaymentPage, data);
    } else {
      console.log(this.addressForm);
      data = {
        address: this.addressForm.value,
        cartData: this.cartData
      };

      if (this.addressEdit) {
        data.address.entity_id = this.addressEdit.entity_id;
      }
      this.betaoutSetUserProperties(this.addressForm.value);
      this.navCtrl.push(PaymentPage, data);
    }
  }

  cancel() {
    this.navCtrl.pop();
  }

  updateBillingAddress() {
    this.sameAddress = !this.sameAddress;

    let addressCopy = this.addressForm.value;
    if (this.sameAddress == true) {
      this.addressForm = this.formBuilder.group({
        name: [addressCopy.name, Validators.compose([Validators.required, ValidationServiceProvider.nameValidator])],
        telephone: [addressCopy.telephone, Validators.compose([Validators.required, ValidationServiceProvider.mobileValidator])],
        street: [addressCopy.street, [Validators.required]],
        city: [addressCopy.city, [Validators.required]],
        postcode: [addressCopy.postcode, [Validators.required]],
        country_id: [addressCopy.country_id, [Validators.required]],
        region_id: [addressCopy.region_id, [Validators.required]],
        billing_name: [addressCopy.name,],
        billing_telephone: [addressCopy.telephone],
        billing_street: [addressCopy.street],
        billing_city: [addressCopy.city],
        billing_postcode: [addressCopy.postcode],
        billing_country_id: [addressCopy.country_id],
        billing_region_id: [addressCopy.region_id]
      });
      this.formUpdated = false;

    } else {
      this.addressForm = this.formBuilder.group({
        name: [addressCopy.name, Validators.compose([Validators.required, ValidationServiceProvider.nameValidator])],
        telephone: [addressCopy.telephone, Validators.compose([Validators.required, ValidationServiceProvider.mobileValidator])],
        street: [addressCopy.street, [Validators.required]],
        city: [addressCopy.city, [Validators.required]],
        postcode: [addressCopy.postcode, [Validators.required]],
        country_id: [addressCopy.country_id, [Validators.required]],
        region_id: [addressCopy.region_id, [Validators.required]],
        billing_name: ["", Validators.compose([Validators.required, ValidationServiceProvider.nameValidator])],
        billing_telephone: ["", Validators.compose([Validators.required, ValidationServiceProvider.mobileValidator])],
        billing_street: ["", [Validators.required]],
        billing_city: ["", [Validators.required]],
        billing_postcode: ["", [Validators.required]],
        billing_country_id: ["IN", [Validators.required]],
        billing_region_id: ["", [Validators.required]],
      });

      this.formUpdated = true;
    }
  }


  test() {


  }

  hideFooter() {
    this.isKeyboardShown = true;
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
    );
    if (this.sameAddress) {
      betaoutData.push({ name: "fullname", value: data.name });
    } else {
      betaoutData.push({ name: "fullname", value: data.billing_name });

    }
    //console.log(betaoutData);
    this.betaout.updateUserProperty(betaoutData);
    this.betaout.updateUserPhone(data.billing_telephone);

  }

}