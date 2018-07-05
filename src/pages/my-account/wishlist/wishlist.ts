import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController, Events, App, ViewController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import {
  GtmProvider,
  TosterserviceProvider,
  ModelinfoProvider,
  LoadingserviceProvider,
  AppServiceProvider,
  UtilitiesProvider,
  LocalStorageProvider,
  BetaoutProvider,
  GlobalFunctionProvider,
  ConstantsProvider
} from '../../../providers/providers';
import {
  HomePage,
  SizeModalPage,
  ImageZoomPage,
  SizeViewPage,
  LandingPage,
  CartPage,
  ProductSizePage,
  RemoveWishlistProductPage,
  PdpPage,
  QrModalPage
} from '../../pages';
import { Vibration } from '@ionic-native/vibration';
@IonicPage()
@Component({
  selector: 'page-wishlist',
  templateUrl: 'wishlist.html',
})
export class WishlistPage {
  userData: any;
  wishlistItems: any;
  wishlistCount: any;
  public backinfo: any;
  public isSelected: Number = -1;
  public productId: any;
  public parrentId: any;
  public pname: any;
  public pBrand: any;
  public removeProductMsg: any;
  public apiSuccess: number = 0;
  shareSatus: number = 1;
  public fave_flag: any;
  public soldoutchk: any;
  public fPrice: any;
  public nPrice: any;
  public sPrice: any;
  public event_id: any;
  public MainImage: any;
  public viewSimlar: any;
  public flag: any = false;
  public errorTrue: boolean = false;
  /**/
  public psize: any;
  public user: any;
  public pidsize: any;
  public allSizes: any;
  public noSize: any;
  public qty: Number = 1;
  public allQty: any[] = [];
  public itemspartners: any;
  public itemspartnersSimilar: any;
  public itemspartnersPopular: any;
  public itemspartnersEvent: any;
  public itemspartnersTag: any;
  public itemspartnersNew: any;
  public itemspartnersShopall: any
  public qtychk: any = 0;
  sizeFlag: number = 0;
  public profileModal: any;
  //public disabelButton: boolean = false;
  public sizeOptions = {
    showBackdrop: true, enableBackdropDismiss: true, cssClass: "size-modal"
  };

  public itemsToBag: any;
  public bagcount: Number = 0;
  public productAddedMsg: any;
  public selectedProduct: any;
  public productDetail: any;
  public sharemsg: any;
  constructor(
    public navCtrl: NavController,
    private AppService: AppServiceProvider,
    public loadingCtrl: LoadingserviceProvider,
    public utilities: UtilitiesProvider,
    public modalCtrl: ModalController,
    public Modelinfo: ModelinfoProvider,
    public toasterCtrl: TosterserviceProvider,
    private vibration: Vibration,
    public events: Events,
    public navParams: NavParams,
    private gtm: GtmProvider,
    private app: App,
    private viewCtrl: ViewController,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private nativeStorage: LocalStorageProvider,
    public betaout: BetaoutProvider,
    public globalFuntion: GlobalFunctionProvider,
    public constants:ConstantsProvider
  ) {

    this.backinfo = this.navParams.get('pageinfo');
    //this.productId = this.navParams.get('pid');
    this.pname = this.navParams.get('name');
    this.pBrand = this.navParams.get('brand_name');
    this.parrentId = this.navParams.get('pid');

    this.getWishItem();
    this.events.subscribe('productToWishlist', (productId, listingId, faveActionFlag) => {

      if (faveActionFlag === false) {
        if (this.wishlistItems && this.wishlistItems.length > 0) {
          for (var i = 0; i < this.wishlistItems.length; i++) {
            if (this.wishlistItems[i].id == productId) {
              this.wishlistItems.splice(i, 1);
              this.wishlistCount = this.wishlistCount - 1;
              break;
            }
          }
        }
      }
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad WishlistPage');
  }

  shareProduct(item) {
    this.itemspartners = item;
    let subject = '';

    let msg = 'Product Info';

    this.shareSatus = 0;

    setTimeout(() => {

      this.shareSatus = 1;
    }, 500);

    let url = 'https://www.jaypore.com/';

    if (this.itemspartners.url)
      url = this.itemspartners.url
    if (this.itemspartners.name)
      msg = "Check out this beautiful product on Jaypore.\n" + this.itemspartners.name + ", Here's the link - \n";
    let addtocart = "Product Id=" + this.productId + "&Product Name" + this.pname + "&price=" + this.itemspartners.final_price;
    this.gtm.gtminfo('page-Pdp', '/pdp', 'PDP Share friend', addtocart);
    this.socialSharing.share(msg, subject, "", url).
      then(() => {
        // Success!
      }).catch(() => {
        // Error!
      });
  }

  gotoPdp(item) {

    let pid = item.id;
    this.navCtrl.push(PdpPage, { pid: pid });
    /*this.app.getRootNav().push(PdpPage, { pid: pid,referPage:"wishlistPage" }).then(() => {         
               const index = this.viewCtrl.index;
              this.navCtrl.remove(index);
             });*/
  }

  getWishItem() {
    this.errorTrue = false;
    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.AppService.getWishlistItems().subscribe(
        (res) => {
          //console.log(res);
          this.apiSuccess = 1;
          this.loadingCtrl.dismissLoadingCustom();
          if (res.data) {
            this.wishlistCount = res.data.length;
            this.wishlistItems = res.data;
            this.userTagNotification(this.wishlistCount);
          } else if (res && res.message == 'No Record found') {
            this.wishlistCount = 0;
          } else {
            this.errorTrue = true;
          }
        },
        (error) => {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(error, 'bottom', '3000', false);
        });
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }


  goToHome() {
    this.navCtrl.setRoot(HomePage);

  }

  wishlistSizeModal() {
    let vm = this;
    let data = {

    }
  }

  removeProduct(item, e) {
    event.stopPropagation();
    //this.disabelButton = true;
    //console.log(item);
    var options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
      cssClass: "remove-product"
    }
    let modal = this.modalCtrl.create(RemoveWishlistProductPage, { "item": item }, options);
    modal.present();
    modal.onDidDismiss(data => {
      if (data && data.removeThisItem) {
        this.removeproductItem(item);
      }
    })
  }

  removeproductItem(item) {
    if (this.utilities.isOnline()) {
      let id = item.id;
      this.AppService.manageWishlist(id).subscribe((res) => {
        //this.events.publish('productRemovedFromWishlist', this.testArr);
        this.events.publish('productRemovedFromWishlist', id);
        this.removeProductMsg = res.message;
        if (this.flag && this.flag == true) {
          this.toasterCtrl.presentToast(this.constants.toastConfig().productMoveFromWishListToCart, 'bottom', '2000', false);
          this.flag = false;
        } else {
          this.toasterCtrl.presentToast(this.removeProductMsg, 'bottom', '2000', false);
        }
       // this.disabelButton = false;
        this.wishlistItems = [];
        this.getWishItem();
      }, (error) => {
       // this.disabelButton = false;
        console.log(error);
        this.toasterCtrl.presentToast(error, 'bottom', '1500', false);
      })
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '1500', false);
    }
  }


