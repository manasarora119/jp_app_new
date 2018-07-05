import { Component, NgZone, ViewChild } from '@angular/core';
import { HomePage, SearchPage, FilterModalPage, SortModalPage, PdpPage, LandingPage, CartPage, WishlistPage } from '../pages';
import { IonicPage, NavController, NavParams, Navbar, ModalController, Platform, Events, ViewController, Content, ToastController, AlertController } from 'ionic-angular';

import {
  LoadingserviceProvider,
  TosterserviceProvider,
  LocalStorageProvider,
  AppServiceProvider,
  UtilitiesProvider,
  GtmProvider,
  ConstantsProvider,
  BetaoutProvider
} from '../../providers/providers';
declare var SearchTap: any;
@IonicPage()
@Component({
  selector: 'page-listing',
  templateUrl: 'listing.html',
})
export class ListingPage {
  checkDataLenght: number = 0;
  storeID: any;
  StoryStatus: number = 0;
  infiniteScroll: any;
  wishlistFlag: boolean = false;
  public listingData: any;
  public searchingData: any;
  public popularData: any;
  public newarrivalData: any;
  public filterData: any;
  public productQty: any;
  public sortData: any;
  public filtername: any;
  public description: any;
  public filterCheckedData: any;
  public searchModal: any;
  private listingUrl: any;
  gridOptions: boolean = false;
  lastindex: number = 0;
  searchFlagStatus: number = 0;
  bagcount: any;
  public isLoggedIn: any;
  page: number = 1;
  sort: boolean = false;
  filter: boolean = false;
  sortby: string;
  public sortByNew: any;
  st: any;
  autoscrollflag: number = 1;
  limit: number = 80;
  public threshold: any;
  bannerData: any=[];
  listingType: string = "gridView";
  Wishlist: string = "Wishlist.png";
  search_key: string = '';
  search_id: any;
  public user: any;
  public loginchkval: number = 0;
  search_query: string;
  public filterModal: any;
  public sortModal: any;
  public lastScrollTop: number = 70;
  public isIos: boolean = false;
  public gridManu: boolean = false;
  public filterView = { showBackdrop: true, enableBackdropDismiss: true, cssClass: "filter-view" }
  public sortView = { showBackdrop: false, enableBackdropDismiss: true, cssClass: "sort-view" }
  public gtmheader: any;
  public gtmheaderContent: any;
  public searchView = { showBackdrop: true, enableBackdropDismiss: true, cssClass: "search-view" }
  public loginView = { showBackdrop: true, enableBackdropDismiss: true, cssClass: "login-view" }
  public loginModal: any;
  public addingToWishList: any;
  public itemspartnersShopall: any;
  public spinnerLoad: boolean = false;
  public dataRes: boolean = false;
  public allDataRes: boolean = false;
  public allListingProductCount: any;
  public availabelItem: any;
  public listingLimit: Number = 80;
  public searchFrom: any;
  public loader: null;
  ShopAllImagechk: Number = 0;
  public wishListing: boolean = false;
  public wishlistFlat: boolean = false;
  public removedPidFromWishList: any;
  public loadinProd: any = [];
  public source: any;
  public cName: any;

  showOption(type) {
    this.gridOptions = !this.gridOptions;
    this.listingType = this.gridOptions ? "fullWidth " : "gridView";

  }
  addToWishList(index) {
    event.stopPropagation();
    this.listingData.data.result[index].fave_flag = !this.listingData.data.result[index].fave_flag;
  }

  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(Content) content: Content;

