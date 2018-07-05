import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {LoadingController} from 'ionic-angular';
import 'rxjs/add/operator/map';


@Injectable()
export class LoadingserviceProvider {

   public loading :any;
  constructor(public http: Http,public loadingCtrl: LoadingController) {
    
  }

  presentLoadingCustom() {
    let options = {
      showBackdrop : true,
    
      spinner : "crescent",
     
    }
    this.loading = this.loadingCtrl.create(options);
    this.loading.present();
    }
   dismissLoadingCustom() {
   	 this.loading.dismiss();
   }


}