  getPdpInfo(res) {
    //console.log(res);
    if (this.utilities.isOnline()) {

      //console.log(this.itemspartners);
      this.itemspartners = res;
      this.fave_flag = res.fav_flag;
      //this.itemspartners = res.data;
      //this.soldoutchk = res.quantity;
      this.pname = res.name;
      this.pBrand = res.brand_name;
      this.fPrice = res.final_price;
      this.nPrice = res.normal_price;
      // this.sPrice = res.special_price;

      if (res.final_price == res.normal_price) {
        this.sPrice = 0;
        this.nPrice = 0;
      } else {
        this.sPrice = (((res.normal_price - res.special_price) / res.normal_price) * 100);
        this.sPrice = Math.round(this.sPrice);
      }

      if (this.itemspartners.measurements == 'Refer to the description.' || this.itemspartners.measurements == 'Refer to the description') {
        this.itemspartners.measurements = 'Refer to the chart.'
      }
      //this.selectedQty = this.qty;
      this.allSizes = res.sizeChart;
      /*this.event_id = this.itemspartners.event_id;
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
      }*/

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


      if (this.itemspartners.child_products == null || this.itemspartners.child_products.length == 0) {

        this.allQty = [];
        for (var i = 1; i <= res.quantity; i++) {
          this.allQty.push(i);
        }
        if (res.quantity) {
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

    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  sizeModal(productinfo) {
    let addtocart = "Product_ID=" + this.productId + "&Product_name=" + this.pname + "&SKUID=" + this.itemspartners.sku + "&price=" + this.itemspartners.final_price + "&PreviousSize=" + this.isSelected;
    //this.gtm.gtminfo('page-pdp', '/pdp', 'sizeModal', addtocart);

    this.profileModal = this.modalCtrl.create(SizeModalPage, { 'qty': this.qty, 'sizes': this.psize, 'noSize': this.noSize, 'productInfo': productinfo }, this.sizeOptions);
    let vm = this;
    let data = {
      'sizes': this.psize,
      'qty': this.qty,
      'noSize': this.noSize,
      'sizeChart': this.allSizes,
      'productInfo': productinfo,
      'referPage': 'wishlist',
      'productInfoObj': this.productDetail,
    };


    this.profileModal = this.modalCtrl.create(SizeModalPage, data, this.sizeOptions);
    this.profileModal.present();
    this.profileModal.onDidDismiss(data => {

      if (data && data.viewSimilar) {
        let el = document.getElementById('destinationVewsimilar');
        vm.goToDestination(el);
      } else if (data && data.loginfail) {
        this.navCtrl.setRoot(LandingPage, { pageinfo: "pdp", pid: data.prd_id, pqty: this.qty, parrentId: this.parrentId, 'productInfoObj': data.productInfoObj });
      } else if (data && data.removeFromWishList) {
        //console.log(this.selectedProduct);
        let item = {};
        item['id'] = this.selectedProduct.productId;
        this.flag = true;
        this.removeproductItem(item);
      }
    });
  }


  addWishlistToBag(item, i) {
    console.log(item);
    this.productDetail = JSON.parse(JSON.stringify(item));
    if (item.gallery && item.gallery.thumbnail) {
    } else {
      let image = item.gallery;
      this.productDetail['gallery'] = {};
      this.productDetail['gallery']['thumbnail'] = image;
    }

    let selectItem = {
      'productId': item.id,
      'sizes': item.size,
      'qty': item.qty,
      'quantity': item.quantity,
      'name': item.name,
      'sku': item.sku,
      'final_price': item.final_price,
      //'noSize': item.noSize,
      'sizeChart': item.sizeChart,
      //'productInfo': productinfo
    }
    this.selectedProduct = selectItem;
    //console.log(item);
    //console.log(selectItem);
    this.getPdpInfo(item);
    if (this.psize.length > 0) {
      this.sizeModal(this.pidsize);
      //this.toasterCtrl.presentToast('Please select size', 'bottom', '3000', false);
    } else {
      this.loadingCtrl.presentLoadingCustom();
      this.AppService.addToBag(selectItem.productId, this.qty).subscribe((res) => {
        this.itemsToBag = res;
        if (this.itemsToBag.error) {
          //this.modelpopinfo = this.Modelinfo.addToBag();
          if (this.itemsToBag.message == 'Record not found') {
            let checkProductInCart = this.globalFuntion.checkProductInCart(selectItem.productId);
            if (checkProductInCart && checkProductInCart === true) {
              this.toasterCtrl.presentToast(this.constants.toastConfig().productAlreadyInCart, 'bottom', '3000', false);
            } else {
              this.toasterCtrl.presentToast(this.constants.toastConfig().productOutOffStock, 'bottom', '3000', false);
            }
            //this.toasterCtrl.presentToast('Product out of stock', 'bottom', '3000', false);
            this.loadingCtrl.dismissLoadingCustom();
          } else {
            this.toasterCtrl.presentToast(this.constants.toastConfig().productNotAvailable, 'bottom', '3000', false);
            this.loadingCtrl.dismissLoadingCustom();
          }
          this.isSelected = -1;
        } else {
          this.flag = true;
          let addtocart = "Product_ID=" + selectItem.productId + "Product_name=" + selectItem.name + "SKUID=" + selectItem.sku + "price=" + selectItem.final_price + "qty=1";
          this.gtm.gtminfo('page-wishlist', '/wishlist', 'Add To Cart', addtocart);

          //this.productAddedMsg = this.itemsToBag.data.message;
          this.bagcount = this.itemsToBag.data.productsCount;
          //this.toasterCtrl.presentToast(this.productAddedMsg, 'bottom', '2000', false);
          this.globalFuntion.saveProductToLocal(this.productId);
          this.vibration.vibrate(300);
          this.nativeStorage.setnativeStorage('cartCount', this.itemsToBag.data.productsCount);

          this.events.publish('CartUpdated', this.itemsToBag.data.productsCount);
          console.log(this.productDetail);
          this.betaout.productAddedInCart(this.productDetail);
          this.loadingCtrl.dismissLoadingCustom();

          //console.log(this.selectedProduct);
          let item = {};
          item['id'] = selectItem.productId;

          this.removeproductItem(item);
          //console.log("User Cart Data:");
          //this.userTagNotification(this.itemsToBag.data.productsCount);
        }

      }, error => {
        this.loadingCtrl.dismissLoadingCustom();
      });
    }

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

  userTagNotification(wishlistCount) {


  }

  openQrModal(productUrl,productName) {
    let url = 'https://www.jaypore.com/';
    var msg = "Check out this beautiful product on Jaypore.\n" + productName + ", Here's the link - \n";
    this.sharemsg = msg + ' ' + productUrl;
    //console.log(  this.sharemsg);
    let modal = this.modalCtrl.create(QrModalPage, { sharemsg: this.sharemsg });
    modal.present();
  }

}
