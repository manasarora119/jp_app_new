import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ModalController, AlertController, Events, Platform, ViewController, Navbar, App, Nav, MenuController } from 'ionic-angular';
import { SizeModalPage, ImageZoomPage, SizeViewPage, ListingPage, LandingPage, CartPage, SearchPage, HomePage, WishlistPage,QrModalPage } from '../pages';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Vibration } from '@ionic-native/vibration';
import {
  TosterserviceProvider,
  ModelinfoProvider,
  LoadingserviceProvider,
  AppServiceProvider,
  UtilitiesProvider,
  LocalStorageProvider,
  GtmProvider,
  BetaoutProvider,
  GlobalFunctionProvider,
  ConstantsProvider
} from '../../providers/providers';
declare var cordova;

@IonicPage()
@Component({
  selector: 'page-pdp',
  templateUrl: 'pdp.html',
})
export class PdpPage {
  cartitem: any;
  userData: any;
  shareSatus: number = 1;
  sizeFlag: number = 0;
  public URL:string='';
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(Content) content: Content;
  @ViewChild('pdpContent') pdpContent: ElementRef;
  public isLoggedIn: any
  public viewSimlarEl: any;
  public productData: any;
  public isfull = true;
  public MainImage: any;
  public loginModal: any;
  public scrollAmount = 0;
  public psize: any;
  public user: any;
  public pidsize: any;
  public allSizes: any;
  public noSize: any;
  public qty: Number = 1;
  public allQty: any[] = [];
  //public selectedQty:Number = 1;
  public bagcount: Number = 0;
  public productAddedMsg: any;
  public isSelected: Number = -1;
  public dispachedate: any;
  public fixCart: boolean = false;
  public productSize: boolean = false;
  public selectSizeFirst: boolean = false;
  public profileModal: any;
  public imageZoomModal: any;
  public imageSizeModal: any;
  public searchModal: any;
  public productId: any;
  public viewSimlar: any;
  public event_id: any;
  public itemspartners: any;
  public itemspartnersSimilar: any;
  public itemspartnersPopular: any;
  public itemspartnersEvent: any;
  public itemspartnersTag: any;
  public itemspartnersNew: any;
  public itemspartnersShopall: any
  public itemForCompleteThelook: any;
  public itemsToBag: any;
  public loginchkval: number = 0;
  public modelpopinfo: any;
  public slideimg: any;
  public pname: any;
  public pBrand: any;
  public fPrice: any;
  public nPrice: any;
  public sPrice: any;
  public qtychk: any = 0;
  public soldoutchk: any;
  public parrentId: any;
  public measurements: any;
  public Tagkeywordchk: Number = 0;
  public NewImagechk: Number = 0;
  public PopularImagechk: Number = 0;
  public ShopAllImagechk: Number = 0;
  public EventImagechk: Number = 0;
  public SimilarImagechk: Number = 0;
  public CompleteThelookchk: Number = 0;
  public listingId: any;
  public addingToWishList: any;

