import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Slides } from 'ionic-angular';
import { HomePage} from '../pages';

@IonicPage()
@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html',
})
export class WalkthroughPage {

  @ViewChild(Slides) slides: Slides;

  public walkthoughts = [
    {
      imageUrl:"assets/icon/00-Walkthrough/walkthrough_1.jpg",
      headingText:"DISCOVER",
      descriptionsText:"A new part of India and her beautiful heritage daily."
    },
    {
      imageUrl:"assets/icon/00-Walkthrough/walkthrough_2.jpg",
      headingText:"CELEBRATE",
      descriptionsText:"The best of India, with a contemporary flourish."
    },
    {
      imageUrl:"assets/icon/00-Walkthrough/walkthrough_3.jpg",
      headingText:"OWN",
      descriptionsText:"Apparel to jewelry, accessories and home finds."
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  gotoHome(){
     this.navCtrl.setRoot(HomePage);
  }

  slideChanged(){
    let currentIndex = this.slides.getActiveIndex();
    if( currentIndex == 3 ){
      this.gotoHome();
    }
  }
}
