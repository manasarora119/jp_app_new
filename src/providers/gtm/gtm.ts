import { Injectable } from '@angular/core';
import { GoogleAnalytics } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Platform } from 'ionic-angular';
import { ConstantsProvider } from "../providers";


@Injectable()
export class GtmProvider {
  pageEvent: any;
  pageUrl: any;
  pageinfo: any;
  info: string;

  eventsNotSent: any[] = new Array();
  trackerInitialized: boolean = false;


  constructor(private ga: GoogleAnalytics, public platform: Platform, public constants: ConstantsProvider) {

    GoogleAnalytics.startTrackerWithId(this.constants.getGaKey()).then(res => {
      console.log("GA keys");
      console.log(this.constants.getGaKey());
      console.log(res);
    }).catch(e => console.log('Error starting GoogleAnalytics', e));

  }

  gtminfo(pageinfo, pageUrl, pageEvent, infopp) {

    this.info = '';
    if (pageinfo)
      this.pageinfo = pageinfo;
    if (pageUrl)
      this.pageUrl = pageUrl;
    if (pageEvent)
      this.pageEvent = pageEvent;
    if (infopp)
      this.info = infopp;

    console.log("Start trackerWithID");


    GoogleAnalytics.startTrackerWithId(this.constants.getGaKey()).then(res => {
      console.log("GA keys");
      console.log(this.constants.getGaKey());
      console.log(res);
    }).catch(e => console.log('Error starting GoogleAnalytics', e));

    // setTimeout(function () {
    //   let a: string = '';
    //   let b: string = '';
    //   let c: string = '';
    //   let d: string = '';
    //   a = pageinfo;
    //   b = pageUrl;
    //   c = pageEvent;
    //   d = infopp;

    //   console.log(a);
    //   console.log(b);
    //   console.log(c);
    //   console.log(d);



    // });



    // GoogleAnalytics.trackEvent('ga testing', 'App Mahan Ho Prbhu', 'testing bhai only testing', 10, true).then(res => {
    //   console.log('jai ho GoogleAnalytics baba');
    //   console.log(res);
    // });

    GoogleAnalytics.trackView(pageinfo).then(res => {
      console.log("view done");
    }).catch(res => {
      console.log('error');
    });

    GoogleAnalytics.trackView(pageinfo, pageUrl, true).then(res=>{
      console.log(res);
      console.log('view done 2');
    }).catch(res=>{
      console.log('error 2');
    });

    GoogleAnalytics.trackEvent(pageinfo, pageEvent, infopp, 10, true).then(res=>{
      console.log('trackEvent 1');
      console.log(res);
    }).catch(res=>{
      console.log('trackEvent error');
    });



  }

  gaConversions(orderId, orderDetails) {



    GoogleAnalytics.addTransaction(orderId, 'Jaypore-Android', orderDetails['grandTotal'], 0,
      orderDetails['shipping_price'], 'INR').then((res) => {
        console.log("addTransaction status");
        console.log(res);
      }).catch(e => console.log('Error addTransaction status', e));
    orderDetails['items'].forEach(element => {
      GoogleAnalytics.addTransactionItem(orderId, element.name, element.sku, element.category, element.final_price, element.quantity, 'INR').then((res) => {
        console.log("addTransactionItem status");
        console.log(res);
      }).catch(e => console.log('Error addTransactionItem status', e));
    });

  }

  gaSourceMedium(search_query){

    console.log("UTM source called with sattic data");
    console.log(search_query);
    GoogleAnalytics.trackEvent('UTM','/pdp-page','UTM',10,true).then((res)=>{
      console.log("UTM source event call");
      console.log(res);
    }).catch(res=>{
      console.log("UTM error");
    });

    if(search_query.utm_source!=undefined)
     GoogleAnalytics.trackView('UTM Source And Medium', 'jaypore.app://content/1111?utm_source='+search_query.utm_source+'&utm_campaign='+search_query.utm_campaign+'&utm_medium='+search_query.utm_medium);

  }

}
