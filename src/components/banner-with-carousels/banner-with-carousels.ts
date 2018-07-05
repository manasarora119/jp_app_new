import { Component, Input } from '@angular/core';
import { AppServiceProvider, 
  LoadingserviceProvider, 
  UtilitiesProvider, 
  TosterserviceProvider, 
  ModelinfoProvider, 
  GtmProvider, 
  LocalStorageProvider, 
  BetaoutProvider,
  ConstantsProvider, 
  GlobalFunctionProvider } from '../../providers/providers'
import { PdpPage, ListingPage, SizeModalPage, LandingPage, HomePage } from '../../pages/pages';
import { Response } from '@angular/http';
import { IonicPage, NavController, NavParams, Content, ModalController, AlertController, Events, Platform, ViewController, Navbar, App, Nav, MenuController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';


@Component({
  selector: 'banner-with-carousels',
  templateUrl: 'banner-with-carousels.html'
})
export class BannerWithCarouselsComponent {
  productInfoObj: any;
  userData: any;
  bannerImage: string;
  carouselComponentWishlist: any;
  ///@Input('textmg') message;
  @Input('textmg') wishlistmessage;

  @Input('textmsg') title;

  isLoggedIn: any;
  addingToWishList: any;

  public selectedProduct: any;
  public carouselComponent: any;


  public isSelected: Number = -1;
  public bagcount: Number = 0;
  public psize: any;
  public pidsize: any;
  public productId: any;
  public viewSimlar: any;
  public qty: Number = 1;
  public allQty: any[] = [];
  public productAddedMsg: any;
  public pname: any;
  public pBrand: any;
  public fPrice: any;
  public nPrice: any;
  public sPrice: any;
  public qtychk: any = 0;
  public soldoutchk: any;
  public parrentId: any;
  public profileModal: any;
  public allSizes: any;
  public noSize: any;
  public sizeOptions = {
    showBackdrop: true, enableBackdropDismiss: true, cssClass: "size-modal"
  };
  public itemsToBag: any;
  public modelpopinfo: any;
  public itemspartners: any;
  public fave_flag: any;
  sizeFlag: number = 0;
  private listingUrl: any;

  constructor(
    public betaout: BetaoutProvider,
    public platform: Platform,
    private AppService: AppServiceProvider,
    public navCtrl: NavController,
    public utilities: UtilitiesProvider,
    public toasterCtrl: TosterserviceProvider,
    public modalCtrl: ModalController,
    public Modelinfo: ModelinfoProvider,
    public loadingCtrl: LoadingserviceProvider,
    private gtm: GtmProvider,
    public constants:ConstantsProvider,
    private vibration: Vibration,
    public events: Events,
    public alertCtrl: AlertController,
    public nativeStorage: LocalStorageProvider,
    public globalFuntion: GlobalFunctionProvider

  ) {
    //   this.getbannerwithCarousels();
    this.isLoggedIn = this.AppService.isLoggedIn();
    // if (this.isLoggedIn) {
    //   this.getCartCount();
    // }


  }

  subcomponentdata(message, title, location = '') {

    let component = this.nativeStorage.getnativeStorage('compinfo');
    for (let subcomponent in component.pid) {
      if ((message == 'recent_view' && component.pid[subcomponent].component_name == message)) {
        this.AppService.getbannerwithCarousels(component.pid[subcomponent].component_name).subscribe((res) => {
          if (res && res.error != true && res != null && res != undefined && res != '') {
            if (res.data.length > 0) {
              let data = res.data;
              data.splice(15);
              this.carouselComponent = [{
                type: "slider",
                title: title,
                data: data
              }];
            }

          } else {
          }
        }, error => {
        });

      }
      else if ((message == 'wishlist' && component.pid[subcomponent].component_name == message)) {
        this.AppService.getbannerwithCarousels(component.pid[subcomponent].component_name).subscribe((res) => {
          if (res && res.error != true && res != null && res != undefined && res != '') {
            if (res.data.length > 0) {
              let data = res.data;
              data.splice(15);
              this.carouselComponent = [{
                type: "sliderwishlist",
                title: title,
                data: data
              }];
            }

          } else {
          }
        }, error => {
        });


      }

      else if (message == 'cross_selling' && component.pid[subcomponent].component_name == message) {
        for (let item in component.pid[subcomponent].component_data) {

          this.AppService.getCrossSeller(component.pid[subcomponent].component_data[0].type_id).subscribe((res) => {
            if (res && res.error != true && res != null && res != undefined && res != '') {
              if (res.data.length > 0) {
                let data = res.data;
                data.splice(15);
                this.carouselComponent = [{
                  type: "slider",
                  title: title,
                  data: data
                }];

              }
            }
            else {
            }
          }, error => {
          });
        }

      }
      else if (message == 'super_event' && component.pid[subcomponent].component_name == message) {
        for (let item in component.pid[subcomponent].component_data) {
          let event_url = 'webfilterApp?event_id=' + component.pid[subcomponent].component_data[0].type_id + '&storeId=2&page=1&filter_mode_active=1'
          console.log('event uRl ' + event_url);
          this.AppService.getSuperCross(event_url).subscribe((res) => {
            if (res && res.error != true && res != null && res != undefined && res != '') {
              if (res.data.result.length > 0) {
                let data = res.data.result;
                data.splice(15);
                this.carouselComponent = [{
                  type: "banner",
                  title: title,
                  header: res.data,
                  data: data
                }];
              }
            }
            else {
            }
          }, error => {
          });
        }

      }

    }

  }
  ngOnInit() {

    this.subcomponentdata(this.wishlistmessage, this.title);

  }
  // getbannerwithCarousels() {
  //  // this.AppService.getbannerwithCarousels().subscribe((res) => {
  //     // console.log('res....', res);
  //        this.carouselComponent=this.message;
  //       console.log('carousels  banner line 79');
  //        console.log(this.carouselComponent);

  // //    this.carouselComponent = res.carouselComponent;      
  //   // }, error => {
  //   // });
  // }
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
  getDiscount(normal_price, final_price) {
    let discount = 0;
    discount = (normal_price - final_price) / normal_price * 100;
    discount = Math.floor(discount);
    return discount;
  }

  golist(tag, keyinfo = null, keyname = null, name) {
    if (keyinfo == 'event') {
      let addtocart = "Event Name=" + keyname + "&Event Id" + tag;
      this.navCtrl.push(ListingPage, { search_key: 'event_id', search_id: tag, gtmheader: 'Shop All Events', gtmheadercontent: addtocart, source: 'homepage', cName: name });
    } else {
      // let addtocart = "Tag name=" + tag;
      // this.navCtrl.push(ListingPage, { search_key: 'searching', search_query: tag, gtmheader: 'PDP Tag cloud', gtmheadercontent: addtocart });
    }
  }

  addToBag(item) {
    this.getPdpInfo(item);
    this.productInfoObj = JSON.parse(JSON.stringify(item));
    if (item.gallery && item.gallery.thumbnail) {
    } else {
      let image = item.gallery;
      this.productInfoObj['gallery'] = {};
      this.productInfoObj['gallery']['thumbnail'] = image;
    }

    if (this.isSelected == -1 && this.psize != 0) {
      let token = localStorage.getItem('token');
      if (this.psize.length > 0) {

        this.sizeModal(this.pidsize);
      }
      else if (token == '' || token == null) {
        console.log("product ID :" + this.productId);
        this.loginchk(this.productId, this.qty,'gotohome');
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
      else {
        this.productId = item.id;
      }

      let token = localStorage.getItem('token');

      if (token == '' || token == null) {
        this.loginchk(this.productId, this.qty,'gotohome');
      }
      else {
        this.loadingCtrl.presentLoadingCustom();
        this.AppService.addToBag(this.productId, this.qty).subscribe((res) => {
          this.itemsToBag = res;
          if (this.itemsToBag.error) {
            this.modelpopinfo = this.Modelinfo.addToBag();
            if (this.itemsToBag.message == 'Record not found') {
              let checkProductInCart = this.globalFuntion.checkProductInCart(this.productId);
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

          let addtocart = "Product_ID=" + this.productId + "Product_name=" + this.pname + "SKUID=" + this.itemspartners.sku + "price=" + this.itemspartners.final_price + "qty=1";
          this.gtm.gtminfo('page-pdp', '/pdp', 'Add To Cart', addtocart);
          this.globalFuntion.saveProductToLocal(this.productId);
          this.productAddedMsg = this.itemsToBag.data.message;
          this.bagcount = this.itemsToBag.data.productsCount;
          this.toasterCtrl.presentToast(this.productAddedMsg, 'bottom', '3000', false);
          this.vibration.vibrate(300);

            this.nativeStorage.setnativeStorage('cartCount', this.itemsToBag.data.productsCount);

            this.events.publish('CartUpdated', this.itemsToBag.data.productsCount);
            this.loadingCtrl.dismissLoadingCustom();
            this.productInfoObj['sel_qty'] = this.qty;
            this.betaout.productAddedInCart(this.productInfoObj);
            this.userTagNotification(this.itemsToBag.data.productsCount);
          }

        }, error => {
          this.loadingCtrl.dismissLoadingCustom();
        });
      }

    }
  }


  userTagNotification(cartcounts) {


  }

  loginchk(productId, productQty, type = null) {
    console.log("productId:" + productId);
    let alert = this.alertCtrl.create({
      title: 'Please login to continue',
      message: this.constants.toastConfig().loginRegistration,
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
            this.navCtrl.setRoot(LandingPage, { pageinfo: type, pid: productId, pqty: productQty, type: 'compWishlist' });
          }
        }
      ]
    });
    alert.present();
  }


  getPdpInfo(res) {
    if (this.utilities.isOnline()) {
      this.itemspartners = res;
      this.fave_flag = res.fav_flag;
      this.pname = res.name;
      this.pBrand = res.brand_name;
      this.fPrice = res.final_price;
      this.nPrice = res.normal_price;

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

      this.allSizes = res.sizeChart;

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
    this.gtm.gtminfo('page-pdp', '/pdp', 'sizeModal', addtocart);

    this.profileModal = this.modalCtrl.create(SizeModalPage, { 'qty': this.qty, 'sizes': this.psize, 'noSize': this.noSize, 'productInfo': productinfo }, this.sizeOptions);
    let vm = this;
    let data = {
      'sizes': this.psize,
      'qty': this.qty,
      'noSize': this.noSize,
      'sizeChart': this.allSizes,
      'productInfo': productinfo,
      'referPage': 'bannerComponent',
      'productInfoObj': this.productInfoObj
    };
    this.profileModal = this.modalCtrl.create(SizeModalPage, data, this.sizeOptions);
    this.profileModal.present();
    this.profileModal.onDidDismiss(data => {

      if (data && data.loginfail) {
        this.navCtrl.setRoot(LandingPage, { pageinfo: "gotohome", pid: data.prd_id, pqty: this.qty, parrentId: this.parrentId, type: 'pdp' });
      }
    });
  }

  // goToDestination(el): void {
  //   if (el) {
  //     el.scrollIntoView(false);
  //   } else {
  //     let vm = this;
  //     let cl = document.getElementById('destinationVewsimilar');
  //     vm.goToDestination2(cl);
  //   }
  // }

  // goToDestination2(el): void {
  //   if (el) {
  //     el.scrollIntoView(false);
  //   }
  // }

  addToWishlist(id, pindex, cindex) {
    if (this.isLoggedIn) {

      this.carouselComponent[pindex].data[cindex].fave_flag = false;
      this.addingToWishList = cindex;
      this.AppService.manageWishlist(id).subscribe((res) => {
        this.addingToWishList = false;
        this.carouselComponent[pindex].data[cindex].fave_flag = res.fav_flag;
        if (res.error === false) {
          this.toasterCtrl.presentToast(res.message, 'bottom', '1500', false);
        }
      },
        (err) => {
          this.addingToWishList = false;
          this.toasterCtrl.presentToast(err.message, 'bottom', '3000', false);
          console.log(err);
        });
    }else{
      let pageType='addToWishlist';
      this.loginchk(id, this.qty, pageType);
    }
  }
}