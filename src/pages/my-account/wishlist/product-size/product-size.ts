import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import {TranslateService} from 'ng2-translate/ng2-translate';

@IonicPage()
@Component({
  selector: 'page-product-size',
  templateUrl: 'product-size.html',
})
export class ProductSizePage {

  public item:any;
  public tap:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app:App, public viewCtrl:ViewController,public translate : TranslateService) {
    this.item = this.navParams.get('item');
    this.tap=this.translate.instant("android");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeSizePage');
  }

  closeSizeModal(){
    this.viewCtrl.dismiss();
  }
  
  changeProductSize(item){
    let pid='';
    if(item.parent_id){
      pid =item.parent_id;
    }else{
      pid =item.product_id;
    }
    this.viewCtrl.dismiss({"pid" : pid});
   
  }
}
