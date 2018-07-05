import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform, Events, ModalController, ViewController, Content, App, IonicApp } from 'ionic-angular';
import { CartPage, LandingPage, SearchPage, PdpPage, InviteEarnPage, WishlistPage, ListingPage, GiftCardsPage, MyAccountPage, QrCodePage, QrScanHistoryPage, MyCouponsPage, MyOrdersPage, JpCreditsPage, GiftcardPaymentPage, MicrositePage } from '../pages';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { DatePipe } from '@angular/common';
import {
  LoadingserviceProvider,
  LocalStorageProvider,
  AppServiceProvider,
  TosterserviceProvider,
  GtmProvider,
  UtilitiesProvider,
  BetaoutProvider,
  ConstantsProvider
} from '../../providers/providers';

//declare var dataLayer:any;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {
  subcomponent: any = [];
  exitstatus: number;
  userData: any;
  loginstatus: number;
  isLoggedIn: any;
  notificationStatus: any;
  public bagcount: any;
  headerDefault: boolean = true;
  headerScroll: boolean = false;
  public navIsFixed: boolean = false;
  public compchk: any = 'nodata';
  public full: any;
  public user: any;
  public loginchkval: number = 0;
  public full_screen_banners: number = 0;
  public tag_cloud: number = 0;
  public vertical_scroll_slider_narrow: number = 0;
  public tiles: number = 0;
  public Home_Nav: number = 0;
  public Home_tag: number = 0;
  public Home_slider: number = 0;
  public Vertical_Banner: number = 0;
  public Narrow_carousel: number = 0;
  public wait: any = true;
  public isIos: any;
  public loginView = { showBackdrop: true, enableBackdropDismiss: true, cssClass: "login-view" }
  public loginModal: any;
  public frompdp: any;
  public fromListing: any;
  public listUrl: any; g
  public wishlistId: any;
  public showdata = false;
  public deeplink: any;
  public refereshing = false;

  constructor(
    public ionicApp: IonicApp,
    public platform: Platform,
    public navCtrl: NavController,
    public nativeStorage: LocalStorageProvider,
    public menuCtrl: MenuController,
    public toasterCtrl: TosterserviceProvider,
    public viewCtrl: ViewController,
    public datepipe: DatePipe,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private AppService: AppServiceProvider,
    public router: Router,
    public gtm: GtmProvider,
    public loadingCtrl: LoadingserviceProvider,
    public utitlities: UtilitiesProvider,
    public events: Events,
    public translate: TranslateService,
    public betaout: BetaoutProvider,
    public constants:ConstantsProvider,
    public app: App) {
    console.log('constructor ');
    this.isLoggedIn = this.AppService.isLoggedIn();
    this.frompdp = this.navParams.get('frompdp');

    this.deeplink = this.navParams.get('deeplink');



    this.fromListing = this.navParams.get('fromListing');
    this.exitstatus = 0;
    this.listUrl = this.navParams.get('listUrl');
    this.wishlistId = this.navParams.get('wId');

    console.log("home login listing url " + this.listUrl);
    console.log("home login listing product id " + this.wishlistId);
    this.betaout.setCustomerProperties();
    this.userTagNotification();
    this.menuCtrl.enable(true);
    if (this.platform.is('ios')) {
      this.isIos = true;
    }
    this.navIsFixed = true;

    this.notificationStatus = this.nativeStorage.getnativeStorage('notificationStatus');
    console.log("dfsnfndskjfjsd" + this.notificationStatus);
    console.log('tttttt');

    for (let key in this.nativeStorage.getnativeStorage('ajax_url')) {
      this.ajaxLoging();
      break;
    }

    this.gtm.gtminfo('page-home', '/home', 'homeView', 'homeView');

    this.showdata = true;
    // if(!this.frompdp){		
    //   this.showdata =false;		
    // }		


    /** 
     * For Deeplinking -  Page Routing
     */
    if (this.deeplink && this.deeplink != '') {
      if (this.deeplink == 'referandearn') {
        this.navCtrl.push(InviteEarnPage);
      } else if (this.deeplink == 'mycoupons') {
        this.navCtrl.push(MyCouponsPage);
      } else if (this.deeplink == 'MyOrdersPage') {
        this.navCtrl.push(MyOrdersPage);
      } else if (this.deeplink == 'JpCreditsPage') {
        this.navCtrl.push(JpCreditsPage);
      } else if (this.deeplink == 'GiftCardsPage') {
        this.navCtrl.push(GiftCardsPage);
      } else if (this.deeplink == 'MyAccountPage') {
        this.navCtrl.push(MyAccountPage);
      }
      /*else if (this.deeplink == 'HomePage') {
        this.navCtrl.push(HomePage);
      } */
      else if (this.deeplink == 'CartPage') {
        this.navCtrl.push(CartPage);
      } else if (this.deeplink == 'PdpPage') {
        this.navCtrl.push(PdpPage, { pid: this.navParams.get('pid') });
      } else if (this.deeplink == 'SearchPage') {
        let data = [{ 'name': 'search_query', 'value': this.navParams.get('search_query') }];
        data.push({ 'name': 'source', 'value': 'deeplink' });
        this.betaout.searchQuery(data);

        this.navCtrl.push(ListingPage, { search_query: this.navParams.get('search_query') });
      } else if (this.deeplink == 'ListingPage') {
        let search_key = this.navParams.get('search_key');
        let search_id = this.navParams.get('search_id');
        let data = [
          { 'name': 'source', 'value': 'deeplink' },
          { 'name': search_key, 'value': search_id }
        ];
        if (search_key == 'event_id') {
          this.betaout.eventViewed(data);
        }
        if (search_key == 'category_id') {
          this.betaout.categoryViewed(data);
        }
        if (search_key == 'brand_id') {
          this.betaout.brandViewed(data);
        }
        this.navCtrl.push(ListingPage, { search_key: this.navParams.get('search_key'), search_id: this.navParams.get('search_id') });
      } else if (this.deeplink == 'MicrositePage') {
        this.navCtrl.push(MicrositePage, { pid: this.navParams.get('pid') });
      } /**########################################*/
    }
    else if (this.frompdp == 'frompdp') {
      this.navCtrl.push(PdpPage, { pid: this.navParams.get('pid'), frompdp: "frompdp" });
    } else if (this.frompdp == 'fromlist') {
      this.navCtrl.push(CartPage);
    } else if (this.frompdp == 'InviteEarnPage') {
      this.navCtrl.push(InviteEarnPage);
    } else if (this.frompdp == 'GiftCardPage') {
      this.navCtrl.push(GiftCardsPage);
    } else if (this.frompdp == 'MyAccountPage') {
      this.navCtrl.push(MyAccountPage);
    } else if (this.frompdp == 'component') {
      this.navCtrl.push(this.navParams.get('pid'));
    } else if (this.fromListing == 'listingWishlist') {
      //console.log("after wishlist url is " + this.navParams.get('listUrl'));
      this.navCtrl.push(ListingPage, { wishlistId: this.wishlistId, listUrl: this.navParams.get('listUrl'), fromListing: this.navParams.get('fromListing') });
    } else if (this.frompdp == 'Qrhistory') {
      this.navCtrl.push(QrScanHistoryPage);
    } else {
      this.getHomeData();
    }


    this.isLoggedIn = this.AppService.isLoggedIn();
    if (this.isLoggedIn) {
      this.getCartCount();
    }

    this.events.subscribe('CartUpdated', () => {
      //this.getCartCount();
      this.setCartCount();
    });

    let vm = this;
    /*  this.events.subscribe('refreshHome', () => {
       console.log("refreshHome");
       vm.getHomeData() 
     }); */
    this.platform.registerBackButtonAction(() => {
      //        this.nav.setRoot(Main);
      console.log('back from Home');
      // alert( this.navCtrl.first());


      let activePortal = ionicApp._loadingPortal.getActive() ||
        ionicApp._modalPortal.getActive() ||
        ionicApp._overlayPortal.getActive();

      if (activePortal) {
        return activePortal.dismiss();
      }
      if (this.menuCtrl.isOpen()) {
        this.menuCtrl.close();
        return;
      }

      else {
        let nav1 = app.getRootNav();
        if (!nav1.canGoBack()) {
          this.nativeStorage.deleteItems('notificationStatus');
          if (this.exitstatus == 0) {
            this.toasterCtrl.presentToast(this.constants.toastConfig().closeApp, 'bottom', '2000', false);
          }
          this.exitstatus = this.exitstatus + 1;
          console.log(this.exitstatus);
          setTimeout(() => {
            this.exitstatus = 0;
          }, 2000);

          if (this.exitstatus == 2) {
            this.platform.exitApp();
          }
        }
        else {
          //  var dismiss='dismiss'+this.nativeStorage.getnativeStorage('modalStatus');
          //   console.log(dismiss);
          //   console.log(this.nativeStorage.getnativeStorage('modalStatus'));

          //   if(this.nativeStorage.getnativeStorage('modalStatus')!=0) {
          //     this.events.publish(dismiss);
          //   }

          // else{  
          //   this.navCtrl.pop();
          // }
          this.navCtrl.pop();
        }
      }
    });



  }

  ngOnInit() {
  }
  @ViewChild(Content) content: Content;

  public scrollToTop(): void {
    this.content.scrollToTop();
  }

  OnPageWillEnter() {
    console.log('page   eill neter');
    this.showdata = false;
    this.getHomeData();
  }

  loadmenudata() {
    var statusmenudata = this.nativeStorage.getnativeStorage('menudataStatus');
    var sidenav = this.nativeStorage.getnativeStorage('sidenav');
    if (this.utitlities.isOnline()) {
      if (!sidenav) {
        this.loadingCtrl.presentLoadingCustom();
        //  this.events.publish('getmenudata');
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
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  @HostListener("window:scroll", [])

  ionViewDidEnter() {
    console.log("Home page enter--------------");
    /*setInterval(() => {
      //this.getHomeData();
    }, 3000);*/
  }

  doRefresh(refresher) {
    this.refereshing = true;
    this.getHomeData();
    setTimeout(() => {
      console.log('doRefresh operation has ended');
      refresher.complete();
    }, 700);
  }

  login() {
    document.getElementById('#btn');
    // this.navCtrl.push(LandingPage);
    this.navCtrl.setRoot(LandingPage);
  }

  gotoCart() {
    if (this.AppService.isLoggedIn()) {
      this.navCtrl.push(CartPage);
    } else {
      this.navCtrl.setRoot(LandingPage);
    }
  }

  gotoWishlist() {
    if (this.AppService.isLoggedIn()) {
      this.navCtrl.push(WishlistPage);
    } else {
      this.navCtrl.setRoot(LandingPage);
    }
  }

  setCartCount() {
    this.bagcount = this.nativeStorage.getnativeStorage('cartCount');
  }

  getCartCount() {
    if (this.utitlities.isOnline()) {
      this.AppService.getCartCount().subscribe((res) => {
        if (res && !res.error && res.data && res.data) {
          this.bagcount = res.data.productsCount;
          this.nativeStorage.setnativeStorage('cartCount', res.data.productsCount);
        }
      });
    }
  }


  getHomeData() {
    this.showdata = false;
    let vm = this;
    if (this.notificationStatus != true || this.refereshing === true) {
      this.loadingCtrl.presentLoadingCustom();
      // this.nativeStorage.setnativeStorage('notificationStatus',false);
    }

    // return new Promise((resolve, reject) => {
    //........................compnent ifno ................//
    vm.AppService.getCoponentsinfo('home').subscribe((res) => {
      if (res.data && res.data.length != 0) {
        if (!this.frompdp) {
          localStorage.removeItem('compinfo');
        }
        vm.compchk = res.data;
        vm.nativeStorage.setnativeStorage('compinfo', { pid: this.compchk });
        vm.recentNative();
        vm.showdata = true;
        // resolve('sucess');
        if (this.notificationStatus != true || this.refereshing === true) {
          this.loadingCtrl.dismissLoadingCustom();
        }
      } else {
        // reject(res.message);
        vm.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
        if (this.notificationStatus != true || this.refereshing === true) {
          this.loadingCtrl.dismissLoadingCustom();
        }
      }
      this.refereshing = false;
    }, error => {
      if (this.notificationStatus != true || this.refereshing === true)
        this.loadingCtrl.dismissLoadingCustom();
      vm.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
      // reject('There seems to be a connectivity problem. Please try again.');
      this.refereshing = false;
    });

    //................................end.......................//
    // });
  }


  recentNative() {
    let recentProduct = this.nativeStorage.getnativeStorage('compinfo');
    if (recentProduct) {
      this.compchk = recentProduct.pid;

    }
  }
  search() {
    this.navCtrl.push(SearchPage);
  }


  userTagNotification() {


  }

  ajaxLoging() {
    let data = this.nativeStorage.getnativeStorage('ajax_url');
    let temp = {};
    temp['data'] = data;
    this.nativeStorage.deleteItems('ajax_url');
    this.AppService.internetLoging(temp).subscribe(
      (res) => {
        console.log("internet logging status done");
      },
      (err) => {
        console.log("internet logging status fails");
        console.log(err);
      }
    );
  }
  qrCode() {
    console.log('click on qr code..');
    this.navCtrl.push(QrCodePage);
  }
}
