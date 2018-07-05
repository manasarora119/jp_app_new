import { Component, Input } from '@angular/core';
import {  ListingPage} from '../../pages/pages';
import {NavController} from 'ionic-angular';
import {
  LocalStorageProvider
} from '../../providers/providers';


/**
 * Generated class for the TagsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'tags',
  templateUrl: 'tags.html'
})
export class TagsComponent {

 @Input('textmg') message;
   public productTags :any; 

  constructor(public navCtrl: NavController, private nativeStorage: LocalStorageProvider) {
   // console.log("Tags");
   this.nativeStorage.setnativeStorage('searchStore', '');
  }

   ngOnInit(){
     this.productTags=this.message;
  }

  goToSearch(item){
      let addtocart="Slider Name=Homepage tag cloud&From=Homg Page&Tag name="+item;
      this.navCtrl.push(ListingPage, { search_key: 'searching', search_query: item,gtmheader:'Homepage sliders',gtmheadercontent:addtocart, searchPage:"searchProdct", source: 'Microsite' });
   
  }

}
