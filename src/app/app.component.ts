import {
  Component,
  ViewChild,
  NgZone
} from '@angular/core';
import {
  Nav,
  Platform,
  MenuController,
  Events,
  Content,
  NavController,
  App,
  IonicApp
} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from 'ng2-translate/ng2-translate';
import {
  HomePage,
  LandingPage,
  PdpPage,
  ListingPage,
  MyAccountPage,
  WalkthroughPage,
  GiftCardsPage,
  MicrositePage,
  InviteEarnPage,
  MyCouponsPage,
  MyOrdersPage,
  JpCreditsPage,
  CartPage,
  SearchPage,
  TermsPage,
  PrivacyPage,
  ContactUsPage,
  WishlistPage
} from '../pages/pages';
import {
  LocalStorageProvider,
  ConstantsProvider,
  TosterserviceProvider,
  ModelinfoProvider,
  UtilitiesProvider,
  AppServiceProvider,
  GtmProvider,
  LoadingserviceProvider
} from '../providers/providers';
import { Response } from '@angular/http';
import moment from 'moment';
import { AppMinimize } from '@ionic-native/app-minimize';
import { HockeyApp } from 'ionic-hockeyapp';
import { ManUpService } from 'ionic-manup';
import { Deeplinks } from '@ionic-native/deeplinks';
import { HomePageModule } from '../pages/home/home.module';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  deeplinkFlag: boolean = false;
  info: any;
  Blocks: any;
  previous_home_data: any = 'dummydata';
  component: {};
  homeimageurl: string;
  loginstatus: number;
  maxbrandlength: any;
  @ViewChild(Content) content: Content;
  @ViewChild('leftCats') leftItems;

  lastindex: number;
  pages_brands: any;
  pages_sub: any[];
  local_pages_sub_catg: any[];
  thirdLevelTitle: any;
  pages_brand: any[];
  initialBrands: any = [];
  onNotification: any = {};
  notificationFlag: boolean = false;
  pushFlag: boolean = false;
  public compchk: any;
  pushNotificationData: any;
  levelTitle: string;
  @ViewChild(Nav) nav: Nav;
  @ViewChild('content') navController: NavController;
  rootPage: any;
  loginchkval: number = 0;

  pages_catg: any;
  pages_cat: any;
  brand_page_flag: boolean = false;
  menu_close: string = '';
  public res: any;
  public pages: any = [];


  pageCatogerys: Array<{ title: string, img: string, component: any }>;
  level: any = 1;
  backflag: any;
  user: any;
  isIos: any = false;
  curtime: any;

  constructor(private appMinimize: AppMinimize, public platform: Platform,
    public statusBar: StatusBar, public config: ConstantsProvider,
    public splashScreen: SplashScreen,
    private nativeStorage: LocalStorageProvider,
    public toasterCtrl: TosterserviceProvider,
    public menuCtrl: MenuController,
    public events: Events,
    public Modelinfo: ModelinfoProvider,
    public utilities: UtilitiesProvider,
    public app: App,
    public zone: NgZone,
    private gtm: GtmProvider,
    public AppService: AppServiceProvider, public translate: TranslateService,
    public loadingCtrl: LoadingserviceProvider,

    manup: ManUpService,
    public hockeyapp: HockeyApp,
    public deeplinks: Deeplinks,
    private ionicApp: IonicApp
  ) {


    let vm = this;
    this.nativeStorage.setnativeStorage('componentstatus', 0);

    this.pageCatogerys = [];
    this.platform.ready().then(() => {


      this.platform.pause.subscribe((res) => {
        console.log("paused called");
      });
      this.platform.resume.subscribe((res) => {
        console.log("resumed called");
        //this.deepLinkData(true);
        console.log("this.onNotification");
        console.log(this.onNotification);
      });

      this.translate.setDefaultLang('in');
      this.translate.use('in');
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleLightContent();
      // this.statusBar.backgroundColorByHexString('#007ac1');
      // this.statusBar.styleDefault();
      this.splashScreen.hide();
      manup.validate();
      this.initEvents();

      this.events.subscribe('user:pushNotification', (pushNotificationData, time) => {
        console.log("events recieeved");
        this.pushNotificationAction(pushNotificationData['pushnotification']);
        this.pushFlag = true;
      });


      if (this.pushFlag == false) {
        this.nativeStorage.setnativeStorage('notificationStatus', true);
        console.log("data:" + this.nativeStorage.getnativeStorage('notificationStatus'));
        this.initEvents();
        this.initializeApp();
      }

      // The Android ID of the app as provided by the HockeyApp portal. Can be null if for iOS only.
      let androidAppId = 'd982189c64fb4f77bd5dcc4f24187100';
      // The iOS ID of the app as provided by the HockeyApp portal. Can be null if for android only.
      let iosAppId = '7ea7b82b9b6e4366a8c8dd57e07b2743';
      // Specifies whether you would like crash reports to be automatically sent to the HockeyApp server when the end user restarts the app.
      let autoSendCrashReports = false;
      // Specifies whether you would like to display the standard dialog when the app is about to crash. This parameter is only relevant on Android.
      let ignoreCrashDialog = true;

      hockeyapp.start(androidAppId, iosAppId, autoSendCrashReports, ignoreCrashDialog);

      //So app doesn't close when hockey app activities close
      //This also has a side effect of unable to close the app when on the rootPage and using the back button.
      //Back button will perform as normal on other pages and pop to the previous page.
      platform.registerBackButtonAction(() => {
        let nav = app.getRootNav();
        if (nav.canGoBack()) {
          nav.pop();
        } else {
          this.platform.exitApp();
          nav.setRoot(this.rootPage);

        }
      });

    });


  }


  deepLinkData(flag, startApp) {

    console.log("startApp: " + startApp);
    var data = {};


    if (startApp == true) {

      this.deeplinks.routeWithNavController(this.nav, {
      }).subscribe((match) => {

        /** Close All Model Popup, alerts and overlay **/
        let activePortal = this.ionicApp._loadingPortal.getActive();
        if (activePortal) {
          console.log('_loadingPortal');
          activePortal.dismiss();
        }
        activePortal = this.ionicApp._modalPortal.getActive();
        if (activePortal) {
          console.log('_modalPortal');
          activePortal.dismiss();
        }
        activePortal = this.ionicApp._overlayPortal.getActive();
        if (activePortal) {
          console.log('_overlayPortal');
          activePortal.dismiss();
        }
        if (this.menuCtrl.isOpen()) {
          console.log('menuCtrl isOpen');
          this.menuCtrl.close();
          //return;
        }

        flag = false;
        var data = {};
        var search_query = {};
        console.log(match);
        console.log(match.$link);
        if (match && match.$link && match.$link.queryString && match.$link.queryString != 'undefined' && typeof match.$link.queryString != 'undefined') {
          search_query = queryStringToJSON(match.$link.queryString);
        }
        console.log("search_query");
        console.log(search_query);
        data['notification'] = {};
        data['notification']['payload'] = {};
        data['notification']['payload']['additionalData'] = search_query;
        this.pushNotificationData = data;
        this.onNotification['pushnotification'] = data['notification']['payload']['additionalData']['pushnotification'];
        console.log(this.onNotification);
        console.log("login status :" + this.AppService.isLoggedIn());
        this.gtm.gaSourceMedium(search_query);
        if (this.AppService.isLoggedIn()) {
          console.log("testststst");
          this.pushNotificationAction(data['notification']['payload']['additionalData']['pushnotification']);
        } else {

          if (!this.AppService.isLoggedIn() && search_query['pushnotification'] != 'homepage' && search_query['pushnotification'] != 'pdp' && search_query['pushnotification'] != 'sp_pages' && search_query['pushnotification'] != 'listing') {
            console.log("LandingPage root");
            console.log("deeplinking else case n non-login");
            console.log(this.onNotification);
            console.log(this.notificationFlag);
            this.nav.setRoot(LandingPage, { data: this.onNotification, notificationFlag: this.notificationFlag, isDeepLink: true });
          } else {
            console.log("loginrequire pass case at homepage and listing and pdp and microsite");
            this.pushNotificationAction(data['notification']['payload']['additionalData']['pushnotification']);
          }
        }

        function queryStringToJSON(queryString) {
          if (queryString.indexOf('?') > -1) {
            queryString = queryString.split('?')[1];
          }
          var pairs = queryString.split('&');
          var result = {};
          pairs.forEach(function (pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
          });
          return result;
        }

      }, (nomatch) => {

        console.log("nomatch");

      }, );
    }


    // let vm = this;
    // <any>window.addEventListener("deeplink", function (match) {
    //   console.log("dsfkslflkdsklfkdsl1");
    //   var search_query = {};
    //   if (match['deeplink']) {
    //     search_query = match['deeplink'];
    //     search_query = queryStringToJSON(search_query);
    //     console.log("Query lenth is ");
    //     var count = Object.keys(search_query).length;
    //     console.log('Lenght of query is');
    //     console.log(search_query);
    //     data['notification'] = {};
    //     data['notification']['payload'] = {};
    //     data['notification']['payload']['additionalData'] = search_query;
    //     vm.pushNotificationData = data;
    //     console.log("this.pushNotificationData");
    //     console.log(data);
    //     vm.onNotification['pushnotification'] = data['notification']['payload']['additionalData']['pushnotification'];
    //     console.log(vm.onNotification);
    //     console.log("login status :" + vm.AppService.isLoggedIn());
    //     vm.gtm.gaSourceMedium(search_query);
    //     if (vm.AppService.isLoggedIn()) {
    //       console.log("testststst");
    //       vm.pushNotificationAction(data['notification']['payload']['additionalData']['pushnotification']);
    //     } else {
    //       if (!vm.AppService.isLoggedIn() && search_query['pushnotification'] != 'homepage' && search_query['pushnotification'] != 'pdp' && search_query['pushnotification'] != 'sp_pages' && search_query['pushnotification'] != 'listing') {
    //         console.log("LandingPage root");
    //         vm.nav.setRoot(LandingPage, { data: vm.onNotification, notificationFlag: vm.notificationFlag });
    //         // this.loadingCtrl.dismissLoadingCustom();
    //       } else {
    //         console.log("loginrequire pass case at homepage and listing and pdp and microsite");
    //         vm.pushNotificationAction(data['notification']['payload']['additionalData']['pushnotification']);
    //       }
    //     }

    //   }

    //   function queryStringToJSON(queryString) {
    //     if (queryString.indexOf('?') > -1) {
    //       queryString = queryString.split('?')[1];
    //     }
    //     var pairs = queryString.split('&');
    //     var result = {};
    //     pairs.forEach(function (pair) {
    //       pair = pair.split('=');
    //       result[pair[0]] = decodeURIComponent(pair[1] || '');
    //     });
    //     return result;
    //   }

    //   //add routing mech to route to proper location based on key-value pairs received
    // }, false);

    console.log("test deeplink")
  }


  async initEvents() {
    this.nativeStorage.setnativeStorage('notificationStatus', true);
    if (this.platform.is('cordova')) {

    }


    /*
     let vm = this;

     document.addEventListener("resume", () => {
       console.log("resume");
       setTimeout(function () {
         if (vm.nav.getActive().name == 'HomePage') {
           vm.events.publish('refreshHome');
         }
       }, 0);
     }, false) */
  }

  pushNotificationAction(key) {
    let data = this.pushNotificationData.notification.payload.additionalData;
    console.log("Notification data tttttt" + data);
    console.log(data);

    if (key == 'referandearn') {
      this.nav.setRoot(HomePage, { deeplink: "referandearn" });
      //this.nav.push(InviteEarnPage);
    } else if (key == 'mycoupons') {
      this.nav.setRoot(HomePage, { deeplink: "mycoupons" });
      //this.nav.push(MyCouponsPage);
    } else if (key == 'myorders') {
      this.nav.setRoot(HomePage, { deeplink: "MyOrdersPage" });
      //this.nav.push(MyOrdersPage);
    } else if (key == 'mycredits') {
      this.nav.setRoot(HomePage, { deeplink: "JpCreditsPage" });
      //this.nav.push(JpCreditsPage);
    } else if (key == 'mygiftcart') {
      this.nav.setRoot(HomePage, { deeplink: "GiftCardsPage" });
      //this.nav.push(GiftCardsPage);
    } else if (key == 'myaccount') {
      this.nav.setRoot(HomePage, { deeplink: "MyAccountPage" });
      //this.nav.push(MyAccountPage);
    } else if (key == 'homepage') {
      //this.nav.setRoot(HomePage, { deeplink: "HomePage" });
      this.nav.setRoot(HomePage);
    } else if (key == 'cart') {
      this.nav.setRoot(HomePage, { deeplink: "CartPage" });
      //this.nav.push(CartPage);
    } else if (key == 'pdp') {

      let name = data.name;
      let brand_name = data.brand_name;
      let pid = data.pid;
      let thimge = data.thimge;
      let zimage = data.zimage;
      //this.nav.push(PdpPage, { name: name, brand_name: brand_name, pid: pid, thimge: thimge, zimage: zimage });
      this.nav.setRoot(HomePage, { deeplink: "PdpPage", pid: pid });

    } else if (key == 'searchpage') {
      let search_query = data.search_query;
      //console.log("search_query" + search_query);
      //this.nav.push(SearchPage, { search_query: search_query });
      this.nav.setRoot(HomePage, { deeplink: "SearchPage", search_query: search_query });
    } else if (key == 'listing') {
      let search_key = data.search_key;
      let search_id = data.search_id;
      //this.nav.push(ListingPage, { search_key: search_key, search_id: search_id });
      this.nav.setRoot(HomePage, { deeplink: "ListingPage", search_key: search_key, search_id: search_id });
    } else if (key == 'sp_pages') {
      let pid = data.pid;
      //this.nav.push(MicrositePage, { pid: pid });
      this.nav.setRoot(HomePage, { deeplink: "MicrositePage", pid: pid });
    }
  }

  initializeApp() {

    console.log("initializeApp");


    this.nativeStorage.setnativeStorage('menudataStatus', 0);
    this.nativeStorage.setnativeStorage('sidenav', 0);

    // this.nativeStorage.setnativeStorage('homedataStatus', 0);
    this.events.subscribe('getmenudata', () => {
      this.getMenu();
    });
    this.events.subscribe('sidenav', () => {
      this.getSideNav();
    });

    if (this.AppService.isLoggedIn()) {

      this.rootPage = HomePage; //logged in
      this.userLoggedIn();
    } else {
      console.log("deeplink on landing page :");
      console.log(this.onNotification);
      let introDone = this.nativeStorage.getnativeStorage('intro-done');
      if (!introDone) {
        this.nativeStorage.setnativeStorage('intro-done', true);
        this.rootPage = WalkthroughPage;
      } else {
        console.log("notification on landing page");
        console.log(this.pushNotificationData);
        console.log("notification on landing page1");
        console.log(this.onNotification);
        // this.rootPage = LandingPage;
        console.log("landing test page");
        this.nav.setRoot(LandingPage, { data: this.onNotification, notificationFlag: this.notificationFlag });

      }
    }

    this.deepLinkData(true, true);

    let view;
    //let vm = this;
    /*
        this.nav.viewDidEnter.subscribe((page) => {
          view = page.instance.constructor.name;

          //..................chk compoenet............//
          let recentProducttime = this.nativeStorage.getnativeStorage('compinfoTime');
          if (recentProducttime) {

            let tt = moment().unix();
            this.curtime = tt - recentProducttime.timeinfo;


            if (this.curtime > '1800') {

              this.getHomeData();
              this.nativeStorage.setnativeStorage('compinfoTime', { timeinfo: moment().unix() });
            }

          }
          //......................end.............................//

        });
        */


    // this.platform.registerBackButtonAction(() => {

    //   if (view == "HomePage") {
    //     this.appMinimize.minimize();
    //   } else if (view != "PaymentStatusPage") {
    //     this.nav.pop();
    //   }

    // });

    this.events.subscribe('updateUserData', () => {
      this.userLoggedIn();
    });

    let uuid = this.nativeStorage.getnativeStorage('uuid');

    if (!uuid) {
      this.AppService.saveUuid();
    }

    this.getMenu();
    this.getSideNav();
  }

  /*
  getHomeData() {
    //........................compnent ifno ................//
    this.AppService.getCoponentsinfo('home').subscribe((res) => {

        console.log('home data  ++++  ');
        console.log(res.data);
        console.log(this.previous_home_data);

        if(JSON.stringify(this.previous_home_data)!=JSON.stringify(res.data) && JSON.stringify(this.previous_home_data) !='"dummydata"' ){
        console.log('components are changed from back groung');
        this.nativeStorage.setnativeStorage('componentstatus',1);
        }
        this.previous_home_data =res.data;


      if (res.data && res.data.length != 0) {
        this.nativeStorage.setnativeStorage('homedataStatus', 1);
        this.compchk = res.data;

        this.nativeStorage.setnativeStorage('compinfo', { pid: this.compchk });
        this.nativeStorage.setnativeStorage('compinfoTime', { timeinfo: moment().unix() });

      }
    }, error => {

    });
    //................................end.......................//
  }
  */

  userLoggedIn() {

    this.user = this.nativeStorage.getnativeStorage('user');

    if (this.user) {
      if (this.user.first_name == null) {
        this.user.first_name = 'User'
      }


      this.loginchkval = 1;
    }
    else {
      this.loginchkval = 0;

    }

  }

  getMenu() {
    if (this.utilities.isOnline()) {
      this.AppService.getMenuData().map((res: Response) => res.json())
        .subscribe(
          (res) => {
            if (res) {
              this.nativeStorage.setnativeStorage('MenuData', res);
              this.nativeStorage.setnativeStorage('menudataStatus', 1);
            }
            this.getMenuFunc(res);

            //  this.lastindex = 30;
          }, error => {
            this.toasterCtrl.presentToast(error.message, 'bottom', '3000', false);
          });

      this.AppService.getHomeImage().map((res: Response) => res.json())
        .subscribe(
          (res) => {

            this.homeimageurl = res.data;

          }, error => {

          });
    } else {
      if (this.nativeStorage.getnativeStorage('MenuData') != null) {

        let data = this.nativeStorage.getnativeStorage('MenuData');
        //console.log(data);
        this.getMenuFunc(data);
        this.toasterCtrl.presentToast('please check your internet connection.', 'bottom', '3000', false);
      }

    }
  }

  getMenuFunc(res) {
    var local_pages_cat = [];
    var local_pages_brand = [];
    var local_pages_sub_cat = [];
    this.pageCatogerys = res.data.categories;
    for (var i in res.data.categories) {
      local_pages_cat.push({ title: res.data.categories[i].name });
    }
    this.pages_catg = local_pages_cat;
    for (var j in res.data.brands) {
      local_pages_brand.push({ title: res.data.brands[j].name, id: res.data.brands[j].value });
    }
    this.pages_brand = local_pages_brand;
    for (var child in res.data.categories) {
      local_pages_sub_cat.push(res.data.categories[child]);
    }
    this.local_pages_sub_catg = local_pages_sub_cat;

    this.maxbrandlength = Object.keys(res.data.brands).length;


    for (let i = 0; i < this.maxbrandlength; i++) {
      this.initialBrands.push(this.pages_brand[i]);
    }
  }


  getSideNav() {
    if (this.utilities.isOnline()) {
      this.AppService.getSideNav().map((res: Response) => res.json()).subscribe(
        (res) => {
          if (res) {
            //console.log(JSON.stringify(res));
            this.nativeStorage.setnativeStorage('sidenav', 1);
            this.nativeStorage.setnativeStorage('SideNavMenu', res);
          }
          //console.log('side Nav');
          //console.log(res);
          this.Blocks = res.data.blocks
          this.pages = res.data.sidenav;
          this.info = res.data.footer;
        },
        error => {

        });
    } else {
      if (this.nativeStorage.getnativeStorage('SideNavMenu') != null) {
        //console.log(this.nativeStorage.getnativeStorage('SideNavMenu'));
        let sideMenu = this.nativeStorage.getnativeStorage('SideNavMenu');
        this.Blocks = sideMenu.data.blocks
        this.pages = sideMenu.data.sidenav;
        this.info = sideMenu.data.footer;
      }
    }
  }

  goToSecondLevel(p) {

    this.levelTitle = p.title;
    if (p.title == 'Home') {
      //this.gtm.gtminfo('page-Side nav', '/Side nav', 'All Categories', 'All Categories');
      this.level = 1;
      this.menuCtrl.close();
      this.nav.setRoot(HomePage);
      //this.pages_cat = this.pages_catg;
    }
    else if (p.title == 'All Categories') {
      this.gtm.gtminfo('page-Side nav', '/Side nav', 'All Categories', 'All Categories');
      this.level = 2;
      this.pages_cat = this.pages_catg;
    }
    else if (p.title == 'Brands') {
      this.gtm.gtminfo('page-Side nav', '/Side nav', 'Brands', 'All Categories');
      this.level = 4;

      this.pages_brands = this.initialBrands;
      this.pages_sub = [{}];
      this.content.scrollToTop();
      // this.menu_close="menuClose";
    } else if (p.title == 'Login') {
      this.gtm.gtminfo('page-landing', '/landing', 'Side Nav login', 'Side Nav login');
      this.menuCtrl.close();
      this.nav.push(p.component);
    }
    else if (p.title == 'Refer & Earn') {
      this.gtm.gtminfo('page-Refer & Earn', '/refetearn', 'Side Nav login', 'Side Nav login');
      this.menuCtrl.close();
      if (this.loginchkval == 0) {
        this.nav.setRoot(LandingPage, { pageinfo: "InviteEarnPage" });
      } else {
        this.nav.push(InviteEarnPage);
      }

      //  this.nav.push(p.component);
    }
    else if (p.title == 'Gift Cards') {
      this.gtm.gtminfo('page-Gift Cards', '/giftcard', 'Side Nav login', 'Side Nav login');
      this.menuCtrl.close();
      if (this.loginchkval == 0) {
        this.nav.setRoot(LandingPage, { pageinfo: "GiftCardPage" });
      } else {
        this.nav.push(GiftCardsPage);
      }
    }
    // else if (p.title == 'Trending') {
    //   this.menuCtrl.close();
    //   // this.nav.push(p.component);
    //   this.nav.push(MicrositePage, { pid: 'trending' });
    // }
    // else if (p.title == 'SALE!') {
    //   this.menuCtrl.close();
    //   // this.nav.push(p.component);
    //   this.nav.push(MicrositePage, { pid: 'sale' });
    // }
    else if (p.type == 'Spl_page') {
      this.menuCtrl.close();
      // this.nav.push(p.component);
      this.nav.push(MicrositePage, { pid: p.cms_id });
    }
    else if (p.type == 'myfilter') {
      this.menuCtrl.close();
      // this.nav.push(p.component);
      this.nav.push(MicrositePage, { pid: p.cms_id });
    }
    else if (p.title == 'My Account' || p.title == 'Login / Signup') {
      this.menuCtrl.close();
      if (this.loginchkval == 0) {
        this.nav.setRoot(LandingPage, { pageinfo: "MyAccountPage" });
      } else {
        this.nav.push(MyAccountPage);
      }
    }
    // else if (p.title == 'Login / Signup') {
    //   this.menuCtrl.close();
    //   // this.nav.push(p.component);
    //   this.nav.push(LandingPage);
    // }

    else {
      this.pages_cat = [{}];
    }
  }

  goToFirstLevel(page) {
    if (!this.utilities.isOnline()) {
      this.toasterCtrl.presentToast('please check your internet connection.', 'bottom', '3000', false);
    } else {
      this.level = 1;
    }
  }


  goToSecond() {
    if (!this.utilities.isOnline()) {
      this.toasterCtrl.presentToast('please check your internet connection.', 'bottom', '3000', false);
    } else {
      if (this.backflag == 0)
        this.level = 2;
      else
        this.level = 1;
    }
  }
  gotocomponent(page, cms_id) {
    this.level = 1;
    this.menuCtrl.close();

    this.nav.push(MicrositePage, { pid: cms_id });
  }

  goToThirdLevel(page, flag = 1) {

    var localpage = [];
    this.level = 3;
    if (flag == 0) {
      this.backflag = 1;
    } else {
      this.backflag = 0;
    }

    this.thirdLevelTitle = page.title;
    if (page.title == undefined) {
      localpage = [{ "title": page }];
      this.thirdLevelTitle = localpage[0].title;
    }
    for (var value in this.local_pages_sub_catg) {
      if (this.local_pages_sub_catg[value].name == this.thirdLevelTitle) {
        for (var a in this.local_pages_sub_catg[value]) {
          this.pages_sub = this.local_pages_sub_catg[value][a]

        }
      }
    }


  }



  goToOpenPage(page, name) {
    console.log("page " + page, "name=" + name);
    if (!this.utilities.isOnline()) {
      this.toasterCtrl.presentToast('please check your internet connection.', 'bottom', '3000', false);
    } else {
      this.menuCtrl.close();

      if (this.level == 4) {
        this.nav.push(ListingPage, {
          search_key: 'brand_id', search_id: page.id, source: 'navMenu', cName: name
        });
        this.level = 1;
      } else {
        this.nav.push(ListingPage, {
          search_key: 'category_id', search_id: page.id, source: 'navMenu', cName: name
        });
        this.level = 1;
      }
    }
  }


  Landingpage() {
    this.gtm.gtminfo('page-landing', '/landing', 'Side Nav login', 'Side Nav login');
    this.nav.setRoot(LandingPage);
  }

  goToHome() {
    this.menuCtrl.close();
    this.nav.setRoot(HomePage);
  }
  gotoMyaccount() {
    this.menuCtrl.close();
    this.nav.push(MyAccountPage);
  }
  gotoTermsPage() {
    this.menuCtrl.close();
    this.nav.push(TermsPage);
  }
  gotoContactUs() {
    this.menuCtrl.close();
    this.nav.push(ContactUsPage);
  }
  gotoinfo(item) {
    this.menuCtrl.close();
    if (item.type == 'contactus')
      this.nav.push(ContactUsPage);
    else if (item.type == 'tc') {
      this.nav.push(TermsPage);
    }else{
      this.nav.push(PrivacyPage);
    }

  }
}
