import { Component } from '@angular/core';
import { CartPage, SizeViewPage } from '../../pages';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Vibration } from '@ionic-native/vibration';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ViewController,
  AlertController, Events, App
} from 'ionic-angular';
import {
  TosterserviceProvider,
  ModelinfoProvider,
  LoadingserviceProvider,
  AppServiceProvider, LocalStorageProvider, UtilitiesProvider, BetaoutProvider,GlobalFunctionProvider
} from '../../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-size-modal',
  templateUrl: 'size-modal.html',
})
export class SizeModalPage {
  cartitem: any;
  public sizeList: any;
  public isSelected: any = -1;
  public qty: Number = 1;
  public sizeTrue: boolean = false;
  public sizeClass: boolean = false;
  public startCart: boolean = true;
  public gotoshop: boolean = false;
  public pidsize: any;
  public noSizep: any;
  public productId: any;
  public itemsToBag: any;
  public productAddedMsg: any;
  public sizeChartVar: any;
  public modelpopinfo: any;
  public imageSizeModal: any;
  public noSize: any;
  public itemspartners: number = 1;
  public sizeView = { showBackdrop: true, enableBackdropDismiss: true, cssClass: "size-view" }
  public tap: any;
  public referpage: any;
  public productInfoObj: any;

  constructor(
    public betaout: BetaoutProvider,
    public utilities: UtilitiesProvider,
    private vibration: Vibration,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public toasterCtrl: TosterserviceProvider,
    public Modelinfo: ModelinfoProvider,
    public loadingCtrl: LoadingserviceProvider,
    private AppService: AppServiceProvider,
    public translate: TranslateService,
    public events: Events,
    public nativeStorage: LocalStorageProvider,
    public app: App,
    public globalFuntion: GlobalFunctionProvider
  ) {
    this.tap = this.translate.instant("android");
    this.sizeList = this.navParams.get('sizes');
    this.qty = this.navParams.get('qty');
    this.pidsize = this.navParams.get('productInfo');
    this.noSizep = this.navParams.get('noSize');
    this.sizeChartVar = this.navParams.get('sizeChart');
    this.referpage = this.navParams.get('referPage');
    this.cartitem = this.navParams.get('cartitem');
    this.productInfoObj = this.navParams.get('productInfoObj') ? this.navParams.get('productInfoObj') : "";

    if (this.noSizep.length > 0 || this.pidsize.length > 0) {
      this.itemspartners = 0;
    }



  }

  ionViewDidLoad() {
  }

  selectSize(i) {
    this.isSelected = i;
    this.sizeClass = true;
    this.startCart = false;
  }

  goToBag() {
    this.navCtrl.push(CartPage);
  }

  continueShopping() {
     this.navCtrl.pop();
  }

  viewSimilar() {
    console.log('view similar -modal   close modal');
    this.viewCtrl.dismiss({ "viewSimilar": true });
  }



  loginchk(productId, productQty, productInfoObj) {
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
            this.viewCtrl.dismiss({ "loginfail": true, "prd_id": productId, 'productInfoObj': productInfoObj });
          }
        }                                                                                     
      ]
    });

    alert.present();
  }
  dismiss() {
    console.log('size -modal   close modal');
    this.viewCtrl.dismiss();
  }
  addToBag() {
    if (this.sizeClass === true) {
      /*  for (let y in this.pidsize) {
         if (this.pidsize[y]['size'] == this.isSelected) {
           this.productId = this.pidsize[y]['pid'];
         }
       } */

      this.productId = this.pidsize[this.isSelected]['pid'];
      console.log(this.productId);
      this.productInfoObj['productIdAdded'] = this.productId;
      let token = localStorage.getItem('token');
      if (token == '' || token == null) {
        this.loginchk(this.productId, this.qty, this.productInfoObj);
      } else {
        this.loadingCtrl.presentLoadingCustom();
        this.gotoshop = true;
        if (this.referpage && this.referpage == 'wishlist') {
          this.gotoshop = false;
        }
        if (this.referpage && this.referpage == 'QRCodeHistory') {
          this.gotoshop = true;
        }
        if (this.referpage && this.referpage == 'bannerComponent') {
          this.gotoshop = true;
        }
        if (this.cartitem) {
          this.removeItem(this.cartitem);
        }
        this.AppService.addToBag(this.productId, this.qty).subscribe((res) => {
          this.itemsToBag = res;

          if (this.itemsToBag['error']) {
            this.modelpopinfo = this.Modelinfo.addToBag();
            if (this.itemsToBag['message'] == 'Record not found') {
              let checkProductInCart = this.globalFuntion.checkProductInCart(this.productId);
              if (checkProductInCart && checkProductInCart === true) {
                this.toasterCtrl.presentToast('You have already added the last available piece to your cart.', 'bottom', '3000', false);
              } else {
                this.toasterCtrl.presentToast('Product out of stock', 'bottom', '3000', false);
              }
              //this.toasterCtrl.presentToast('Oops! this product just got sold out. Please look at some other options.', 'bottom', '3000', false);
              this.loadingCtrl.dismissLoadingCustom();
            } else {
              this.toasterCtrl.presentToast('Lets look at some other products', 'bottom', '3000', false);
              this.loadingCtrl.dismissLoadingCustom();
            }

            this.isSelected = -1;

          } else {
            if (this.productInfoObj && this.productInfoObj != '') {
              this.betaout.productAddedInCart(this.productInfoObj);
            }
            this.productAddedMsg = this.itemsToBag.data.message;
            this.vibration.vibrate(300);
            this.globalFuntion.saveProductToLocal(this.productId);
            this.nativeStorage.setnativeStorage('cartCount', this.itemsToBag.data.productsCount);
            this.events.publish('CartUpdated', this.itemsToBag.data.productsCount);

            //     this.toasterCtrl.presentToast('Product has been added into cart!.', 'bottom', '3000', false);

            //disable toasterCtrl product added in cart in case of wishlist "Mahesh"
            if (this.referpage && this.referpage == 'wishlist') {
              this.gotoshop = false;
              this.viewCtrl.dismiss({ "removeFromWishList": this.productId });
            } else {
              this.toasterCtrl.presentToast(this.productAddedMsg, 'bottom', '3000', false);
            }
            this.loadingCtrl.dismissLoadingCustom();
          }

        }, error => {
          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast('Please check your internet connection.', 'bottom', '3000', false);
        });
      }

    } else {
      alert("Error")
    }
  }

  sizeChart() {
    this.imageSizeModal = this.modalCtrl.create(SizeViewPage, { 'sizes': this.sizeChartVar }, this.sizeView);
    this.imageSizeModal.present();
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


}
