import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MyAccountPage,ImageZoomPage } from '../../pages';

/**
 * Generated class for the FavouriteLookPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favourite-look',
  templateUrl: 'favourite-look.html',
})
export class FavouriteLookPage {
public favourite:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
  ) {


    this.favourite = {
      items: [
        {
          name: "Arriving on 28 Aug-30 Aug",
          imgName: "assets/icon/12-Gift-Card/1.png",
        },
        {
          name: "Arriving on 28 Aug-30 Aug",
          imgName: "assets/icon/12-Gift-Card/4.png",
        },
        {
          name: "Arriving on 28 Aug-30 Aug",
          imgName: "assets/icon/12-Gift-Card/3.png",
        },
        {
          name: "Arriving on 28 Aug-30 Aug",
          imgName: "assets/icon/12-Gift-Card/4.png",
        }
      ]
    }

  }
  public imageZoomModal: any;
  public zoomOptions = { showBackdrop: true, enableBackdropDismiss: true, cssClass: "zoom-modal" };
  
  zoomModal(zoomModalImgae) {
    this.imageZoomModal = this.modalCtrl.create(ImageZoomPage, { 'zoomUrl': zoomModalImgae }, this.zoomOptions);
    this.imageZoomModal.present();
  }
  goToMyAccount() {
    this.navCtrl.setRoot(MyAccountPage);
  }
  ionViewDidLoad() {
  }

}
