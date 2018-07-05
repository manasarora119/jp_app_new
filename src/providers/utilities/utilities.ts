import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

@Injectable()
export class UtilitiesProvider {

  constructor(private network: Network,
    public plt: Platform) {
   
  }

  togglePassword(item) {
    if (item.type == "password") {
      item.type = "text";
      item.setFocus();
    } else {
      item.type = "password";
      item.setFocus();
    }
  }


  isOnline() {
    if (this.plt.is('cordova')) {
          
      return !((this.network.type == "Connection.NONE") || (this.network.type == "none"));
    } else {
      return navigator.onLine;
    }
  }




}