  public loginView = { showBackdrop: true, enableBackdropDismiss: true, cssClass: "login-view" }
  public sizeOptions = {
    showBackdrop: true, enableBackdropDismiss: true, cssClass: "size-modal"
  };
  public zoomOptions = { showBackdrop: true, enableBackdropDismiss: true, cssClass: "zoom-modal" };
  public sizeView = { showBackdrop: true, enableBackdropDismiss: true, cssClass: "size-view" }
  public searchView = { showBackdrop: true, enableBackdropDismiss: true, cssClass: "search-view" }
  public isIos: any;
  public gtmheader: any;
  public gtmheaderContent: any;
  public source: any;
  public frompdp: any;
  public fave_flag: any;
  public pdpSpinner: any = false;
  public pdpInfo: any;
  public checkEvent: any;
  public crossSellImgChk: Number = 2;
  public crossSellImages:any;
  public imageBaseUrl = 'https://static.jaypore.com/tr:w-313,h-415/media/catalog/product';
  public sharemsg:any;
  constructor(
    public betaout: BetaoutProvider,
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public toasterCtrl: TosterserviceProvider,
    public menuCtrl: MenuController,
    public Modelinfo: ModelinfoProvider,                                                        
    public loadingCtrl: LoadingserviceProvider,
    private socialSharing: SocialSharing,
    public alertCtrl: AlertController,
    private AppService: AppServiceProvider,
    public utilities: UtilitiesProvider,
    private nativeStorage: LocalStorageProvider,
    public events: Events,
    private gtm: GtmProvider,
    public viewCtrl: ViewController,
    private vibration: Vibration,
    public app: App,
    public globalFuntion: GlobalFunctionProvider,
    public constants:ConstantsProvider
  ) {

    this.nativeStorage.deleteItems('notificationStatus');
    this.gtm.gtminfo('page-pdp', '/pdp', 'pdpView', 'pdpView');

    this.gtmheader = this.navParams.get('gtmheader');
    this.gtmheaderContent = this.navParams.get('gtmheadercontent');
    this.source = this.navParams.get('source') ? this.navParams.get('source') : "external";
    if (this.gtmheader) {
      this.gtm.gtminfo('page-pdp', '/pdp', this.gtmheader, this.gtmheaderContent);
    }

    this.frompdp = this.navParams.get('frompdp');

    if (this.platform.is('ios')) {
      this.isIos = true;
    }


    this.productId = this.navParams.get('pid');
    this.parrentId = this.navParams.get('pid');
    this.events.subscribe('productRemovedFromWishlist', (productId) => {
      if (productId == this.productId) {
        this.fave_flag = false;
      }
    });

    this.events.subscribe('productadded', (productId) => {
      if (productId == this.productId) {
        this.fave_flag = true;
      }
    });



    //Testing
    if (this.productId == null || this.productId == '') {
      //this.productId = 167688;
      //this.productId = 167989;
      this.productId = 150103;
    }
    this.event_id = 0;
    this.MainImage = [];
    this.MainImage.push({
      thumbnail: this.navParams.get('thimge'),
      zoom: this.navParams.get('zimage'),
    });
    this.pname = this.navParams.get('name');
    this.pBrand = this.navParams.get('brand_name');
    this.fPrice = this.navParams.get('fPrice');
    this.nPrice = this.navParams.get('nPrice');
    this.sPrice = this.navParams.get('sPrice');
    this.listingId = this.navParams.get('listingId');


    this.cartitem = this.navParams.get('cartitem');

    if (this.fPrice == this.nPrice) {
      this.sPrice = 0;
      this.nPrice = 0;
    } else {
      this.sPrice = this.navParams.get('sPrice');;
    }
    //console.log('pdp Navparams',this.navParams);
    //console.log(this.fPrice, this.nPrice, this.sPrice);
    this.getPdpInfo();

    this.isLoggedIn = this.AppService.isLoggedIn();
    /*if (this.isLoggedIn) {
      this.getCartCount();
    }*/
    this.events.subscribe('CartUpdated', (count) => {
      if (count) {
        this.bagcount = count;
      } else {
        this.setCartCount();
      }
    });

  }

  /*   presentImage(myImage) {
      const imageViewer = this._imageViewerCtrl.create(myImage);
      imageViewer.present();

      // setTimeout(() => imageViewer.dismiss(), 1000);
      // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
    } */


  getCartCount() {
    if (this.utilities.isOnline()) {
      this.AppService.getCartCount().subscribe((res) => {
        if (res && !res.error && res.data && res.data) {
          this.bagcount = res.data.productsCount;
          this.nativeStorage.setnativeStorage('cartCount', res.data.productsCount);
        }
      });
    }
  }

  setCartCount() {
    this.bagcount = this.nativeStorage.getnativeStorage('cartCount');
  }