  constructor(
    public betaout: BetaoutProvider,
    public loadingCtrl: LoadingserviceProvider,
    public utilities: UtilitiesProvider,
    public toasterCtrl: TosterserviceProvider,
    public navCtrl: NavController,
    private constant: ConstantsProvider,
    public navParams: NavParams,
    private AppService: AppServiceProvider,
    public modalCtrl: ModalController,
    public platform: Platform,
    public alertCtrl: AlertController,
    private ngZone: NgZone,
    public events: Events,
    private nativeStorage: LocalStorageProvider,
    private gtm: GtmProvider,
    public viewCtrl: ViewController,
    public ToastController: ToastController
  ) {
    this.betaout.setCustomerProperties();
    let threshold = this.limit / 2 * 100;
    this.threshold = threshold + "px";
    this.nativeStorage.deleteItems('notificationStatus');
    this.gtm.gtminfo('page-listing', '/listing', 'listingView', 'listingView');
    this.gtmheader = this.navParams.get('gtmheader');
    this.gtmheaderContent = this.navParams.get('gtmheadercontent');
    this.storeID = this.constant.getStore().xjypstore;
    if (this.gtmheader) {
      this.gtm.gtminfo('page-listing', '/listing', this.gtmheader, this.gtmheaderContent);
    }
    this.isLoggedIn = this.AppService.isLoggedIn();
    if (this.isLoggedIn) {
      this.getCartCount();
    }
    this.events.subscribe('CartUpdated', () => {
      this.setCartCount();
    });
    this.events.subscribe('productToWishlist', (productId, listingId, faveActionFlag) => {
      console.log(productId, listingId, faveActionFlag);
      if (this.listingData && this.listingData.data && this.listingData.data.result) {
        if (listingId && listingId != null && listingId != 'undefined' && typeof listingId != 'undefined') {
          this.listingData.data.result[listingId].fave_flag = faveActionFlag;
        } else {
          this.listingData.data.result.forEach(function (value, i) {
            if (value.id == productId) {
              value.fave_flag = faveActionFlag;
            }
          });
        }
      }


    });

    /*this.events.subscribe('productRemovedFromWishlist', (productId) => {
      /*console.log(productId);
      this.removedPidFromWishList = productId;
      console.log(this.removedPidFromWishList);*/
    /*});*/

    this.events.subscribe('productRemovedFromWishlist', (productId) => {
      if (this.listingData && this.listingData.data && this.listingData.data.result) {
        this.listingData.data.result.forEach(function (value, i) {
          if (value.id == productId) {
            value.fave_flag = false;
          }
        });
      }
    })

    if (this.platform.is('ios')) {
      this.isIos = true;
    }

    // this.st = new SearchTap('1cdbfcea680ac4b39145d5092e84bede35e9736c8c914cd3a6855cf0722feb0be4020dbf8c1b72dcf29b137a5e750ad457b286cceb76c0fcee9e33aff522214ca71f9bce8760966b9bd2d242c560c86eddf19dd689efae29892e0966de6ea4e5266b3c1b320e57da144a88f166b5b99aceccb61a45835e7e70f04d6b91de7d7b');
    this.st = new SearchTap('63a2d19b54142420324481bc646de684b5f80190d29c38284e592c9816261a38b8fbe475d13c93d937be239f7e8008b5305d0c2bbbb835ec81ec14fc0a94885f54409c372e165f20b019e9d4400df28fa11c778741ac38faebe260db49fd9af1ea7b1143fcf339e54eb3739961f09507716b61ffa13db43dfcaaaf467b1a8f0e');
    this.filterCheckedData = {};
    this.filterCheckedData.color = [];
    this.filterCheckedData.size = [];
    this.filterCheckedData.brands = [];
    this.filterCheckedData.price = [];
    this.filterCheckedData.material = [];
    this.filterCheckedData.category = [];
    this.filterCheckedData.product_type = [];
    this.sortByNew = {};
    this.sortByNew.order = [];
    this.search_key = this.navParams.get('search_key');
    this.search_id = this.navParams.get('search_id');
    this.searchFrom = this.navParams.get("searchPage");

    this.source = this.navParams.get("source");
    this.cName = this.navParams.get("cName");

    this.loadingCtrl.presentLoadingCustom();
    console.log(this.search_key , this.search_id , this.source, this.cName);
    //console.log(this.searchFrom);
    if (this.search_key && this.search_id && this.source) {
      let data = [];
      data.push(
        { 'name': 'source', 'value': this.source },
        { 'name': this.search_key, 'value': this.search_id },
      );
      if (this.search_key == 'event_id') {
        data.push(
          { 'name': 'event_name', 'value': this.cName }
        );
        this.betaout.eventViewed(data);
      }
      if (this.search_key == 'category_id') {
        data.push(
          { 'name': 'category_name', 'value': this.cName }
        );
        this.betaout.categoryViewed(data);
      }
      if (this.search_key == 'brand_id' || this.search_key == 'barnd_id') {
        data.push(
          { 'name': 'brand_name', 'value': this.cName }
        );
        this.betaout.brandViewed(data);
      }
    }


    if (this.search_key == 'searching') {
      this.search_query = this.navParams.get('search_query');
      let data = [];
      data.push(
        { 'name': 'search_query', 'value': this.search_query }
      );
      if(this.source) {
        data.push(
          { 'name': 'source', 'value': this.source }
        );
      }
      this.betaout.searchQuery(data);

      this.searchList(this.search_query);
    } else {
      this.getListingData();
      this.getFilterData();
      //console.log("after login on listing " + this.navParams.get('listUrl'));

    }
  }

