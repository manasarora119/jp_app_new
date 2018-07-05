import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav,Navbar, ViewController, Platform, ModalController,Events } from 'ionic-angular';
import {  ListingPage, MicrositePage} from '../pages';



import {
  TosterserviceProvider,
  LocalStorageProvider,
  LoadingserviceProvider,
  AppServiceProvider,
  GtmProvider,
  ConstantsProvider
} from '../../providers/providers';
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})

export class SearchPage {

  @ViewChild(Nav) nav: Nav;
  @ViewChild(Navbar) navBar: Navbar;
  

  labelAttribute = "name";
  searchInput = '';
  public autoSuggestData:any;
  searchHide = 0;
  public shopByData:any;
  public searchModal:any;
  options: any;
  rootPage: any;
  internetflag: any;
  popularLists: Array<{ name: string, component: any }>;
  recentSearch: any;
  search_query:string='';
  categories: any;
  hideRecent:boolean=true;
  hideRecentOnly:boolean=true;
  gtmheaderContent:any;
  gtmheader:any;
  isIos: any;

  constructor(private gtm: GtmProvider,public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl:ViewController,
    public loadingCtrl: LoadingserviceProvider,
    public modalCtrl: ModalController,
    public platform: Platform,
    public constants:ConstantsProvider,
    private nativeStorage: LocalStorageProvider,
    private AppService: AppServiceProvider, public toasterCtrl: TosterserviceProvider,public events :Events) {

      if (this.platform.is('ios')) {
        this.isIos = true;
      }
      this.nativeStorage.deleteItems('notificationStatus');
      this.gtm.gtminfo('page-search','/search','searchView','searchView');
      this.gtmheaderContent=this.navParams.get('gtmheadercontent');
       this.gtmheader=this.navParams.get('gtmheader');
     if(this.gtmheader){
      this.gtm.gtminfo('page-listing','/listing',this.gtmheader,this.gtmheaderContent); 
     }
      this.getShopByData();
    this.recentSearch = JSON.parse(this.nativeStorage.getnativeStorage('recent'));
    if(!this.recentSearch)
    {
      this.hideRecentOnly = true;
      this.recentSearch=[];
    }
    this.loadingCtrl.presentLoadingCustom();
    this.search_query = this.navParams.get('search_query');
    if(!this.search_query) {
      this.searchHide = 1;
      this.loadingCtrl.dismissLoadingCustom();
      this.search_query='';
    } else {
      this.searchHide = 0;
   
      this.navCtrl.push(ListingPage, { search_key: 'searching', search_query: this.search_query });

      this.loadingCtrl.dismissLoadingCustom();
      this.nativeStorage.setnativeStorage('searchStore',this.search_query);
    }
     
   
  }

  ionViewDidLoad() {
    if(this.searchHide) {
      this.setBackButtonAction();
    }
 }


  setBackButtonAction(){
    this.navBar.backButtonClick = ()=>{
      
      this.viewCtrl.dismiss();
      this.search_query = '';
      this.nativeStorage.setnativeStorage('searchStore', '');
    }
  }
dismiss(){
       this.viewCtrl.dismiss();
      this.search_query = '';
      this.nativeStorage.setnativeStorage('searchStore', '');
}


  ionViewDidEnter(): void {
    this.search_query = this.nativeStorage.getnativeStorage('searchStore');
    if(this.search_query) {
      this.searchHide = 1;
    }
  }


  itemSelected(page) {
    this.rootPage = page.component;
  }

  AutoCompleteService() {

  }

  filterItems(ev: any) {
    //if(this.autoSuggestData) {
      let val = ev.target.value;
      if(val) {
        if(val.length == 2) {
          this.getAutoSuggestData(val);
        }else if(val.length > 2) {
          if(this.autoSuggestData) {
            this.hideRecent = false;
            // Reset items back to all of the items
            this.options = this.autoSuggestData;

            // if the value is an empty string don't filter the items
            if (val && val.trim() != '') {
              this.options = this.options.filter((item) => {
                return (item.name.toLowerCase().startsWith(val.toLowerCase()));
              }).slice(0,10);
            }
          }
        } else {
          this.options = [];
          this.hideRecent = true;
        }
    } else {
      this.options = [];
      this.hideRecent = true;
    }
  }

