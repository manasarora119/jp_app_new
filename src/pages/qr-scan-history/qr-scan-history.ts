import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider, 
  TosterserviceProvider, 
  AppServiceProvider, 
  GtmProvider, 
  LoadingserviceProvider, 
  ModelinfoProvider, 
  UtilitiesProvider,
  BetaoutProvider, 
  ConstantsProvider,
  GlobalFunctionProvider } from '../../providers/providers';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LandingPage, SizeModalPage, PdpPage, HomePage, QrModalPage } from '../pages';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Vibration } from '@ionic-native/vibration';
import { Events } from 'ionic-angular/util/events';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

@IonicPage()
@Component({
  selector: 'page-qr-scan-history',
  templateUrl: 'qr-scan-history.html',
})
export class QrScanHistoryPage {
  blankhistoryData: boolean = true;
  historyData1: any;
  public wishlistFlat: boolean;
  public shareSatus: number;
  public historyData = [];
  public historyTimeData = [];
  public historyTime = [];
  public itemspartners: any;
  public isLoggedIn: any;
  public productDetail: any;
  public sharemsg:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public nativeStorage: LocalStorageProvider,
    private AppService: AppServiceProvider,
    public toasterCtrl: TosterserviceProvider,
    private gtm: GtmProvider,
    private socialSharing: SocialSharing,
    public loadingCtrl: LoadingserviceProvider,
    public alertCtrl: AlertController,
    public Modelinfo: ModelinfoProvider,
    private vibration: Vibration,
    public events: Events,
    public modalCtrl: ModalController,
    public utilities: UtilitiesProvider,
    public constants:ConstantsProvider,
    public betaout: BetaoutProvider,
    public globalFuntion: GlobalFunctionProvider
  ) {
    // let scHistoryData = nativeStorage.getnativeStorage('QR_Code_Scan');
    // if(scHistoryData && scHistoryData.length >0){
    //   this.getScanHistory(scHistoryData);      
    // }
    let scHistory = this.nativeStorage.getnativeStorage('QR_History');
    if (scHistory && scHistory.length > 0) {
      for (var i = scHistory.length - 1; i >= 0; i--) {
        this.historyTimeData.push(scHistory[i]);
      }
      this.historyTime = this.historyTimeData;
      this.getScanHistory(this.historyTimeData);

    }
    console.log('historyTime....', this.historyTime);

    this.isLoggedIn = this.AppService.isLoggedIn();
    // if (this.isLoggedIn) {
    //   this.getCartCount();
    // }

  }
  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }
  getScanHistory(datas) {
    let pIds = [];
    for (let item in datas) {
      pIds.push(datas[item].pid);
    }

    console.log('get Scan history...');
    let reqData = { "product_ids": pIds };
    console.log(reqData);
    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.AppService.getQrHistory(reqData).subscribe((res) => {
        let pId;
        console.log('getQrHistory', res);
        if (res && !res.error && res.data) {
          this.loadingCtrl.dismissLoadingCustom();
          //  let arrayWithDuplicates = res.data
          //this.historyData =this.removeDuplicates(arrayWithDuplicates, "id");
          this.historyData = res.data;
          console.log(this.historyData)
          this.blankhistoryData = false;
        } else {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', '3000', false);
          // this.toasterCtrl.presentToast('wrong SKU', 'bottom', '3000', false);
        }
      }, error => {
        this.loadingCtrl.dismissLoadingCustom();
        console.log('error....');
        this.toasterCtrl.presentToast(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', '3000', false);
        // this.toasterCtrl.presentToast('error', 'bottom', '3000', false);
      });
    }
    else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }

  }

  closeScanhistory() {
    this.navCtrl.pop();
  }

  shareProduct(item) {
    this.itemspartners = item;
    console.log('item....', item)
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
    let addtocart = "Product Id=" + item.id + "&Product Name" + item.name + "&price=" + item.final_price;
    this.gtm.gtminfo('QR History', '/pdp', 'QR Scan Share friend', addtocart);
    this.socialSharing.share(msg, subject, "", url).
      then(() => {
        // Success!
      }).catch(() => {
        // Error!
      });
  }

  addToWishlist(id, index) {
    console.log('wishlist clicked')
    this.isLoggedIn = this.nativeStorage.getnativeStorage('user');
    if (this.isLoggedIn) {
      this.loadingCtrl.presentLoadingCustom();
      this.AppService.manageWishlist(id).subscribe((res) => {
        if (res.error === false) {
          //    this.historyTime.splice(index, 1);
          //  this.historyData.splice(index, 1);
          this.loadingCtrl.dismissLoadingCustom();
          //  this.nativeStorage.setnativeStorage('QR_History', this.historyTime);
          this.toasterCtrl.presentToast(res.message, 'bottom', '1500', false);
        }
        else {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', '1500', false);
        }

      },
        (err) => {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(err.message, 'bottom', '3000', false);

        });
    } else {
      //  this.loginchk('QRCode', this.qty);
      // this.loginchk(this.productId, this.qty ,'QRCode');

      this.loginchk(id, '1', 'wishlist');

      //this.navCtrl.setRoot(LandingPage, { pageinfo: "QR_Code" });
    }
  }
  public psize: any;
  public pidsize: any;
  public productId: any;
  public qty: Number = 1;
  public itemsToBag: any;
  public modelpopinfo: any;
  public productAddedMsg: any;
  public bagcount: Number = 0;
  public isSelected: Number = -1;
  public pname: any;
  public noSize: any;
  public profileModal: any;
  public allSizes: any;
  public parrentId: any;
  public sizeOptions = {
    showBackdrop: true, enableBackdropDismiss: true, cssClass: "size-modal"
  };
  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  addToBag(item, index) {
    this.productDetail = JSON.parse(JSON.stringify(item));
    if (item.gallery && item.gallery.thumbnail) {
    } else {
      let image = item.gallery;
      this.productDetail['gallery'] = {};
      this.productDetail['gallery']['thumbnail'] = image;
    }    
        
    console.log('add to bag', item, index);
    this.getPdpInfo(item);
    if (this.isSelected == -1 && this.psize != 0) {
      let token = localStorage.getItem('token');
      if (this.psize.length > 0) {
        this.sizeModal(this.pidsize);
        //this.toasterCtrl.presentToast('Please select size', 'bottom', '3000', false);
      } else if (token == '' || token == null) {
        this.loginchk(this.productId, this.qty, 'Addtobag');
      } else {
        //
      }
    } else {
      if (this.psize != 0) {
        for (let y in this.pidsize) {
          if (this.pidsize[y]['size'] == this.isSelected) {
            this.productId = this.pidsize[y]['pid'];
          }
        }
      }
      else {
        this.productId = item.id;
      }

      let token = localStorage.getItem('token');

      if (token == '' || token == null) {
        this.loginchk(this.productId, this.qty, 'Addtobag');
      } else {
        this.loadingCtrl.presentLoadingCustom();
        this.AppService.addToBag(this.productId, this.qty).subscribe((res) => {
          this.itemsToBag = res;
          if (this.itemsToBag.error) {
            this.modelpopinfo = this.Modelinfo.addToBag();
            if (this.itemsToBag.message == 'Record not found') {
              let checkProductInCart = this.globalFuntion.checkProductInCart(this.productId);
              if(checkProductInCart && checkProductInCart === true) {
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

            this.productAddedMsg = this.itemsToBag.data.message;
            this.bagcount = this.itemsToBag.data.productsCount;
            this.globalFuntion.saveProductToLocal(this.productId);
            this.toasterCtrl.presentToast(this.productAddedMsg, 'bottom', '3000', false);
            this.vibration.vibrate(300);
            this.nativeStorage.setnativeStorage('cartCount', this.itemsToBag.data.productsCount);

            this.events.publish('CartUpdated', this.bagcount);

            console.log(this.productDetail);
            this.betaout.productAddedInCart(this.productDetail);

            this.loadingCtrl.dismissLoadingCustom();
            // this.userTagNotification(this.itemsToBag.data.productsCount);
          }

        }, error => {
          this.loadingCtrl.dismissLoadingCustom();
        });
      }

    }
  }
  public pBrand: any;
  public fPrice: any;
  public nPrice: any;
  public sPrice: any;
  public fave_flag: any;
  public allQty: any[] = [];
  public qtychk: any = 0;
  public viewSimlar: any;
  public sizeFlag: number = 0;


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
  loginchk(productId, productQty, type = null) {

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
            console.log('QR Login check.. OK', type);
            if (type == 'wishlist') {
              this.navCtrl.setRoot(LandingPage, { pageinfo: "Qrhistory", pid: productId, pqty: productQty, parrentId: this.parrentId, type: 'wishlist' });
            }

            else if (type == 'Addtobag') {
              this.navCtrl.setRoot(LandingPage, { pageinfo: "Qrhistory", pid: productId, pqty: productQty, parrentId: this.parrentId, type: 'addtobag', productInfoObj: this.productDetail });
            }
            // else{
            //     this.navCtrl.setRoot(LandingPage, { pageinfo: "wishlist", pid: productId, pqty: productQty,parrentId:this.parrentId, type:'wishlist' });
            //   }

            // this.navCtrl.setRoot(LandingPage, { pageinfo: "QR_Code", pid: productId, pqty: productQty, parrentId: "this.parrentId" });
          }
        }
      ]
    });
    alert.present();
  }

  GoToPdp(item) {
    console.log(item);

    this.navCtrl.push(PdpPage, {
      pid: item.id,
      brand_name: item.brand_name,
      name: item.name,
      zimage: item.gallery,
      thimge: item.listimg1,
      fPrice: item.final_price,
      nPrice: item.normal_price,
      sPrice: item.special_price,
    });
  }
  sizeModal(productinfo, cartitem = '') {

    let addtocart = "Product_ID=" + this.productId + "&Product_name=" + this.pname + "&SKUID=" + this.itemspartners.sku + "&price=" + this.itemspartners.final_price + "&PreviousSize=" + this.isSelected;
    this.gtm.gtminfo('page-pdp', '/pdp', 'sizeModal', addtocart);
    let vm = this;
    let data = {
      'sizes': this.psize,
      'qty': this.qty,
      'noSize': this.noSize,
      'sizeChart': this.allSizes,
      'productInfo': productinfo,
      'cartitem': cartitem,
      'referPage': 'QRCodeHistory',
      'productInfoObj': this.productDetail,
    };
    this.profileModal = this.modalCtrl.create(SizeModalPage, data, this.sizeOptions);

    console.log('data ++', data)
    this.profileModal.present();
    this.profileModal.onDidDismiss(data => {
       if (data && data.loginfail) {
        this.navCtrl.setRoot(LandingPage, { pageinfo: "Qrhistory", pid: data.prd_id, pqty: productinfo.qty, parrentId: this.parrentId, type: 'addtobag','productInfoObj': data.productInfoObj });
      }
    });
  }

  openQrModal(productUrl,productName) {
    let url = 'https://www.jaypore.com/';
    var msg = "Check out this beautiful product on Jaypore.\n" + productName + ", Here's the link - \n";
    this.sharemsg = msg + ' ' + productUrl;
    //console.log(  this.sharemsg);
    let modal = this.modalCtrl.create(QrModalPage, { sharemsg: this.sharemsg });
    modal.present();
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


}
