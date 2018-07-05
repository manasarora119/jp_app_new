import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,Platform,Events } from 'ionic-angular';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {
    LocalStorageProvider,
 } from '../../../providers/providers';
@IonicPage()
@Component({
  selector: 'page-size-view',
  templateUrl: 'size-view.html',
})
export class SizeViewPage {

  public productSize:any;
  public tap: any;

  constructor(  public events:Events,public platform: Platform,public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController,public translate : TranslateService,public nativeStorage:LocalStorageProvider ) {
    this.tap=this.translate.instant("android");
    this.productSize = this.navParams.get('sizes');
   
     
  }

  ionViewDidLoad() {
    //  this.platform.registerBackButtonAction(() => {
    //   this.viewCtrl.dismiss();
    // }); 

    
    /* this.platform.registerBackButtonAction(function (event) {
    event.preventDefault();
    }, 100); */
  }

  closeModal() {

console.log('view similar -modal   close modal');
 
    this.viewCtrl.dismiss(); 
   
  }

  

}
