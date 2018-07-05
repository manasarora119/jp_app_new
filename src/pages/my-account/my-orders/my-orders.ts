import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, MyAccountPage,OrdersDetailPage,EmptyOrderPage } from '../../pages';
import {
  AppServiceProvider,
  TosterserviceProvider,
  UtilitiesProvider,
  LoadingserviceProvider,
  LocalStorageProvider,
  ConstantsProvider
} from '../../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-my-orders',
  templateUrl: 'my-orders.html',
})
export class MyOrdersPage {
  public myOrder: any;
  public myOrdertmp: any;
  paymentStatus:any;
  searchTerm: string = '';
  items: any;

  constructor(private apiService: AppServiceProvider,
    public nativeStorage:LocalStorageProvider, 
    public loadingCtrl: LoadingserviceProvider, 
    public utilities: UtilitiesProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public constants:ConstantsProvider,
    public toasterCtrl: TosterserviceProvider) {
    this.paymentStatus=this.navParams.get('page');
    this.nativeStorage.deleteItems('notificationStatus');  
    if(this.paymentStatus == 'paymentStatus') {
      var res = this.navParams.get('order');
      this.myOrder = res.data;
      this.myOrdertmp = [];
      var i = 0;
      for(var key in res.data) {
        for(var key1 in res.data[key].items) {
          res.data[key].items[key1].order_key = key;
          this.myOrdertmp.push(res.data[key].items[key1]);
          i++;
        }
        this.items = this.myOrdertmp;
      }
    } else {
      this.getMyOrders();
    }
  }

  goToMyAccount() {
    if(this.paymentStatus == 'paymentStatus') {
      this.navCtrl.setRoot(HomePage);
    } else {
      //this.navCtrl.push(MyAccountPage);
      this.navCtrl.pop();
    }
  }
  goToOrdersDetail(order,item) {
    this.navCtrl.push(OrdersDetailPage, {
      order: order,
      item:item
    });
  }

  setFilteredItems() {
      this.myOrdertmp = this.items;
      this.myOrdertmp = this.myOrdertmp.filter((item) => {
        return item.product_name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
  }

  ionViewDidLoad() {
    }

  getMyOrders() {
    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.apiService.getMyOrders().subscribe(
        (res) => {
          this.loadingCtrl.dismissLoadingCustom();
          if (!res.error) {
            this.myOrder = res.data;
            this.myOrdertmp = [];
            var i = 0;
            for(var key in res.data) {
              for(var key1 in res.data[key].items) {
                res.data[key].items[key1].order_key = key;
                this.myOrdertmp.push(res.data[key].items[key1]);
                i++;
              }
              this.items = this.myOrdertmp;
            } 
            
          } else {
            console.log("Error: "+res.message);
            this.navCtrl.push(EmptyOrderPage);
          }
        },
        (err) => {
          this.loadingCtrl.dismissLoadingCustom();
          console.log(err);
        });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

}
