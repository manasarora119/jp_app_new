import { Injectable } from '@angular/core';
import { ToastController} from 'ionic-angular';

@Injectable()
export class TosterserviceProvider {
public toast :any;
  constructor(private toastCtrl: ToastController) {
   
  }
  presentToast(msg,postion,duration,CloseButtoninfo) {
	  this.toast = this.toastCtrl.create({
	    message:msg,
	    duration: duration,
	    position: postion,
	    showCloseButton: CloseButtoninfo,
	  });

	  
  this.toast.present();
}
presentToastWithbutton(msg, postion, CloseButtoninfo, CloseButtontext, duration) {
	  this.toast = this.toastCtrl.create({
	    message:msg,
	    position: postion,
	    showCloseButton: CloseButtoninfo,
			closeButtonText:CloseButtontext,
			duration:duration
	  });
	  
  this.toast.present();
  this.toast.onDidDismiss(() => {
	    
	});
}



}
