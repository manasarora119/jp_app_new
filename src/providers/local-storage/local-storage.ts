import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Events,Platform } from 'ionic-angular';


@Injectable()
export class LocalStorageProvider {

  constructor(public events: Events,public plt: Platform) {
   
  }

  setnativeStorage(name, obj) {
    localStorage.setItem(name, JSON.stringify(obj));
    if (name == 'user') {
      this.events.publish('updateUserData');
    }
  }

  getLoginUserDetail() {
    return JSON.parse(localStorage.getItem('user'));
  }

  saveQuoteIdToLocal(quoteid) { 
      if(quoteid) {
          localStorage.setItem('QuoteId', quoteid);
      }
  }

  saveSubtotalToLocal(data) {
      if(data.subTotal) {
          localStorage.setItem('Subtotal', data.subTotal);
      }
  }  

  getUserId() {
    var userData = JSON.parse(localStorage.getItem('user'));
    return userData.customer_id;
  }

  getAdditionalParamForPayment() {
      let data = {};
      data['QuoteId'] = localStorage.getItem('QuoteId') ? localStorage.getItem('QuoteId') : "";
      data['Subtotal'] = localStorage.getItem('Subtotal') ? localStorage.getItem('Subtotal') : "";
      //console.log(data);
      return data;
  }

  getnativeStorage(name) {
   
    let data = JSON.parse(localStorage.getItem(name));
   
    return data;
  }

  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('provider');
    localStorage.removeItem('user');
    localStorage.removeItem('userTags');
    localStorage.removeItem('cartCount');
    this.events.publish('updateUserData');
  }

  deleteItems(key){
    localStorage.removeItem(key);
  }

}
