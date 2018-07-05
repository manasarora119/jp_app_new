import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,Events } from 'ionic-angular';
import {
  TosterserviceProvider,
  GtmProvider,LocalStorageProvider
} from '../../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-sort-modal',
  templateUrl: 'sort-modal.html',
})
export class SortModalPage {

  public sortData: any;
  public sortByNew:any;
  constructor(private gtm: GtmProvider,public toasterCtrl: TosterserviceProvider, public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController, public events:Events, 
    public nativeStorage: LocalStorageProvider,) {
    this.sortData = this.navParams.get('sort'); 
    this.sortByNew = this.navParams.get('sortByNew'); 
    
  }

  ionViewDidLoad() {
   }

  dismiss(value) {
    this.sortByNew[0] = value;
    let addtocart="Sort selected="+value;
    this.gtm.gtminfo('page-Listing','/pdp','Sort',addtocart);
    this.viewCtrl.dismiss({'sort':value});
  }
}
