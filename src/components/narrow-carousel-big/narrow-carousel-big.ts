import { Component,Input } from '@angular/core';
import { ListingPage, MicrositePage, MyCouponsPage, GiftCardsPage, InviteEarnPage, LandingPage } from '../../pages/pages';
import { NavController, AlertController } from 'ionic-angular';
import { ConstantsProvider } from '../../providers/providers';



/**
 * Generated class for the NarrowCarouselBigComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'narrow-carousel-big',
  templateUrl: 'narrow-carousel-big.html'
})
export class NarrowCarouselBigComponent {

  @Input('textmg') message;
  public narrowItems :any;
  myfilters:any;

  constructor(public alertCtrl: AlertController,
    public constants:ConstantsProvider,
    public navCtrl: NavController) {
    
   
  }

  ngOnInit(){
    //console.log(this.message);
     this.narrowItems=this.message;
  }
    goToAction(item,typeifo,myfilter,name){
     
     this.myfilters='';
    let addtocart="Slider Name=NarrowCarouselBig&From=Homg Page&type="+typeifo+"&typeId="+item;
     if(myfilter){       
         let explodeRecentProduct = myfilter.split("&amp;")    
           
           for (let y in explodeRecentProduct) {
             if(explodeRecentProduct[y]!=''){
                
                 this.myfilters+='&'+explodeRecentProduct[y];
             }           
          }           
      }
          if(typeifo == 'Category'){
      if(this.myfilters){
            item=item+this.myfilters;
        }
    
       this.navCtrl.push(ListingPage, { search_key: 'category_id', search_id: item ,gtmheader:'Homepage sliders',gtmheadercontent:addtocart,source: 'homepage',cName: name});
      }
      else if(typeifo == 'Event'){
        
       this.navCtrl.push(ListingPage, { search_key: 'event_id', search_id: item ,gtmheader:'Homepage sliders',gtmheadercontent:addtocart,source: 'homepage',cName: name });
      }
      else if(typeifo == 'Brand'){
        if(this.myfilters){
            item=item+this.myfilters;
        }
       
       this.navCtrl.push(ListingPage, { search_key: 'barnd_id', search_id: item,gtmheader:'Homepage sliders',gtmheadercontent:addtocart,source: 'homepage',cName: name });
      }
      else if(typeifo == 'search'){
       this.navCtrl.push(ListingPage, { search_key: 'searching', search_query: item,gtmheader:'Homepage sliders',gtmheadercontent:addtocart,source: 'homepage',cName: name });
      }
      else if(typeifo == 'Spl_page'){
        this.navCtrl.push(MicrositePage, {pid: item });
    }else if (typeifo == 'local') {
      let pageInfo:any;
      if (item == 'invite_earn') {
        pageInfo = InviteEarnPage;
      } else if (item == 'gift_cards') {
        pageInfo = GiftCardsPage;
      } else if (item == 'my_coupons') {
        pageInfo = MyCouponsPage;
      }
      let token = localStorage.getItem('token');

      if (token == '' || token == null) {
        this.loginchk(pageInfo);

      } else {
        this.navCtrl.push(pageInfo);
      }

    }
   
  }
  loginchk(compInfo) {
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

            this.navCtrl.setRoot(LandingPage, { pageinfo: "component", pid: compInfo });


          }
        }
      ]
    });

    alert.present();
  }
}
