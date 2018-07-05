import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides,Platform,Events } from 'ionic-angular';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {
    LocalStorageProvider,
 } from '../../../providers/providers';
@IonicPage()
@Component({
  selector: 'page-image-zoom',
  templateUrl: 'image-zoom.html',
})
export class ImageZoomPage implements OnInit {
  zoomUrl:any;
  index : any;
  @ViewChild(Slides) slides: Slides;
  shouldLockSwipes:boolean = true;
  public tap: any;

  constructor(public platform:Platform ,public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController,public translate : TranslateService,public events:Events, public nativeStorage: LocalStorageProvider,) {
    this.tap=this.translate.instant("android");
    this.zoomUrl = '';
    this.zoomUrl =  this.navParams.get('zoomUrl');
    this.index =  this.navParams.get('index');
   
  }


  ionViewDidLoad() {
    // this.platform.registerBackButtonAction(() => {
     
    //   this.viewCtrl.dismiss();

    // }); 
  }


  closeModal() {
   console.log('image -zoom    close modal');
    this.viewCtrl.dismiss();
   
  }

  imageClick(el){
    el.target.classList.toggle('imageZoom'); // To toggle
  }


  onNextSlide() { 
    let current = this.slides.getActiveIndex();
    let last = this.slides.length() - 1; 
    if(current < last){
      this.slides.slideNext();
    }
    
  }

  onPrevSlide(){
    let current = this.slides.getActiveIndex();
    if(current > 0){
      this.slides.slidePrev();
    }
    
  }

  ngOnInit(){
  }

}
