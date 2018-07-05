import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController,Events } from 'ionic-angular';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {  LocalStorageProvider} from '../../../providers/providers';
/**
 * Generated class for the ChangeSizePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-size',
  templateUrl: 'change-size.html',
})
export class ChangeSizePage {
  public item:any;
  public tap:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app:App, public viewCtrl:ViewController,public translate : TranslateService,public events:Events, 
    public nativeStorage: LocalStorageProvider,
  ) {
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
