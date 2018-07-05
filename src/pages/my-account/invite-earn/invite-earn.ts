import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import {
  AppServiceProvider,
  TosterserviceProvider,
  UtilitiesProvider,
  LoadingserviceProvider,
  GtmProvider,
  LocalStorageProvider,
  ConstantsProvider
} from '../../../providers/providers';
import {HomePage} from '../../home/home';
/**
 * Generated class for the InviteEarnPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-invite-earn',
  templateUrl: 'invite-earn.html',
})
export class InviteEarnPage {
  frompdp: any;
  referalText: any;
  termAndCondition: any;
  sharingText: any;
  inviteCode: any = '';
  errorTrue:any = false;

  constructor(private gtm: GtmProvider,
    private apiService: AppServiceProvider,
    public loadingCtrl: LoadingserviceProvider,
    public utilities: UtilitiesProvider,
    public navCtrl: NavController,
    public nativeStorage: LocalStorageProvider,
    public navParams: NavParams,
    public toasterCtrl: TosterserviceProvider,
    public constants:ConstantsProvider,
    private socialSharing: SocialSharing) {
    this.nativeStorage.deleteItems('notificationStatus');
    this.getInviteCode();

    this.frompdp = this.navParams.get('frompdp');
    
  }
  goToMyAccount() {
    if(this.frompdp=='InviteEarnPage'){
    this.navCtrl.setRoot(HomePage);
    }
    else{
    this.navCtrl.pop();
  }
  }
  ionViewDidLoad() {
  }

  shareInfo() {
    this.loadingCtrl.presentLoadingCustom();
    this.gtm.gtminfo('page-myAcount', '/myAcount', 'Referral', 'Referral');
    let subject = 'Jaypore';
    let url = "";
    let msg = this.sharingText;

    this.socialSharing.share(msg, subject, "", url).
      then(() => {
        this.loadingCtrl.dismissLoadingCustom();
      }).catch(() => {
        console.log("Share failed");
      });
  }

  getInviteCode() {
    if (this.utilities.isOnline()) {
      this.errorTrue = false;
      this.loadingCtrl.presentLoadingCustom();
      this.apiService.getInviteCode().subscribe(
        (res) => {
          this.loadingCtrl.dismissLoadingCustom();
          if (!res.error) {
            this.inviteCode = res.data;
            this.referalText = res.content.referalText;
            this.sharingText = res.content.sharingText;
            this.termAndCondition = res.content.termAndCondition;
          } else {
            this.toasterCtrl.presentToast(res.message, 'bottom', '3000', false);
          }
        },
        (err) => { 
          this.errorTrue = true;
          this.loadingCtrl.dismissLoadingCustom();
        }); 
    } else {
      this.toasterCtrl.presentToast(this.constants.toastConfig().noInternet, 'bottom', '3000', false);
    }
  }

  goToHome() {
    this.navCtrl.setRoot(HomePage);

  }

}
