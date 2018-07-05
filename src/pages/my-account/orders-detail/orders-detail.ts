import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
   LocalStorageProvider
} from '../../../providers/providers';

  
@IonicPage()
@Component({
  selector: 'page-orders-detail',
  templateUrl: 'orders-detail.html',
})
export class OrdersDetailPage {
  public orderDetails:any;
  public itemDetails:any;
  public user:any;
  returnStat:any;
  constructor(
    private nativeStorage: LocalStorageProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams) {
    this.orderDetails = this.navParams.get('order');
    this.itemDetails = this.navParams.get('item');
   }

  goToMyAccount() {
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
  }

  mailto(email) {
    if(this.returnStat == 'Cancel'){
        email = email+"?subject=Request for cancellation: order "+this.orderDetails.orderId+"&body=Hey Jaypore, %0D%0A %0D%0A I request you to cancel the item "+this.itemDetails.sku+" from my order "+this.orderDetails.orderId+". %0D%0A %0D%0A Regards, %0D%0A"+this.user.first_name+" "+this.user.last_name; 
    } else if(this.returnStat == 'Return'){
        email = email+"?subject=Request for return: order "+this.orderDetails.orderId+"&body=Hey Jaypore, %0D%0A %0D%0A I would like to return the item "+this.itemDetails.sku+" from my order "+this.orderDetails.orderId+". %0D%0A Regards, %0D%0A "+this.user.first_name+' '+this.user.last_name; 
    }
    window.open(`mailto:${email}`, '_system');
  }

  returnOrder(status) {
    this.user = this.nativeStorage.getnativeStorage('user');
    this.returnStat = status;
  }

}