  getAutoSuggestData(val){
     this.gtm.gtminfo('page-Search auto suggest','/Search recent',val,val);
    var ts = this;
    this.AppService.getAutoSuggestData(val).subscribe(
      (result) => {
          ts.autoSuggestData=[];

          result.data.Brand.forEach(function (value, i) {
            ts.autoSuggestData.push({'name':value});
          });

          /*result.data.Categories.forEach(function (value, i) {
            ts.autoSuggestData.push({'name':value});
          });

          result.data.Material.forEach(function (value, i) {
            result.data.Categories.forEach(function (value1, j) {
              ts.autoSuggestData.push({'name':value + ' ' +value1});
            });
          });

          result.data.Colors.forEach(function (value, i) {
            result.data.Categories.forEach(function (value1, j) {
              ts.autoSuggestData.push({'name':value + ' ' +value1});
            });
          });*/
      }, error => {
        ts.internetflag = 1;
        ts.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
      });
  }

  gotoListing(query) {
    this.gtm.gtminfo('page-Search recent','/Search recent',query,query);
    this.nativeStorage.setnativeStorage('searchStore',query);
    this.options = [];
    if(this.recentSearch.indexOf(query) < 0) {
      this.hideRecentOnly = false;
      this.recentSearch.push(query);
      this.nativeStorage.setnativeStorage('recent',JSON.stringify(this.recentSearch));
    }
     
    this.navCtrl.push(ListingPage, {'search_key':'searching','search_query':query,searchPage:"searchProdct"}).then(() => {         
               const index = this.viewCtrl.index;
              this.navCtrl.remove(index);
             });
   
  }
  gotoListingShopBy(id,type) {
  
    if(type == 'Event') {
      this.navCtrl.push(ListingPage, {'search_key':'event_id','search_id':id});
    } else if(type == 'Brand') {
      this.navCtrl.push(ListingPage, {'search_key':'brand_id','search_id':id});
    } else if(type == 'Category') {
      this.navCtrl.push(ListingPage, {'search_key':'category_id','search_id':id});
    } else if(type == 'search') {
      this.navCtrl.push(ListingPage, {'search_key':'searching','search_query':id});
    } else if (type == 'Spl_page') {
      this.navCtrl.push(MicrositePage, {'pid':id});
    }
   
  }
  gotoListingOnEnter(ev: any) {
      this.options = [];
      let val = ev.target.value;


      if(this.recentSearch.indexOf(val) < 0) {

        this.hideRecentOnly = false;

        this.recentSearch.push(val);

        this.nativeStorage.setnativeStorage('recent',JSON.stringify(this.recentSearch));
      }

   
      this.navCtrl.push(ListingPage, {'search_key':'searching','search_query':val, searchPage:"searchProdct"}).then(() => {         
               const index = this.viewCtrl.index;
              this.navCtrl.remove(index);
             });
  }
  removeRecent(item) {
    this.gtm.gtminfo('page-Search clear','/Search recent',item,item);
    this.recentSearch.splice(this.recentSearch.indexOf(item),1);
    this.nativeStorage.setnativeStorage('recent',JSON.stringify(this.recentSearch));
  }

  getShopByData() {
    var ts = this;
    this.AppService.getShopByData().subscribe(
      (result) => {
          if(result.error == false) {
            this.shopByData = result.data[0];
          } else {
            ts.toasterCtrl.presentToast(result.message, 'bottom', '3000', false);
          }
      }, error => {
        ts.internetflag = 1;
        ts.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
      });
  }
  goback() {
   this.navCtrl.pop();
  }
}
