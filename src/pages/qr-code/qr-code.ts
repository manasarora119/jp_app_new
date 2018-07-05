import { Component, } from '@angular/core';
import { IonicPage, ToastController, NavController, NavParams, Platform } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { PdpPage, QrScanHistoryPage } from '../pages';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocalStorageProvider, 
  AppServiceProvider, 
  TosterserviceProvider, 
  LoadingserviceProvider,
  ConstantsProvider, 
  UtilitiesProvider } from '../../providers/providers';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'page-qr-code',
  templateUrl: 'qr-code.html',
})
export class QrCodePage {
  disableStatus: boolean;
  applykey: boolean = false;
  keyboard: boolean = true;
  denied: boolean = false;
  public scanCode = [];
  public qrHistory = [];
  public skuInput;
  constructor(
    public loadingCtrl: LoadingserviceProvider,
    public utilities: UtilitiesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private qrScanner: QRScanner,
    private androidPermissions: AndroidPermissions,
    public nativeStorage: LocalStorageProvider,
    private AppService: AppServiceProvider,
    private statusBar: StatusBar,
    public toasterCtrl: TosterserviceProvider,
    public platform: Platform,
    public ToastController: ToastController,
    public constants:ConstantsProvider


  ) {

    let localScanHistory = this.nativeStorage.getnativeStorage('QR_History');
    if (localScanHistory && localScanHistory.length > 0) {
      this.qrHistory = localScanHistory;
    }

    if (this.platform.is('ios')) {
      this.statusBar.backgroundColorByHexString('#ffffff');
      console.log('color white adeed to statusbar');
    }

    this.cameraPermission();
    // this.scanQrcode();
    this.keyboard = false;


  }

  closeQrPage() {
    this.navCtrl.pop();
  }

  KeyboardOpen() {
     this.disableStatus=true;
     setTimeout(() => {
     
     this.disableStatus=false;
    }, 2200);
   
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');

    this.skuInput = '';
    this.qrScanner.hide();
    console.log('hide');
    this.qrScanner.destroy();
    this.keyboard = true;
    // window.document.querySelector('ion-app').classList.remove('transparentBody');
  }

  applyPCode() {
    console.log('apply product code.');
    console.log('Input..', this.skuInput);
    this.isSKU(this.skuInput, true);
  }

  gotoScanHistory() {
    this.navCtrl.push(QrScanHistoryPage);
  }

  scanQrcode(apply) {

      this.disableStatus=true;
     setTimeout(() => {
         this.disableStatus=false;
    }, 2200);
    if (apply == true)
      this.keyboard = true;
    else {
      this.keyboard = false;
      this.qrScanner.show();
      this.cameraPermission();
      //window.document.querySelector('ion-app').classList.add('transparentBody');
      (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
      this.qrScanner.prepare()
        .then((status: QRScannerStatus) => {
          console.log("succees qr code");
          console.log(status);
          if (status.authorized) {
            let scanSub = this.qrScanner.scan().subscribe((text: string) => {
              console.log(text);
              let scanArr = [];
              scanArr = text.split('/');
              console.log(scanArr);
              let sku = scanArr[scanArr.length - 1];
              console.log(sku);
              this.isSKU(sku, false);
              this.qrScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning
            });
            this.qrScanner.show();
          }
          else if (status.denied) {
            //this.qrScanner.openSettings();

            console.log('permission denied');
          }
          else {
            console.log('444444 else..............');
          }
        }, err => {

          let toast = this.ToastController.create({
            message: this.constants.toastConfig().cameraPermissionChangeMsg,
            duration: 5000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: "OK"
          });

          if (this.denied != true) {
            toast.present();
          }

          toast.onDidDismiss((data, role) => {
            if (role) {
              console.log(err);
              this.skuInput = '';
              this.keyboard = true;
            }
          });


        });
    }

  }
  isSKU(skuId, apply) {
    if (this.utilities.isOnline()) {
      this.loadingCtrl.presentLoadingCustom();
      this.AppService.checkSKU(skuId).subscribe((res) => {
        let pId;
        console.log('sku11111111', res);
        if (res && !res.error) {
          this.loadingCtrl.dismissLoadingCustom();
          if (res.exists == 1) {
            pId = res.product_id;
            let qrHistorylocal = this.nativeStorage.getnativeStorage('QR_History');
            if (qrHistorylocal != null) {
              for (let item in qrHistorylocal) {
                if (qrHistorylocal[item].pid == pId) {
                  console.log('before splice', this.nativeStorage.getnativeStorage('QR_History'));
                  qrHistorylocal.splice(item, 1);
                  this.nativeStorage.setnativeStorage('QR_History', qrHistorylocal);
                  console.log('after splice', this.nativeStorage.getnativeStorage('QR_History'));
                  this.qrHistory = this.nativeStorage.getnativeStorage('QR_History');
                }
              }
            }

            this.qrHistory.push({ 'pid': Number(pId), 'time': Date.now() });
            this.nativeStorage.setnativeStorage('QR_History', this.qrHistory);
            this.navCtrl.push(PdpPage, { pid: pId });
          }
          else {
            this.skuInput='';
            this.loadingCtrl.dismissLoadingCustom();
            this.toasterCtrl.presentToast(this.constants.toastConfig().productQrScanDoesNotExist, 'bottom', '3000', false);
            this.scanQrcode(apply);

          }
        } else {

          this.loadingCtrl.dismissLoadingCustom();
          this.toasterCtrl.presentToast(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', '3000', false);
          this.scanQrcode(apply);

        }
      }, error => {
        this.loadingCtrl.dismissLoadingCustom();
        console.log('error....');
        this.scanQrcode(apply);
        this.toasterCtrl.presentToast(this.constants.toastConfig().apiNotRespondingOrTimeOut, 'bottom', '3000', false);
      });
    }
    else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrCodePage');
  }

  ionViewWillLeave() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');

    this.qrScanner.hide();
    this.qrScanner.destroy();

    console.log('ionViewWillLeave 2');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter  QRCode');
    this.scanQrcode(false);
  }


  cameraPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      success => {
        console.log('Permission granted')
      },
      err => {
        console.log('check persmission')

        // this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        let vm = this;
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]).then(success => {

          console.log(success);
          if (success.hasPermission == false) {
            vm.keyboard = true;
            console.log('request persmission')
          }
        }, err => {
          console.log(err);
          console.log('error persmission')
          this.denied = true;
        });
      }
    );
  }

}
