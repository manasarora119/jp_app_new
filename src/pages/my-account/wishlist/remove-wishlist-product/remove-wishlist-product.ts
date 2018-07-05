import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App,Events } from 'ionic-angular';
import {
  LocalStorageProvider,
} from '../../../../providers/providers';
/**
 * Generated class for the RemoveWishlistProductPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-remove-wishlist-product',
  templateUrl: 'remove-wishlist-product.html',
})
export class RemoveWishlistProductPage {
  public item:any;
  
    
    constructor(
      public navCtrl: NavController, 
      public viewCtrl: ViewController, 
      public app: App,
      public navParams: NavParams,
      public nativeStorage :LocalStorageProvider,
      public  events:Events,
      
     ) {
      this.item = this.navParams.get('item');
     
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad RemoveProductPage');
    }
  
    closeRemoveModal(){
      this.viewCtrl.dismiss();
    }
  
    removeCartProduct(item){
     // console.log(item);
     
     this.viewCtrl.dismiss({"removeThisItem" : item});
    }
}
