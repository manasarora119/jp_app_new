import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, Events } from 'ionic-angular';
import { LocalStorageProvider, TosterserviceProvider, AppServiceProvider,GlobalFunctionProvider } from '../../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-remove-product',
  templateUrl: 'remove-product.html',
})
export class RemoveProductPage {
  public item: any;


  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public app: App,
    public navParams: NavParams,
    public events: Events,
    public nativeStorage: LocalStorageProvider,
    public toasterCtrl: TosterserviceProvider,
    public AppService: AppServiceProvider,
    public globalFuntion: GlobalFunctionProvider
  ) {

    this.item = this.navParams.get('item');


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RemoveProductPage');
  }

  closeRemoveModal() {
    this.viewCtrl.dismiss();
  }

  moveToWishlist(item) {
    let id;
    console.log(item);
    console.log('move to wishlist called');
    if (item.parent_id == null) {
      id = item.product_id
    }
    else {
      id = item.parent_id
    }
    this.AppService.manageWishlist(id).subscribe(
      (res) => {
        console.log(res);
        if (res.error === false) {
          if (res.fav_flag == false) {
            //if product removed from wishlist then add again to wishlist
            this.AppService.manageWishlist(id).subscribe(
              (res) => {
                this.toasterCtrl.presentToast(res.message, 'bottom', '1500', false);
              },
              (err) => {
                this.toasterCtrl.presentToast(err.message, 'bottom', '3000', false);
                console.log(err);
              });
          } else  {
              this.toasterCtrl.presentToast(res.message, 'bottom', '1500', false);
              this.events.publish('productadded', id);
              this.events.publish('productToWishlist', id, '', res.fav_flag);
          }
          this.globalFuntion.RemoveProductFromCart(id);
          this.removeCartProduct(item);

        }
      },
      (err) => {
        this.toasterCtrl.presentToast(err.message, 'bottom', '3000', false);
        console.log(err);
      });
  }

  removeCartProduct(item) {
    this.viewCtrl.dismiss({ "removeItem": item });
  }

}
