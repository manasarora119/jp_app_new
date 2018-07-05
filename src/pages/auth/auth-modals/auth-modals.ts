import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App, ViewController  } from 'ionic-angular';
import { HomePage, AuthPage, ForgotPasswordPage } from '../../pages';
import {TranslateService} from 'ng2-translate/ng2-translate';



@IonicPage()
@Component({
  selector: 'page-auth-modals',
  templateUrl: 'auth-modals.html',
})
export class AuthModalsPage {
  public data :any;
  public tap:any;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private app: App,
    public viewCtrl: ViewController,
    public translate : TranslateService) {
      this.tap=this.translate.instant("android");
    this.data = this.navParams.get('data');
  
  }

  ionViewDidLoad() {
   
  }

  dismiss() {
     this.viewCtrl.dismiss();
  }

  go(pageAction) {
    this.dismiss();
    if(pageAction == 'login'){
      this.app.getRootNav().setRoot(AuthPage, {tabIndex : 1});
    } else if(pageAction == 'home'){
      this.app.getRootNav().setRoot(HomePage);
    } else if(pageAction == 'forgot'){
      this.app.getRootNav().setRoot(ForgotPasswordPage);
    }
  } 

}
