import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform ,Events} from 'ionic-angular';
import {
  LoginPage,
  SignupPage,
} from '../../pages/pages';

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {
  tab1: any;
  tab2: any;
  index: number;
  tab2Params:any; 
  pushNotificationData: any;
  wishlistId:any;
  listUrl:any;
  public isIos: any;
  public productInfoObj:any;
  
  constructor(
    public platform: Platform,
    public navCtrl: NavController, public navParams: NavParams,public events:Events) {
    this.index = this.navParams.get('tabIndex');
    this.pushNotificationData=this.navParams.get('pushNotification');
    this.productInfoObj = (this.navParams.get('productInfoObj') ? this.navParams.get('productInfoObj') : "");
    this.tab1 = SignupPage;
    this.tab2 = LoginPage;

    this.wishlistId = this.navParams.get('wishlistId');
    this.listUrl = this.navParams.get('listUrl');
    
     console.log({ pageinfo: this.navParams.get('pid'),pqty: this.navParams.get('pqty'),type:this.navParams.get('type'), wishlistId:this.wishlistId, listUrl:this.listUrl});


     this.tab2Params = { pageinfo: this.navParams.get('pid'),pqty: this.navParams.get('pqty'),parrentId:this.navParams.get('parrentId'),pushNotification:this.navParams.get('pushNotification'),type:this.navParams.get('type'), wishlistId:this.wishlistId, listUrl:this.listUrl, fromListing: this.navParams.get('fromListing'), productInfoObj: this.productInfoObj };
     if (this.platform.is('ios')) {
      this.isIos = true;
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Auth2Page');
  }
}