  public productInfoObj: any = '';
  getPdpInfo() {
    if (this.utilities.isOnline()) {
      // this.loadingCtrl.presentLoadingCustom();
      this.AppService.pdpinfo(this.productId).subscribe((res) => {
        if (res.data) {
          let betaoutData = {};
          betaoutData = res.data;
          betaoutData['source'] = this.source;
          this.productInfoObj = res.data;
          this.betaout.viewProduct(betaoutData);
          this.fave_flag = res.data.fave_flag;
          this.itemspartners = res.data;
          this.soldoutchk = res.data.quantity;
          this.pname = res.data.name;
          this.pBrand = res.data.brand_name;
          this.fPrice = res.data.final_price;
          this.nPrice = res.data.normal_price;
          this.checkEvent = res.data.event_id > 0 ? true : false;
          // this.sPrice = res.data.special_price;

          if (res.data.final_price == res.data.normal_price) {
            this.sPrice = 0;
            this.nPrice = 0;
          } else {
            this.sPrice = (((res.data.normal_price - res.data.special_price) / res.data.normal_price) * 100);
            this.sPrice = Math.floor(this.sPrice);
          }

          if (this.itemspartners.measurements == 'Refer to the description.' || this.itemspartners.measurements == 'Refer to the description') {
            this.itemspartners.measurements = 'Refer to the chart.'
          }
          //this.selectedQty = this.qty;
          this.allSizes = res.data.sizeChart;
          this.event_id = this.itemspartners.event_id;
          this.MainImage[0].thumbnail = this.itemspartners.gallery.thumbnail;
          this.MainImage[0].zoom = this.itemspartners.gallery.zoom;
          //..............main image................//
          if (this.itemspartners.gallery.more.length != 0) {
            for (let m in this.itemspartners.gallery.more) {
              this.MainImage.push({
                thumbnail: this.itemspartners.gallery.more[m].thumbnail,
                zoom: this.itemspartners.gallery.more[m].zoom
              });
            }
          }

          //....................end......................//
          this.noSize = false;
          this.psize = false;
          this.viewSimlar = 0;
          if (this.itemspartners.weight_unit == 'GRAMS') {
            this.itemspartners.weight_unit = 'gms'
            if (this.itemspartners.weight == '0') {
              this.itemspartners.weight = 'NA';
            }
          }
          if (this.itemspartners.final_price == this.itemspartners.normal_price) {
            this.itemspartners.special_price = 0;
            this.itemspartners.normal_price = 0;
          } else {
            this.itemspartners.special_price = (((this.itemspartners.normal_price - this.itemspartners.special_price) / this.itemspartners.normal_price) * 100);
            this.itemspartners.special_price = Math.round(this.itemspartners.special_price);
          }
          // if (this.itemspartners.size_chart == null || this.itemspartners.size_chart != undefined) {
          //   this.sizeFlag = 0;
          // }
          // else {
          //   this.sizeFlag = 1;
          // }
          //   this.dispachedate = moment().add(this.itemspartners.dispatchday, 'days').format("Do MMM YYYY");
          this.dispachedate = this.itemspartners.dispatchdate;
          if (this.itemspartners.child_products.length == 0) {

            this.allQty = [];
            for (var i = 1; i <= res.data.quantity; i++) {
              this.allQty.push(i);
            }
            if (res.data.quantity) {
              this.qtychk = 1;
            }
            this.noSize = [];
            this.psize = [];

          } else {
            this.psize = [];
            this.pidsize = [];
            this.noSize = []
            for (let x in this.itemspartners.child_products.collection) {
              if (this.itemspartners.child_products.collection[x].quantity > 0) {
                this.psize.push(this.itemspartners.child_products.collection[x].label);
                this.pidsize.push({
                  pid: this.itemspartners.child_products.collection[x].id,
                  size: this.itemspartners.child_products.collection[x].label,
                  quantity: this.itemspartners.child_products.collection[x].quantity
                });
              } else {
                this.noSize.push(this.itemspartners.child_products.collection[x].label);
              }
            }
            this.sizeFlag = 1;

          }
          if (this.psize.length == 0) {
            this.psize = 0;
          }

          //this.loadingCtrl.dismissLoadingCustom();
          this.pdpSpinner = true;

          if (this.isLoggedIn) {
            this.getCartCount();
          }

          this.getEventProduct();
          this.getSimilarProduct();
          // this.getTagKeyProduct();
          /* Comment added by Mahesh for performance issue -- Don't Remove the code */
          //this.getPopularProduct();
          /* Comment added by Mahesh for performance issue -- Don't Remove the code */
          this.getNewProduct();
          this.getShopAllEvents();
          this.crossSellingProduct(this.productId);
          // this.getThelook();

        } else {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
        }
      }, error => {
        this.loadingCtrl.dismissLoadingCustom();
        this.toasterCtrl.presentToast(error, 'bottom', '3000', false);
      });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastMsg().noInternet, 'bottom', '3000', false);
    }
  }

  getEventProduct() {
    //......................Event product ................//
    this.AppService.eventProduct(this.event_id).subscribe((res) => {
      if (res.data.result && res.data.result.length != 0) {
        this.itemspartnersEvent = res.data;


        for (var x in this.itemspartnersEvent.result) {
          if (this.itemspartnersEvent.result[x].id == this.productId) {
            this.itemspartnersEvent.result.splice(x, 1);
            break;
          }
        }




        if (this.itemspartnersEvent.event_banner.length == 0) {
          this.itemspartnersEvent.event_banner = 0;
        }
        this.EventImagechk = 1;
      } else {
        this.EventImagechk = 2;
      }
    }, error => {
      this.EventImagechk = 2;
    });
    //..............................end............................//

  }

  getSimilarProduct() {
    //......................similar product ................//
    this.AppService.similarProduct(this.productId).subscribe((res) => {
      if (res && res.length != 0) {
        this.itemspartnersSimilar = res;
        for (let s in this.itemspartnersSimilar) {
          if (this.itemspartnersSimilar[s].final_price == this.itemspartnersSimilar[s].normal_price) {
            this.itemspartnersSimilar[s].special_price = 0;
            this.itemspartnersSimilar[s].normal_price = 0;
          } else {
            this.itemspartnersSimilar[s].special_price = (((this.itemspartnersSimilar[s].normal_price - this.itemspartnersSimilar[s].special_price) / this.itemspartnersSimilar[s].normal_price) * 100);
            this.itemspartnersSimilar[s].special_price = Math.round(this.itemspartnersSimilar[s].special_price);
          }
        }
        this.SimilarImagechk = 1;
        if (this.noSize.length > 0) {
          this.viewSimlar = 1;
        }
      } else {
        this.SimilarImagechk = 2;
      }
    }, error => {
      this.SimilarImagechk = 2;
    });



    //............................end............................//

  }



  getTagKeyProduct() {
    //......................tagkeyword product ................//
    this.AppService.tagKeyProduct(this.productId).subscribe((res) => {

      if (res && !res.error) {
        if (res.data && res.data.length != 0) {
          this.itemspartnersTag = res.data;
          this.Tagkeywordchk = 1;
        }
      } else {
        this.Tagkeywordchk = 2;
      }
      console.log('tagKeyProduct .....', this.Tagkeywordchk)
    }, error => {
      this.Tagkeywordchk = 2;
    });

    //.......................end...............//
  }

  getPopularProduct() {
    //......................popular product ................//
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
    //.......................end....................//
  }

  crossSellingProduct(productId) {

    //......................cross selling ................//
    this.AppService.crossSelling({product_id:202504}).subscribe((res) => {
     
      if (res && res.message != 'Record not found' && res.data && res.data.length > 0) {
        this.crossSellImages = res.data;
        this.crossSellImgChk = 1; 
      } else {
        this.crossSellImgChk = 2;
      }

    }, error => {
      this.crossSellImgChk = 2;
    });

    //..........................end..................//
  }  

  getNewProduct() {
    //......................new product ................//
    this.AppService.newProduct().subscribe((res) => {

      if (res && res.message != 'Record not found') {
        this.itemspartnersNew = res;
        this.NewImagechk = 1;
      } else {
        this.NewImagechk = 2;
      }

    }, error => {
      this.NewImagechk = 2;
    });

    //..........................end..................//
  }

  getShopAllEvents() {
    //......................new product ................//
    this.AppService.getShopAllEvent().subscribe((res) => {
      if (res && res.data.length != 0) {
        this.itemspartnersShopall = res.data;

        this.ShopAllImagechk = 1;
      } else {
        this.ShopAllImagechk = 2;
      }

    }, error => {
      this.ShopAllImagechk = 2;
    });
    //........................end...................//

  }

  getThelook() {
    //......................CompleteThelook ................//
    this.AppService.getCompleteThelook(this.productId).subscribe((res) => {
      if (res && res.data) {
        this.itemForCompleteThelook = res.data;
        for (let s in this.itemForCompleteThelook) {
          for (let k in this.itemForCompleteThelook[s].products.result) {
            if (this.itemForCompleteThelook[s].products.result[k].final_price == this.itemForCompleteThelook[s].products.result[k].normal_price) {
              this.itemForCompleteThelook[s].products.result[k].special_price = 0;
              this.itemForCompleteThelook[s].products.result[k].normal_price = 0;
            } else {
              this.itemForCompleteThelook[s].products.result[k].special_price = (((this.itemForCompleteThelook[s].products.result[k].normal_price - this.itemForCompleteThelook[s].products.result[k].special_price) / this.itemForCompleteThelook[s].products.result[k].normal_price) * 100);
              this.itemForCompleteThelook[s].products.result[k].special_price = Math.round(this.itemForCompleteThelook[s].products.result[k].special_price);
            }
          }
        }
        this.CompleteThelookchk = 1;
      } else {
        this.CompleteThelookchk = 2;
      }
    }, error => {
      this.CompleteThelookchk = 2;
    });
    //..............................end............................//
  }

  sizeModal(productinfo, cartitem = '') {
    let addtocart = "Product_ID=" + this.productId + "&Product_name=" + this.pname + "&SKUID=" + this.itemspartners.sku + "&price=" + this.itemspartners.final_price + "&PreviousSize=" + this.isSelected;
    this.gtm.gtminfo('page-pdp', '/pdp', 'sizeModal', addtocart);
    this.profileModal = this.modalCtrl.create(SizeModalPage, { 'qty': this.qty, 'sizes': this.psize, 'noSize': this.noSize, 'productInfo': productinfo, cartitem: cartitem }, this.sizeOptions);
    let vm = this;
    let data = {
      'sizes': this.psize,
      'qty': this.qty,
      'noSize': this.noSize,
      'sizeChart': this.allSizes,
      'productInfo': productinfo,
      'cartitem': cartitem,
      'productInfoObj': this.productInfoObj
    };

    this.profileModal = this.modalCtrl.create(SizeModalPage, data, this.sizeOptions);
    this.profileModal.present();
    this.profileModal.onDidDismiss(data => {
      if (data && data.viewSimilar) {
        let el = document.getElementById('destinationVewsimilar');
        vm.goToDestination(el);
      } else if (data && data.loginfail) {
        this.navCtrl.setRoot(LandingPage, { pageinfo: "pdp", pid: data.prd_id, pqty: this.qty, parrentId: this.parrentId,'productInfoObj': data.productInfoObj });
      }
    });
  }

  zoomModal(zoomModalImgae, i) {
    this.imageZoomModal = this.modalCtrl.create(ImageZoomPage, { 'zoomUrl': zoomModalImgae, index: i }, this.zoomOptions);
    this.imageZoomModal.present();
  }

  sizeChart() {
    let addtocart = "Product_ID=" + this.productId + "&Product_name=" + this.pname + "&SKUID=" + this.itemspartners.sku + "&price=" + this.itemspartners.final_price + "&PreviousSize=" + this.isSelected;
    this.gtm.gtminfo('page-pdp', '/pdp', 'Size chart', addtocart);
    this.imageSizeModal = this.modalCtrl.create(SizeViewPage, { 'sizes': this.allSizes }, this.sizeView);
    this.imageSizeModal.present();
  }

  ionViewDidLoad() {

    // this.platform.registerBackButtonAction(() => {
    //   console.log('pdpd sse');
    //   if (this.navCtrl.getActive().name == 'HomePage') {
    //     this.platform.exitApp();
    //   }  else {
    //       this.navCtrl.pop();
    //     }
    // });


  }

  
  openQrModal() {
    let url = 'https://www.jaypore.com/';
    if (this.itemspartners.url)
    url = this.itemspartners.url
    if (this.itemspartners.name)
    var  msg = "Check out this beautiful product on Jaypore.\n" + this.itemspartners.name + ", Here's the link - \n";
    this.sharemsg=msg + ' ' +url ;
    //console.log(  this.sharemsg);
    let modal = this.modalCtrl.create(QrModalPage, {sharemsg :this.sharemsg});
    modal.present();
  }

  gotoCart() {
    let token = localStorage.getItem('token');
    if (token == '' || token == null) {
      this.loginchk('list', this.qty);
    } else {
      this.navCtrl.push(CartPage);
    }
  }

  getCrossSellingPrice(special_price, general_price) {
      return (special_price ? special_price : general_price);
  }


  selectSize(s) {
    this.isSelected = s;
    this.productSize = true;


    this.qty = 1;
    if (this.psize != 0) {
      this.allQty = [];
      for (let y in this.pidsize) {
        if (this.pidsize[y]['size'] == this.isSelected) {
          for (var i = 1; i <= this.pidsize[y]['quantity']; i++) {
            this.allQty.push(i);
          }
        }
        this.qtychk = 1;
      }
    }


    let addtocart = "Product_ID=" + this.productId + "&Product_name=" + this.pname + "&SKUID=" + this.itemspartners.sku + "&price=" + this.itemspartners.final_price + "&PreviousSize=" + this.isSelected;
    this.gtm.gtminfo('page-pdp', '/pdp', 'Modify Size', addtocart);
  }

  addInWishlist() {

    if(this.utilities.isOnline()){

      this.addingToWishList = true;
      let token = localStorage.getItem('token');
      if (token == '' || token == null) {
        this.addingToWishList = false;
        this.loginchk(this.parrentId, this.qty, 'wishlist');
      }
      else {
        this.AppService.manageWishlist(this.parrentId).subscribe(
          (res) => {
            this.addingToWishList = false;
            this.fave_flag = res.fav_flag;
            if (res.error === false) {
              this.toasterCtrl.presentToast(res.message, 'bottom', '1500', false);
              this.events.publish('productToWishlist', this.parrentId, this.listingId, this.fave_flag);
              this.events.publish('pdpToWishlist', this.parrentId, this.listingId, this.fave_flag);
            }
          },
          (err) => {
            this.addingToWishList = false;
            //this.loadingCtrl.dismissLoadingCustom();
            this.toasterCtrl.presentToast(err.message, 'bottom', '3000', false);
            console.log(err);
          });
      }

    }else{
      this.toasterCtrl.presentToast(this.constants.toastMsg().noInternet, 'bottom', '3000', false);
    }

  }

  addToBag() {
   if(this.utilities.isOnline()){
    if (this.isSelected == -1 && this.psize != 0) {

      let token = localStorage.getItem('token');
      if (this.psize.length > 0) {
        this.sizeModal(this.pidsize, this.cartitem);
        //this.toasterCtrl.presentToast('Please select size', 'bottom', '3000', false);
      } else if (token == '' || token == null) {
        this.loginchk(this.productId, this.qty);
      } else {
        //
      }
    } else {
      if (this.psize != 0) {
        for (let y in this.pidsize) {
          if (this.pidsize[y]['size'] == this.isSelected) {
            this.productId = this.pidsize[y]['pid'];
            this.productInfoObj['productIdAdded'] = this.productId;
          }
        }
      }
     
      let token = localStorage.getItem('token');

      if (token == '' || token == null) {
        this.loginchk(this.productId, this.qty);
      } else {
        this.loadingCtrl.presentLoadingCustom();
        if (this.cartitem) {
               this.removeItem(this.cartitem);
        }
        this.AppService.addToBag(this.productId, this.qty).subscribe((res) => {
          this.itemsToBag = res;
          if (this.itemsToBag.error) {
            this.modelpopinfo = this.Modelinfo.addToBag();
            if (this.itemsToBag.message == 'Record not found') {
              let checkProductInCart = this.globalFuntion.checkProductInCart(this.productId);
              if(checkProductInCart && checkProductInCart === true) {
                this.toasterCtrl.presentToast(this.constants.toastMsg().productAlreadyInCart, 'bottom', '3000', false);
              } else {
                this.toasterCtrl.presentToast(this.constants.toastMsg().productOutOffStock, 'bottom', '3000', false);
              }
              this.loadingCtrl.dismissLoadingCustom();
            } else {
              this.toasterCtrl.presentToast(this.constants.toastMsg().productNotAvailable, 'bottom', '3000', false);
              this.loadingCtrl.dismissLoadingCustom();
            }
            this.isSelected = -1;
          } else {
            this.productInfoObj['sel_qty'] = this.qty;
            this.betaout.productAddedInCart(this.productInfoObj);
            this.globalFuntion.saveProductToLocal(this.productId);
            this.nativeStorage.saveQuoteIdToLocal(res.data.quoteid);
            let addtocart = "Product_ID=" + this.productId + "Product_name=" + this.pname + "SKUID=" + this.itemspartners.sku + "price=" + this.itemspartners.final_price + "qty=1";
            this.gtm.gtminfo('page-pdp', '/pdp', 'Add To Cart', addtocart);

            this.productAddedMsg = this.itemsToBag.data.message;
            this.bagcount = this.itemsToBag.data.productsCount;
            this.toasterCtrl.presentToast(this.productAddedMsg, 'bottom', '3000', false);
            this.vibration.vibrate(300);
            this.nativeStorage.setnativeStorage('cartCount', this.itemsToBag.data.productsCount);
            this.events.publish('CartUpdated', this.itemsToBag.data.productsCount);
            this.loadingCtrl.dismissLoadingCustom();
            console.log("User Cart Data:");
            this.userTagNotification(this.itemsToBag.data.productsCount);
          }

        }, error => {
          this.loadingCtrl.dismissLoadingCustom();
        });
      }
    }
   }else{
    this.toasterCtrl.presentToast(this.constants.toastMsg().noInternet, 'bottom', '3000', false);
   } 
  }



  removeItem(item) {
    if (this.utilities.isOnline()) {
      let id = item.product_id;
      this.AppService.removeCartItem(id).subscribe(
        (res) => {
            this.globalFuntion.RemoveProductFromCart(id);
            this.betaout.productRemovedFromCart(item,res);
  
        },
        (err) => {
          console.log(err);
        });
    }
  }


  goToSimilar(el) {
    el.scrollIntoView();
  }

  goToDestination(el): void {
    if (el) {
      el.scrollIntoView(false);
    } else {
      let vm = this;
      let cl = document.getElementById('destinationVewsimilar');
      vm.goToDestination2(cl);
    }
  }

  goToDestination2(el): void {
    if (el) {
      el.scrollIntoView(false);
    }
  }


  goPdp(pid, name, zimage, thimge, brand_name = null, slideinfo = null, prices = '', normal_price = '', special_price = '', source = '') {
    console.log(source);
    //console.log("PDP Detail", "Price " + prices, "special_price ", special_price);
    let addtocart = "Product_ID=" + pid + "Product_name=" + name + "price=" + prices + "qty=1";
    this.navCtrl.push(PdpPage, {
      pid: pid, brand_name: brand_name,
      name: name,
      zimage: zimage,
      thimge: thimge,
      gtmheader: slideinfo,
      fPrice: prices,
      nPrice: normal_price,
      sPrice: special_price,
      gtmheadercontent: addtocart,
      source: source
    });
  }

  readmore() {
    this.isfull = !this.isfull;
  }

  golist(tag, keyinfo = null, keyname = null, name = '') {
    console.log(tag, keyinfo, keyname, name);
    if (keyinfo == 'event') {
      let addtocart = "Event Name=" + keyname + "&Event Id" + tag;

      this.navCtrl.push(ListingPage, { search_key: 'event_id', search_id: tag, gtmheader: 'Shop All Events', gtmheadercontent: addtocart, source: 'pdp', cName: name });
    } else {


      let addtocart = "Tag name=" + tag;
      this.navCtrl.push(ListingPage, { search_key: 'searching', search_query: tag, gtmheader: 'PDP Tag cloud', gtmheadercontent: addtocart, source: 'pdp' });
    }
  }

  shareInfo() {

    let subject = '';
    let msg = 'Product Info';
    this.shareSatus = 0;
    let vm = this;

    setTimeout(() => {
      this.shareSatus = 1;
    }, 500);

    if (this.itemspartners.name)
      msg = "Check out this beautiful product on Jaypore.\n" + this.itemspartners.name + ", Here's the link - \n";
    let addtocart = "Product Id=" + this.productId + "&Product Name" + this.pname + "&price=" + this.itemspartners.final_price;
    this.gtm.gtminfo('page-Pdp', '/pdp', 'PDP Share friend', addtocart);
    if (this.itemspartners.url) {
      let url = this.globalFuntion.sharePdpUrl(this.itemspartners.url, this.productId);
      this.tinyURL(url,msg,subject);
    }
  }

  tinyURL(url,msg,subject){
    let vm=this;
    return new Promise((resolve, reject) => {
      this.AppService.tinyURL(url).subscribe((res) => {
        console.log(res);
        vm.socialSharing.share(msg, subject, "",res.id).
        then(() => {
          // Success!
        }).catch(() => {
          // Error!
        });
        resolve(res.id);
     });
    });
  }

  loginchk(productId, productQty, type = null) {
    let alert = this.alertCtrl.create({
      title: 'Please login to continue',
      message: 'You need to login/register to use this feature of the application.',
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
            /*  this.loginModal = this.modalCtrl.create(LoginPage, {pageinfo: "pdp", pid: ''}, this.loginView);
             this.loginModal.present();
             this.loginModal.onDidDismiss(data1 => {
               this.addToBag();``
             }); */
            console.log(type);
            if (productId == 'list') {
              this.navCtrl.setRoot(LandingPage, { pageinfo: "list" });
            } else {
              if (type == 'wishlist') {
                this.navCtrl.setRoot(LandingPage, { pageinfo: "pdp", pid: productId, pqty: productQty, parrentId: this.parrentId, type: 'wishlist' });
              } else {
                this.navCtrl.setRoot(LandingPage, { pageinfo: "pdp", pid: productId, pqty: productQty, parrentId: this.parrentId, type: 'pdp', productInfoObj: this.productInfoObj });
              }
            }


          }
        }
      ]
    });
    alert.present();


  }

  addForRecent(pid) {
    let recentProduct = this.nativeStorage.getnativeStorage('recentPid');
    if (recentProduct) {
      let explodeRecentProduct = recentProduct.pid.split(",")
      if (explodeRecentProduct.length > 20) {
        explodeRecentProduct.pop();
        explodeRecentProduct.join(",");
        recentProduct = pid + "," + explodeRecentProduct;
      } else {
        recentProduct = pid + "," + recentProduct.pid;
      }
    }
    else {
      recentProduct = pid;
    }


    this.nativeStorage.setnativeStorage('recentPid', { pid: recentProduct });

  }

  search() {
    //this.navCtrl.push(SearchPage);
    this.searchModal = this.modalCtrl.create(SearchPage, {}, this.searchView);
    this.searchModal.present();
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


  userTagNotification(cartcounts) {


  }


}