  checkDetetedItem(i) {
    console.log(this.removedPidFromWishList);
    console.log(parseInt(i));
    if (this.removedPidFromWishList && this.removedPidFromWishList.length > 0) {
      if (this.removedPidFromWishList.indexOf(parseInt(i)) > -1) {
        console.log('exist');
        return true;
      } else {
        console.log('not exist');
        return false;
      }
    }
  }
  setCartCount() {
    this.bagcount = this.nativeStorage.getnativeStorage('cartCount');
  }

  getCartCount() {
    this.AppService.getCartCount().subscribe((res) => {
      if (res && !res.error && res.data && res.data) {
        this.bagcount = res.data.productsCount;
        this.nativeStorage.setnativeStorage('cartCount', res.data.productsCount);
      }
    });
  }

  loadmenudata() {
    var statusmenudata = this.nativeStorage.getnativeStorage('menudataStatus');
    var sidenav = this.nativeStorage.getnativeStorage('sidenav');
    if (this.utilities.isOnline()) {
      if (!sidenav) {
        this.loadingCtrl.presentLoadingCustom();
        //    this.events.publish('getmenudata');
        this.events.publish('sidenav');
        setTimeout(() => {
          this.loadingCtrl.dismissLoadingCustom();
        }, 1000);
      }

      if (!statusmenudata) {
        this.events.publish('getmenudata');
      }
    }
    else {
      this.toasterCtrl.presentToast(this.constant.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  filterModalShow() {
    let vm=this;
    this.filterModal = this.modalCtrl.create(FilterModalPage, { 'filters': this.filterData, 'filterCheckedData': this.filterCheckedData }, this.filterView);

    if (this.filter) {
      this.filterModal.present();
      this.filterModal.onDidDismiss(data1 => {
        if (Object.keys(this.filterCheckedData).length > 0) {
          var filterApp = [];
          var betaFilterData = [];
          betaFilterData.push(
            { 'name': 'page', 'value': this.cName },
            { 'name': 'page_id', 'value': this.search_id }
            //{'name': 'sort_selected','value': data1['sort']},
          );

          for (var key in this.filterCheckedData) {
            var filterKey = '';
            if (this.filterCheckedData[key] instanceof Array && this.filterCheckedData[key].length > 0) {
              this.filterCheckedData[key].forEach(function (value, i) {
                filterKey += value + ",";
              });
              betaFilterData.push(
                { 'name': key, 'value': this.checkLastComma(filterKey) }
              );
              //console.log(key);
              //console.log(filterKey);
            }
          }

          this.betaout.filter(betaFilterData);
        }

        if (data1.btnFlag != 0) {
          this.allDataRes = false;
          this.loadingCtrl.presentLoadingCustom();
          this.page = 1;
          this.listingData = '';
          this.getListingData();
          this.checkDataLenght=1;
        }
        if (data1.btnFlag1) {
          this.filterCheckedData = data1.btnFlag1;
        }
      });
    }
  }
  checkLastComma(fieldValue) {
    var lastChar = fieldValue.slice(-1);
    if (lastChar == ',') {
      fieldValue = fieldValue.slice(0, -1);
    }
    return fieldValue;
  }

  sortModalShow() {
    if (this.sort) {
      this.sortModal.present();
    }
  }

  getListingData() {
    // console.log("listing url after wishlist");    
    if (this.utilities.isOnline()) {
      if (this.navParams.get('fromListing') == 'listingWishlist') {
        this.wishListing = true;
        this.listingUrl = this.navParams.get('listUrl');
      } else {
        this.wishListing = false;
        this.listingUrl = this.search_key + "=" + this.search_id + '&storeId=2&filter_mode_active=true&page=' + this.page + '&limit=' + this.limit;
      }

      if (this.search_key != 'event_id') {

        for (var key in this.filterCheckedData) {
          if (key == 'price') {
            if (this.filterCheckedData[key].length > 0) {
              var priceArr = this.filterCheckedData[key][0].split("-");
              this.listingUrl = this.listingUrl + '&min_price=' + priceArr[0] + '&max_price=' + priceArr[1];
            }
          } else if (key == 'brands') {
            if (this.filterCheckedData[key].length > 0) {
              this.listingUrl = this.listingUrl + '&' + 'brand_id' + '=' + this.filterCheckedData[key].toString();
            }
          }
          else if (key == 'category') {
            if (this.filterCheckedData[key].length > 0) {
              this.listingUrl = this.listingUrl + '&' + 'category_id' + '=' + this.filterCheckedData[key].toString();
            }
          }
          else {
            if (this.filterCheckedData[key].length > 0) {
              this.listingUrl = this.listingUrl + '&' + key + '=' + this.filterCheckedData[key].toString();
            }
          }
        }
      } else {
        this.listingUrl = this.search_key + '=' + this.search_id + '&storeId=2&filter_mode_active=true';
        var parameters = this.search_key + '=' + this.search_id + '&storeId=' + this.storeID + '&filter_mode_active=true';
      }
      if (this.sortby) {
        this.listingUrl = this.listingUrl + '&sort=' + this.sortby;
      }
      this.gtm.gtminfo('page-Filter', '/Filter', 'Filter', this.listingUrl);
      this.AppService.listingPageData(this.listingUrl).subscribe(
        (data) => {
          this.allListingProductCount = data.data.numFound;
          this.searchFlagStatus = 0;
          
          this.lastindex = this.lastindex + (data.data.result.length - 1);
          var discnt = 0;
          if (this.page > 1) {
            this.dataRes = true;
          }
          if (this.page == 1) {
            if(this.checkDataLenght==0){
              this.checkDataLenght=data.data.result.length;
            }
            console.log("Data lenght of results:"+this.checkDataLenght);
            this.loadingCtrl.dismissLoadingCustom();
            this.listingData = data;
            if (!this.filtername) {
              this.filtername = this.listingData.data.filtername;
            }
            if (!this.description) {
              this.description = this.listingData.data.description;
            }
            if (this.listingData.data.event_story) {
              this.StoryStatus = 1;
            }
            else {
              this.StoryStatus = 0;
            }

            if (this.listingData.data.event_banner && this.listingData.data.event_banner.length > 0) {
              var bannerDataTmp = this.listingData.data.event_banner;
              this.bannerData = [];
              for (let item of bannerDataTmp) {
                if (item.pos != 0) {
                  this.bannerData[item.pos] = ({ 'pos': item.pos, 'banner': item.banner });
                }
              }
            } else if (this.listingData.data.banner_image) {
              var bannerDataTmp1 = this.listingData.data.banner_image;
              this.bannerData = [];
              for (let item of bannerDataTmp1) {
                if (item.pos != 0) {
                  this.bannerData[item.pos] = ({ 'pos': item.pos, 'banner': item.image });
                }
              }
            }
            if (this.listingData.data.result.length == 0) {
              this.searchFlagStatus = 1;
            }
          } else {
            this.listingData.data.result = [];
            this.listingData.data.result = data.data.result;
            console.log(this.listingData.data.result.length);

            if (this.dataRes = true) {
              this.loadingCtrl.dismissLoadingCustom();
            } else {
              this.loadingCtrl.dismissLoadingCustom();
            }
            this.infinteScrollComplete();
            if (data.data.result.length == 0) {
              this.autoscrollflag = 0;
            }

          }

          if (data.data.result.length < 1) {
            this.allDataRes = false;
            console.log("this.allDataRes =============== flase");
          } else {
            this.allDataRes = true;
            console.log("this.allDataRes =============== true");
          }


          if (this.search_key == 'event_id') {
            // this.loadingCtrl.presentLoadingCustom();
            // this.getPopularData();
            this.getNewArrivalData();
            this.getShopAllEvents();
            this.allDataRes = true;
            // this.loadingCtrl.dismissLoadingCustom();
          }

        }, error => {
          this.allDataRes = false;
          if (this.page >= 1) {
            this.loadingCtrl.dismissLoadingCustom();
          } else {
            this.infinteScrollComplete();
          }
          console.log("connectivity errr 1111111111111111");
          //this.toasterCtrl.presentToast('There seems to be a connectivity problem. Please try again.', 'bottom', '3000', false);

          let toast = this.ToastController.create({
            message: this.constant.toastConfig().noInternet,
            duration: 5000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: "Retry"
          });

          toast.onDidDismiss((data, role) => {
            if (role && role == "close") {

              this.getListingData();
            }
          });

          // toast.onDidDismiss(() => {
          //   this.getListingData();
          // });
          toast.present();

        });
    } else {
      this.allDataRes = false;
      console.log("connectivity errr 222222222222222222222");
      //this.toasterCtrl.presentToast('please check your internet connection.', 'bottom', '3000', false);
      let toast = this.ToastController.create({
        message: this.constant.toastConfig().noInternet,
        duration: 5000,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: "Retry"
      });

      toast.onDidDismiss((data, role) => {
        if (role && role == "close") {

          this.getListingData();
        }
      })

      // toast.onDidDismiss(() => {
      //   this.getListingData();
      // });
      toast.present();
      this.loadingCtrl.dismissLoadingCustom();
    }
  }



  getPopularData() {
    this.AppService.popularProductsData().subscribe(
      (data) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> Popular Products Data >>>>>>>>>>>>>>>>>>>");
        this.popularData = data;
      }, error => {
        this.toasterCtrl.presentToast(this.constant.toastConfig().noInternet, 'bottom', '3000', false);
      });
  }
  getNewArrivalData() {
    this.AppService.newArrivalProductsData().subscribe(
      (data) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> New Arrival Data >>>>>>>>>>>>>>>>>>>");
        this.newarrivalData = data;
      }, error => {
        this.toasterCtrl.presentToast(this.constant.toastConfig().noInternet, 'bottom', '3000', false);
      });
  }




  doInfinite(infiniteScroll) {
    console.log("------*****-infiniteScroll fired-*****-----");
    this.infiniteScroll = infiniteScroll;
    let vm = this;
    if (this.utilities.isOnline()) {
      setTimeout(() => {
        if (vm.autoscrollflag == 1) {
          vm.page = vm.page + 1;
          if (vm.listingData) {
            console.log("------*****-infiniteScroll fired 2-*****-----");
            vm.getListingData();
          } else {
            vm.searchList(vm.search_query);
          }

        }
      }, 500);
    } else {
      infiniteScroll.complete();
    }
  }

  infinteScrollComplete() {
    if (this.infiniteScroll) {
      setTimeout(() => {
        this.infiniteScroll.complete();
      }, 1000);
    }
  }

  gotoPdp(id, name, zimage, thimge, brand_name, slideinfo = null, prices = '', normal_price = '', special_price = '', i) {
    let addtocart = "Product_ID=" + id + "Product_name=" + name + "price=" + prices + "qty=1";
    this.navCtrl.push(PdpPage, {
      pid: id,
      brand_name: brand_name,
      name: name,
      zimage: zimage,
      thimge: thimge,
      gtmheader: slideinfo,
      fPrice: prices,
      nPrice: normal_price,
      sPrice: special_price,
      gtmheadercontent: addtocart,
      listingId: i
    });
  }

  getFilterData() {
    if(this.utilities.isOnline()){
      var parameters = this.search_key + "=" + this.search_id + '&storeId=' + this.storeID + '&filter_mode=true';
      this.AppService.getFilterData(parameters).subscribe(
        (data) => {
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> Filter Data >>>>>>>>>>>>>>>>>>>");
          this.filterData = data;
          if (this.filterData.data.sorting_detail && this.filterData.data.sorting_detail.options) {
            this.sortData = this.filterData.data.sorting_detail.options;
          }
          this.filter = true;
          this.sort = true;
          this.sortModal = this.modalCtrl.create(SortModalPage, { 'sort': this.sortData, 'sortByNew': this.sortByNew }, this.sortView);
  
          console.log("Filter Data");
          console.log(data);
  
          this.sortModal.onDidDismiss(data1 => {
            if (data1) {
  
              let sortData = [];
              sortData.push(
                { 'name': 'page', 'value': this.cName },
                { 'name': 'page_id', 'value': this.search_id },
                { 'name': 'sort_selected', 'value': data1['sort'] },
              );
              this.betaout.sort(sortData);
  
  
              this.allDataRes = false;
              this.sortby = data1.sort;
              this.loadingCtrl.presentLoadingCustom();
              this.page = 1;
              this.listingData = '';
              this.getListingData();
            }
          });
        }, error => {
          this.toasterCtrl.presentToast(this.constant.toastConfig().noInternet, 'bottom', '3000', false);
        });
    }
  }

  searchList(query) {
    if (this.utilities.isOnline()) {
      //this.loadingCtrl.presentLoadingCustom();
      let vm = this;
      if (vm.page == 1) {
        var searchOffset = 0;
      } else {
        searchOffset = (vm.page - 1) * vm.limit;
        console.log("Search Offset");
        console.log(searchOffset);
        //this.infinteScrollComplete();
      }
      this.st.search(query, 'jaypore_prod_india', { "filter": "in_stock = 1 AND parent_product_id = 0 AND _categories=*", "searchFields": ["name", "sku", "manufacturer"], "fields": ["name", "manufacturer", "discounted_price", "is_discount_available", "price", "Size", "readyToShip", "shipping_info", "_images"], "facets": [], "offset": searchOffset, "pageSize": vm.limit, "facetCount": 10, "typoTolerance": 1, "geo": {} })
        .then(function (data) {
          // let i = 0;
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> Search Listing>>>>>>>>>>>>>>>>>>>");
          for (let item of data.results) {
            //console.log(i++);
            //console.log(item);
            if (item._images && item._images.length > 0) {
              item._images[0] = item._images[0].replace('jypadm.jaypore.com', 'static.jaypore.com/tr:w-375,h-498', item._images[0]);
            }
            if (item.is_discount_available) {
              item.discount = Math.floor((item.price - item.discounted_price) / item.price * 100);
            } else {
              item.discount = 0;
            }

            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> Search Listing 22222222222222");

          }

          if (vm.page == 1) {
            console.log("vm.page  11111111111111111111");
            vm.loadingCtrl.dismissLoadingCustom();
            vm.searchingData = data;
            console.log(vm.searchingData);
            if (data.results.length == 0) {
              vm.autoscrollflag = 0;
              vm.searchFlagStatus = 1;
            }
          } else {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> Search Listing 333333333333333333333");
            vm.searchFlagStatus = 0;
            /*  for (let item of data.results.length) {
                vm.searchingData.results.push(item);
              }*/
            //let array = [];
            //vm.searchingData.results = array.concat(vm.searchingData.results, data.results);
            //console.log(vm.searchingData.results.length);

            console.log("Data Result 1111111111");
            vm.searchingData.results = [];
            console.log("Data Result 222222222");
            vm.searchingData.results = data.results;
            console.log("Data Result 33333333");
            console.log("Data Result");
            console.log(data.results);
            if (data.results.length == 0) {
              vm.autoscrollflag = 0;
            }
            vm.loadingCtrl.dismissLoadingCustom();
          }
          if (vm.page > 1) {
            vm.dataRes = true;
          }
          if (data.results.length < 1) {
            vm.allDataRes = false;
            console.log("Loading dismiss 1111111111111");
            vm.loadingCtrl.dismissLoadingCustom();
          } else {
            vm.allDataRes = true;
            console.log("Loading dismiss 2222222222222");
            //vm.loadingCtrl.dismissLoadingCustom();
          }
          console.log("search data length");
          console.log(data.results.length);
        })
        .catch(function (err) {
          vm.allDataRes = false;
          if (vm.page == 1) {
            console.log("Loading dismiss 33333333333333333");
            vm.loadingCtrl.dismissLoadingCustom();
          }
          //vm.toasterCtrl.presentToast('There seems to be a connectivity problem. Please try again.', 'bottom', '3000', false);
          let toast = vm.ToastController.create({
            message: this.constant.toastConfig().noInternet,
            duration: 5000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: "Retry"
          });

          toast.onDidDismiss((data, role) => {
            if (role && role == "close") {

              this.searchList();
            }
          });

          // toast.onDidDismiss(() => {
          //   this.searchList();
          // });
        });
    } else {
      this.allDataRes = false;
      this.toasterCtrl.presentToast(this.constant.toastConfig().noInternet, 'bottom', '3000', false);
      //this.infinteScrollComplete();
      this.loadingCtrl.dismissLoadingCustom();
    }
  }

  goNext(el) {
    el.scrollIntoView();
    //this.loadingCtrl.presentLoadingCustom();
    if (this.searchFrom == 'searchProdct') {
      this.loadingCtrl.presentLoadingCustom();
      this.allDataRes = false;
      this.page = this.page + 1;
      this.searchingData.results = [];
      this.searchList(this.search_query);
    } else {
      this.loadingCtrl.presentLoadingCustom();
      this.allDataRes = false;
      this.listingData.data.result = [];

      if (this.page == 1) {
        this.dataRes = false;
      }
      if (this.autoscrollflag == 1) {
        this.page = this.page + 1
        this.availabelItem = this.page * 160 < this.allListingProductCount;
        if (this.listingData) {
          this.getListingData();
        }
      }
    }
  }

  goPrevius(el) {
    el.scrollIntoView();
    if (this.page > 1) {
      if (this.searchFrom == 'searchProdct') {
        this.loadingCtrl.presentLoadingCustom();
        this.allDataRes = false;
        this.page = this.page - 1;
        this.searchingData.results = [];
        this.searchList(this.search_query);
      } else {
        this.loadingCtrl.presentLoadingCustom();
        this.listingData.data.result = [];
        this.allDataRes = false;
        if (this.autoscrollflag == 1) {
          this.page = this.page - 1
          if (this.listingData) {
            this.getListingData();
          }
        }
      }
    }
  }

  gotoCart() {
    if (this.AppService.isLoggedIn()) {
      this.navCtrl.push(CartPage);
    } else {
      this.navCtrl.setRoot(LandingPage, { pageinfo: "list" });
    }
  }
  search(flag) {
    if (flag == "back") {
      this.navCtrl.pop();
    } else {
      this.nativeStorage.setnativeStorage('searchStore', '');
      this.navCtrl.push(SearchPage).then(() => {
        const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
      });
    }
  }

  searchFromListing() {
    // this.searchModal = this.modalCtrl.create(SearchPage, {}, this.searchView);
    // this.searchModal.present();


    this.searchModal = this.navCtrl.push(SearchPage, { searchView: this.searchView });
    // this.searchModal.present();
  }

  gotohomepage() {
    this.navCtrl.setRoot(HomePage);
  }
  checkFocus() {
    this.navCtrl.push(SearchPage).then(() => {
      const index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }


  public scrollToTop(): void {
    this.content.scrollToTop();
  }
  getShopAllEvents() {
    //......................new product ................//
    this.AppService.getShopAllEvent().subscribe((res) => {
      if (res && res.data.length != 0) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> Shop All Events >>>>>>>>>>>>>>>>>>>");
        this.itemspartnersShopall = res.data;
        for (var x in this.itemspartnersShopall) {
          if (this.itemspartnersShopall[x].id == this.search_id) {
            this.itemspartnersShopall.splice(x, 1);
            break;
          }
        }
        this.ShopAllImagechk = 1;
      } else {
        this.ShopAllImagechk = 2;
      }

    }, error => {
      this.ShopAllImagechk = 2;
    });
    //........................end...................//

  }
  golist(tag, keyinfo = null, keyname = null, eventName) {

    if (keyinfo == 'event') {
      
      let addtocart = "Event Name=" + keyname + "&Event Id" + tag;
      this.navCtrl.push(ListingPage, { search_key: 'event_id', search_id: tag, gtmheader: 'Shop All Events', gtmheadercontent: addtocart, cName: eventName,source: 'Listing' });
    }
  }

  getDiscount(normal_price, final_price) {
    let discount = 0;
    discount = (normal_price - final_price) / normal_price * 100;
    discount = Math.floor(discount);
    return discount;
  }

  floor(value) {
    return Math.floor(value);
  }

  loginchk(productId, listUrl, type = null) {

    let alert = this.alertCtrl.create({
      title: 'Please login to continue',
      message: this.constant.toastConfig().loginRegistration,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            return true;
          }
        },
        {
          text: 'OK',
          handler: (data: any) => {
            if (type == 'listingWishlistType') {
              console.log("listing url login " + listUrl);
              console.log("listing id login " + productId);
              this.navCtrl.setRoot(LandingPage, { pageinfo: "listingWishlist", listUrl: listUrl, wishlistIid: productId, type: 'listingWishlistType' });
            } else {
              console.log("listing url login 2 " + listUrl);
              console.log("listing id login " + productId);
              this.navCtrl.setRoot(LandingPage, { pageinfo: "listingWishlist", listUrl: listUrl, wishlistIid: productId, type: 'listingWishlistType' });
            }
          }
        }
      ]
    });
    alert.present();
  }

  gotoWishlist() {
    this.user = this.nativeStorage.getnativeStorage('user');
    if (this.user) {
      this.loginchkval = 1;
    }
    if (this.loginchkval == 0) {
      this.navCtrl.setRoot(LandingPage, { pageinfo: "wishlist" });
    } else {
      this.navCtrl.push(WishlistPage);
    }
  }


  addToWishlist(id, i) {

    //this.removedPidFromWishList = null;
    if (this.isLoggedIn) {
      this.loadinProd.push(i);
      this.listingData.data.result[i].fave_flag = false;
      this.addingToWishList = i;

      this.wishlistFlat == true;
      this.AppService.manageWishlist(id).subscribe(
        (res) => {
          this.addingToWishList = false;
          this.listingData.data.result[i].fave_flag = res.fav_flag;
          if (this.loadinProd.indexOf(i) > -1) {
            this.loadinProd.splice(this.loadinProd.indexOf(i), 1);
          }
          if (res.error === false) {
            this.toasterCtrl.presentToast(res.message, 'bottom', '1500', false);
          }
        },
        (err) => {
          if (this.loadinProd.indexOf(i) > -1) {
            this.loadinProd.splice(this.loadinProd.indexOf(i), 1);
          }
          //this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(err.message, 'bottom', '3000', false);
          console.log(err);
        });
    } else {
      this.addingToWishList = false;
      this.loginchk(id, this.listingUrl, 'listingWishlist');
    }
  }


  /* getImageUrl(url) {
    // let newUrl = url.replace('jypadm.jaypore.com', 'static.jaypore.com/tr:w-282,h-375', url);
    let newUrl = url.replace('https://static.jaypore.com/tr:w-375,h-498/', 'https://static.jaypore.com/tr:w-282,h-375/', url);
    // console.log(url);

    // console.log(newUrl);
    return newUrl;
  } */
}
