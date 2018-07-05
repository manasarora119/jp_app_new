import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ValidationServiceProvider {

  constructor(public http: Http) {
    console.log('Hello ValidationServiceProvider Provider');
  }

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'required': 'Required',
      // 'invalidCreditCard': 'Is invalid credit card number',
      'invalidEmailAddress': 'Invalid email address',
      'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      'minlength': `Minimum length ${validatorValue.requiredLength}`
    };

    return config[validatorName];
  }

 
  static nameValidator(control) {
    if (control.value.match (/^[a-zA-Z ]+$/)) {
      return null;
    } else {
      return { 'invalidName': true };
    }
  }

  static emailValidator(control) {
      if (control.value.match (/^\w+([\.]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }




  static passwordValidator(control) {
      if (control.value.match('^(?=.*[0-9])(?=.*[a-z])[a-zA-Z0-9].{5,100}$')) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }


  static mobileValidator(control) {
    var phoneNo = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    if (control.value.match(phoneNo)) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }
  static priceValidator(control){
    var price = /^\+?([0-9])\)?[^\.]/;
    if (control.value.match(price)) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }

}


