import { Component, Input } from '@angular/core';
import { PdpPage,ListingPage } from '../../pages/pages';
import { NavController } from 'ionic-angular';
import {
  AppServiceProvider,
  LocalStorageProvider,
  } from '../../providers/providers';


/**
 * Generated class for the MostPopularComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'most-popular',
  templateUrl: 'most-popular.html'
})
export class MostPopularComponent {
  @Input('textmg') message;
  public mostPopularItems: any;
  public itemspartnersNew: any;
  public itemspartnersPopular: any;
  public itemspartnersRecentview: any;

  public productId: any;
  public itemspartnersSimilar: any;
  public SimilarImagechk: Number = 0;
  public NewImagechk: Number = 0;
  public PopularImagechk: Number = 0;
  public RecentviewImagechk: Number = 0;
  constructor(public navCtrl: NavController, private AppService: AppServiceProvider, private nativeStorage: LocalStorageProvider) {
   // console.log('Hello MostPopularComponent Component');
  }

  ngOnInit() {
    this.mostPopularItems = this.message;
    //......................similar product ................//
  
    for (let s in this.mostPopularItems.component_data) {
      
      if (this.mostPopularItems.component_data[s].type == 'New Arrivals') {
       this.AppService.newProduct().subscribe((res :any) => {

        if (res && res.message != 'Record not found') {
          //console.log(res);
          this.itemspartnersNew = res;
          this.NewImagechk = 1;
        } else {
          this.NewImagechk = 2;
        }

      }, error => {
        this.NewImagechk = 2;
      });
      }
    if (this.mostPopularItems.component_data[s].type == 'More Collection') {
          this.AppService.popularProduct().subscribe((res) => {
        if (res && res.length != 0) {
          this.itemspartnersPopular = res;
          this.PopularImagechk = 1;
        } else {
          this.PopularImagechk = 2;
        }
      }, error => {
        this.PopularImagechk = 2;
      });
      }


    
    if (this.mostPopularItems.component_data[s].type == 'Recent View') {
          let recentProduct = this.nativeStorage.getnativeStorage('recentPid');
          if(recentProduct){
          this.productId = recentProduct.pid;
       
          this.AppService.recentView(this.productId).subscribe((res) => {
        if (res.data && res.data[0].id != null) {
          this.itemspartnersRecentview = res;
          this.RecentviewImagechk = 1;
        } else {
          this.RecentviewImagechk = 2;
        }
      }, error => {
        this.RecentviewImagechk = 2;
      });
      }
    }else{
      this.RecentviewImagechk = 2;
    }


    }
  }

    //.....................end............................//

  

  goToAction(pid,name,zimage=null,thimge,brand_name=null,price=null) {

     let addtocart="Slider Name=Most-popular&Product Id="+pid+"&Product Name="+name+"&Price="+price;
      this.navCtrl.push(PdpPage, { pid: pid, brand_name:brand_name,
           name:name,
           zimage:zimage,
           thimge:thimge,gtmheader:'Most-popular',gtmheadercontent:addtocart });
  }
 goTolist(item){
     this.navCtrl.push(ListingPage, { search_key: 'barnd_id', search_id: item,source: 'homepage' });
 }         

}
