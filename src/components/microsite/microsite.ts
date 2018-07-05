import { Component, Input, OnInit } from '@angular/core';
import {
     LocalStorageProvider,AppServiceProvider
} from '../../providers/providers';

/**
 * Generated class for the MicrositeComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'microsite',
  templateUrl: 'microsite.html'
})
export class MicrositeComponent implements OnInit {
  user: any;
 
  isLoggedIn: any;

  @Input('textmg') message;
 
  public compinfo: any;
  public subcomponent :any;
  public wishlist :any;
  public recent_view :any;
  public cross_selling :any;
  public  superScroll : any;
  
  constructor( public nativeStorage: LocalStorageProvider,
  private AppService: AppServiceProvider,
  ) {
  

  }
  ngOnInit() {
     let compinfop = this.nativeStorage.getnativeStorage('compinfo');
     if(this.message !='nodata' ){
       this.compinfo = this.message;
     }else if(compinfop){
      this.compinfo = compinfop.pid;
     }
    this.user=this.AppService.isLoggedIn();
     
  }
}
