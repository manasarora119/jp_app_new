import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Vibration } from '@ionic-native/vibration';
import { Platform , Events} from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';

import {
  LoadingserviceProvider,
  AppServiceProvider, ModelinfoProvider,
  TosterserviceProvider,
  GtmProvider,
  LocalStorageProvider,
  BetaoutProvider,
  ConstantsProvider
} from '../../providers/providers';




/*
  Generated class for the GlobalFunctionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
declare var cordova;
@Injectable()
export class GlobalFunctionProvider {
  itemspartners: any;
  pname: string;
  public productInfoObj: any = '';
  bagcount: any;
  productAddedMsg: any;
  isSelected: number;
  modelpopinfo: any;
  itemsToBag: any;
  qty(arg0: any, arg1: any): any {
    throw new Error("Method not implemented.");
  }
  productId(arg0: any, arg1: any): any {
    throw new Error("Method not implemented.");
  }

  constructor(public http: Http,
    public loadingCtrl: LoadingserviceProvider,
    public AppService: AppServiceProvider,
    public Modelinfo: ModelinfoProvider,
    public toasterCtrl: TosterserviceProvider,
    public vibration: Vibration,
    public gtm: GtmProvider,
    public nativeStorage: LocalStorageProvider,
    public events: Events,
    public betaout: BetaoutProvider,
    public plt: Platform,
    public constants:ConstantsProvider
  ) {
    console.log('Hello GlobalFunctionProvider Provider');
  }

    /**
   * 
   * @param productId 
   */

  addToBag(productId, qty) {

    this.AppService.addToBag(productId, qty).subscribe((res) => {
      this.itemsToBag = res;
      console.log(this.itemsToBag);
      if (this.itemsToBag.error) {
        this.modelpopinfo = this.Modelinfo.addToBag();
        if (this.itemsToBag.message == 'Record not found') {
          let checkProductInCart = this.checkProductInCart(productId);
          if (checkProductInCart && checkProductInCart === true) {
            this.toasterCtrl.presentToast('You have already added the last available piece to your cart.', 'bottom', '3000', false);
          } else {
            this.toasterCtrl.presentToast('Product out of stock', 'bottom', '3000', false);
          }
          //this.toasterCtrl.presentToast('Product out of stock', 'bottom', '3000', false);
        } else {
          this.toasterCtrl.presentToast('Retry another product', 'bottom', '3000', false);
        }
        this.isSelected = -1;
      } else {
        // let addtocart = "Product_ID=" + this.productId + "Product_name=" + this.pname + "SKUID=" + this.itemspartners.sku + "price=" + this.itemspartners.final_price + "qty=1";
        // this.gtm.gtminfo('page-pdp', '/pdp', 'Add To Cart', addtocart);
        this.productAddedMsg = this.itemsToBag.data.message;
        this.bagcount = this.itemsToBag.data.productsCount;
        this.saveProductToLocal(productId);
        this.toasterCtrl.presentToast(this.productAddedMsg, 'bottom', '3000', false);
        this.vibration.vibrate(300);
        this.nativeStorage.setnativeStorage('cartCount', this.itemsToBag.data.productsCount);
        this.events.publish('CartUpdated', this.itemsToBag.data.productsCount);
        this.productInfoObj['sel_qty'] = this.qty;
        this.betaout.productAddedInCart(this.productInfoObj);

      }

    }, error => {
      this.loadingCtrl.dismissLoadingCustom();
    });
  }

  addToWishList(id) {

    this.AppService.manageWishlist(id).subscribe((res) => {
      if (res.error === false) {
        this.toasterCtrl.presentToast(res.message, 'bottom', '1500', false);
      }
    },
      (err) => {
        this.toasterCtrl.presentToast(err.message, 'bottom', '3000', false);
        console.log(err);
      });
  }

  saveProductToLocal(productId) {
    console.log(productId);
    let products = localStorage.getItem('ProductInCart');
    if (products == null) {
      let allProducts = [];
      allProducts.push(productId);
      console.log(JSON.stringify(allProducts));
      localStorage.setItem('ProductInCart', JSON.stringify(allProducts));
    } else {
      let productsArr = [];
      productsArr = JSON.parse(products);
      if (products.indexOf(productId) == -1) {
        productsArr.push(productId);
        localStorage.setItem('ProductInCart', JSON.stringify(productsArr));
      }

    }
  }

  /**
   * 
   * @param productId 
   */
  checkProductInCart(productId) {
    console.log(productId);
    let products = localStorage.getItem('ProductInCart');
    if (products && products != null) {
      let productsArr = JSON.parse(products);
      if (productsArr.indexOf(productId) > -1) {
        return true;
      }
    }
    return false
  }

    /**
   * 
   * @param productId 
   */
  RemoveProductFromCart(productId) {
    console.log(productId);
    let products = localStorage.getItem('ProductInCart');
    if (products && products != null) {
      let productsArr = JSON.parse(products);
      console.log(productsArr);
      console.log(productsArr.indexOf(productId));
      if (productsArr.indexOf(productId) > -1) {
          let Ind = productsArr.indexOf(productId);
          productsArr.splice(Ind,1);
          localStorage.setItem('ProductInCart', JSON.stringify(productsArr));
      }
    }
    
  }

  emptyCart() {
    localStorage.setItem('ProductInCart', JSON.stringify([]));
  }

  sharePdpUrl(pdpWebURL,productId){
    let url=this.constants.getConfig().hostURL;
    if(pdpWebURL){
      console.log("encodeURL");
      var uri = "jaypore.app://jaypore.com?pushnotification=pdp&pid="+productId;
      var uri = encodeURIComponent(uri);
      url=url+'deep_link.php?src='+uri+'&utm_source=sms&utm_medium=sms_9_nov&utm_campaign=deeplink&url='+pdpWebURL;
    }else{
      url=url+'deep_link.php?src='+uri+'&url='+url;
    }
    // this.tinyURL(url).then(res => {
    //   url=res;
    //   return url;
    // });
    return url;

  }

}
