import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConstantsProvider } from '../constants/constants';
import { Device } from '@ionic-native/device';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

@Injectable()
export class AppServiceProvider {

  constructor(public http: Http,
    public config: ConstantsProvider,
    public plt: Platform,
    private fb: Facebook,
    private googlePlus: GooglePlus, private device: Device,
    private nativeStorage: LocalStorageProvider) {
  }

  initOnAppStart() {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().tokenUrl;
    let body = {};
    return this.http.put(url, body).map((res: Response) => res.json());
  }

  login(usrdetails) {
    let url = this.config.getConfig().baseUrl;
    let loginUrl = this.config.getConfig().loginUrl;
    let finalUrl = url + loginUrl;
    let body = usrdetails;
    return this.http.post(finalUrl, body).map((res: Response) => res.json());
  }

  buyGiftCard(usrdetails) {
    let url = this.config.getConfig().baseUrl;
    let giftUrl = this.config.getConfig().giftUrl;
    let finalUrl = url + giftUrl;
    let body = usrdetails;
    return this.http.post(finalUrl, body).map((res: Response) => res.json());
  }

  updateGiftCard(usrdetails) {
    let url = this.config.getConfig().baseUrl;
    let giftUrl = this.config.getConfig().giftUrlUpdate;
    let finalUrl = url + giftUrl;
    let body = usrdetails;
    console.log("Fuinal url" + finalUrl);
    return this.http.post(finalUrl, body).map((res: Response) => res.json());
  }

  registration(usrdetails) {
    let url = this.config.getConfig().baseUrl;
    let registerUrl = this.config.getConfig().registrationUrl;
    let finalUrl = url + registerUrl;
    let body = usrdetails;
    return this.http.post(finalUrl, body).map((res: Response) => res.json());
  }
  forgotPassword(usrdetails) {
    let url = this.config.getConfig().baseUrl;
    let forgotUrl = this.config.getConfig().forgotPasswordUrl;
    let finalUrl = url + forgotUrl;
    let body = usrdetails;
    return this.http.post(finalUrl, body).map((res: Response) => res.json());
  }

  saveUuid() {
    let uuid;
    if (this.plt.is('cordova') && this.device.uuid != null) {
      uuid = this.device.uuid; //for device
    } else {
      uuid = '0tTYSsxBIGIXl7kxmCKTg123';
    }
    this.nativeStorage.setnativeStorage('uuid', { uuid: uuid });
  }

  facebookLogin() {

    let vm = this;
    return new Promise((resolve, reject) => {
      // vm.fb.login(['public_profile', 'user_friends', 'email'])
      vm.fb.login(['public_profile', 'email'])
        .then((res: any) => {

          vm.fb.api("/me?fields=name,email", [])
            .then(function (profile) {
              if (profile.email && profile.email != null || profile.email != undefined) {

                res.authResponse.email = profile.email;
                res.authResponse.displayName = profile.name;
                vm.socialLogin(res.authResponse, "facebook").subscribe((data) => {

                  resolve(data);
                }, (err) => {
                  console.log('Error logging', err);

                  reject(err);
                });
              }
              else {
                console.log('Email doesnt exist for this account');
                reject('No mail ID associated with this account. Please register or use Google to login');
              }

            })

        })
        .catch(e => console.log('Error logging into Facebook', e));
    });
  }

  googleLogin() {

    return new Promise((resolve, reject) => {
      this.googlePlus.login({
        scopes: "profile",
        webClientId:
        "169613011761-nr85vcuocqphq69k0q40aip9gv4m9j2h.apps.googleusercontent.com"
      })
        .then((res) => {

          this.socialLogin(res, "google").subscribe((data) => {

            resolve(data);
          }, (err) => {
            console.log('Error logging', err);
          });
        })
        .catch(e => console.log('Error logging into google', e));
    });
  }

  socialLogin(userData, provider) {

    let url = this.config.getConfig().baseUrl +
      this.config.getConfig().socialLoginUrl;
    let body = {
      "email": userData.email || " ",
      "name": userData.displayName || " ",
      "keepLogged": "1",
      "authtype": provider,
      "token": userData.accessToken || userData.idToken
    };
    return this.http.post(url, body).map((res: Response) => res.json());
  }

  acountinfo() {
    let url = this.config.getConfig().baseUrl;
    let acUrl = this.config.getConfig().accountinfoUrl;
    let finalUrl = url + acUrl;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }


  logout() {
    let provider = this.nativeStorage.getnativeStorage('provider');
    if (provider == 'google') {
      this.googlePlus.logout();      
    } else if (provider == 'facebook') {
      this.fb.logout();
    } 
    this.nativeStorage.clear();
  }

  listingPageData(listingDetails) {
    let url = this.config.getConfig().baseUrl;
    let listingUrl = this.config.getConfig().listingUrl;
    let finalUrl = url + listingUrl + '?' + listingDetails;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }


  pdpinfo(id) {
    let url = this.config.getConfig().baseUrl;
    let pdpUrl = this.config.getConfig().productUrl;
    let finalUrl = url + pdpUrl + '/' + id;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }

  addToBag(pid, qty) {
    let url = this.config.getConfig().baseUrl;
    let BagUrl = this.config.getConfig().addToBagUrl;
    let finalUrl = url + BagUrl + '?product_id=' + pid + '&selected_quantity=' + qty;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }

  manageWishlist(id) {
    var headers = new Headers();
    let url = this.config.getConfig().baseUrl;
    let WishListUrl = this.config.getConfig().wishlismanageturl;
    let finalUrl = url + WishListUrl + "?product_id=" + id;
    return this.http.get(finalUrl, { headers: headers }).map((res: Response) => res.json());
  }


  getWishlistItems() {
    var headers = new Headers();
    let url = this.config.getConfig().baseUrl;
    let WishListUrl = this.config.getConfig().wishlisturl;
    let finalUrl = url + WishListUrl;
    return this.http.get(finalUrl, { headers: headers }).map((res: Response) => res.json());
  }


  getSideNav() {
    let url = this.config.getConfig().baseUrl;
    let sidenav = this.config.getConfig().sidenav;
    let finalUrl = url + sidenav;
    var headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(finalUrl, { headers: headers });
  }
  similarProduct(pid) {
    let url = this.config.getConfig().baseUrl;
    let SimilarUrl = this.config.getConfig().similarProductUrl;
    let finalUrl = url + SimilarUrl + '/' + pid;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }
  popularProduct() {
    let url = this.config.getConfig().baseUrl;
    let PopularUrl = this.config.getConfig().popularProductUrl;
    let finalUrl = url + PopularUrl;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }
  newProduct() {
    let url = this.config.getConfig().baseUrl;
    let PopularUrl = this.config.getConfig().newarrivalUrl;
    let finalUrl = url + PopularUrl;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }
  eventProduct(event_id) {
    let url = this.config.getConfig().baseUrl;
    let EventUrl = this.config.getConfig().listingUrl;
    let finalUrl = url + EventUrl + '?event_id=' + event_id + '&storeId=2&filter_mode_active=true&colo=red&page=1';
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }

  getItemsInCart() {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().cartUrl;
    return this.http.get(url).map((res: Response) => res.json());
  }

  getCartCount() {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().cartCountUrl;
    return this.http.get(url).map((res: Response) => res.json());
  }

  updateCartItem(productId, quantity) {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().updateCartUrl + "?product_id= " + productId + "&update_quantity=" + quantity;
    return this.http.get(url).map((res: Response) => res.json());
  }

  removeCartItem(productId) {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().removeCartUrl + "?product_id= " + productId;
    return this.http.get(url).map((res: Response) => res.json());
  }

  getUserCredits() {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().getCredits;
    return this.http.get(url).map((res: Response) => res.json());
  }

  getMyOrders(orderDetails = '') {

    if (orderDetails != '') {
      let url = this.config.getConfig().baseUrl + this.config.getConfig().getOrders + '?order_id=' + orderDetails;
      return this.http.get(url).map((res: Response) => res.json());
    } else {
      let url = this.config.getConfig().baseUrl + this.config.getConfig().getOrders;
      return this.http.get(url).map((res: Response) => res.json());
    }
  }

  getGiftAmountData() {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().getGiftAmount;
    return this.http.get(url).map((res: Response) => res.json());
  }

  getInviteCode() {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().getInviteCode;
    return this.http.get(url).map((res: Response) => res.json());
  }

  applyCredits(credits) {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().applyCreditsUrl + "?credits=" + credits;
    return this.http.get(url).map((res: Response) => res.json());
  }

  removeAppliedCredits() {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().removeCreditsUrl;
    return this.http.get(url).map((res: Response) => res.json());
  }

  applyCoupon(coupon) {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().applyCouponUrl + "?promo_code=" + coupon;
    return this.http.get(url).map((res: Response) => res.json());
  }

  removeAppliedCoupon() {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().removeCouponUrl;
    return this.http.get(url).map((res: Response) => res.json());
  }

  tagKeyProduct(pid) {
    let url = this.config.getConfig().baseUrl;
    let tagkeywordUrl = this.config.getConfig().tagkeyUrl;
    let finalUrl = url + tagkeywordUrl + '?product_id=' + pid;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }

   getSuperCross(superurl)
  {
    let url = this.config.getConfig().baseUrl;
    let finalUrl =url+ superurl;
    return this.http.get(finalUrl).map((res: Response) => res.json());
 
  }
  getCrossSeller(banner)
  {
     let url = this.config.getConfig().baseUrl;
     let crossSellerUrl ="cross_selling?type_id="+ banner;
     let finalUrl = url +crossSellerUrl;
    return this.http.get(finalUrl).map((res: Response) => res.json());
 
  }
  getbannerwithCarousels(banner) {
    let url = this.config.getConfig().baseUrl;
    let finalUrl =url+ banner;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }
  popularProductsData() {
    let url = this.config.getConfig().baseUrl;
    let popularUrl = this.config.getConfig().popularProductUrl;
    let finalUrl = url + popularUrl;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }

  newArrivalProductsData() {
    let url = this.config.getConfig().baseUrl;
    let newarrivalUrl = this.config.getConfig().newarrivalUrl;
    let finalUrl = url + newarrivalUrl;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }

  getFilterData(listingDetails) {
    let url = this.config.getConfig().baseUrl;
    let listingUrl = this.config.getConfig().listingUrl;
    let finalUrl = url + listingUrl + '?' + listingDetails;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }
  getShopAllEvent() {
    let url = this.config.getConfig().baseUrl;
    let shopallUrl = this.config.getConfig().eventUrl;
    let finalUrl = url + shopallUrl;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }

  getCompleteThelook(pid) {
    let url = this.config.getConfig().baseUrl;
    let completeUrl = this.config.getConfig().completethelookUrl;
    let finalUrl = url + completeUrl + '/' + pid;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }


  getSavedAddresses() {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().getAddressUrl;
    return this.http.get(url).map((res: Response) => res.json());
  }
  deleteSavedAddresses(id) {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().deleteAddress;
    let data = {
      "customer_address_id": id
    }
    return this.http.post(url, data).map((res: Response) => res.json());
  }

  placeOrderApi(data) {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().checkoutUrl;
    return this.http.post(url, data).map((res: Response) => res.json())
      .catch((err) => {
        // Do messaging and error handling here
        return Observable.throw(err)
      })
  }

  cancelOrderApi(txnId) {
    let headers = new Headers();
    if (this.plt.is('ios')) {
      headers.append("x-jyp-app", "ios");
    } else if (this.plt.is('android')) {
      headers.append("x-jyp-app", "android");
    }
    headers.append("x-jyp-store", "2");
    let url = this.config.getConfig().baseUrl + this.config.getConfig().cancelOrderUrl + txnId;
    return this.http.post(url, { headers: headers }).map((res: Response) => res.json());
  }

  changeOrderStatus(data) {

    let url = this.config.getConfig().baseUrl + this.config.getConfig().changeOrderStatus;

    return this.http.post(url, data).map((res: Response) => res.json());
  }


  getCountrys() {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().countrysUrl;
    return this.http.get(url).map((res: Response) => res.json());
  }

  getStates(id) {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().countrysUrl + "?country_id=" + id;
    return this.http.get(url).map((res: Response) => res.json());
  }

  isLoggedIn() {
    let token = this.nativeStorage.getnativeStorage('token');
    let user = this.nativeStorage.getnativeStorage('user');
    let isUserLoggedIn;

    if (user && token) {

      isUserLoggedIn = true;
    } else {
      isUserLoggedIn = false;

    }
    return isUserLoggedIn;
  }

  getAutoSuggestData(val) {
    let url = this.config.getConfig().baseUrl;
    let newarrivalUrl = this.config.getConfig().autoSuggest;
    let finalUrl = url + newarrivalUrl + '?sterm=' + val;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }
  getCoponentsinfo(pid) {
    let url = this.config.getConfig().baseUrl;
    let CoponentsinfoUrl = this.config.getConfig().CoponentsUrl;
    let finalUrl = url + CoponentsinfoUrl + '/' + pid;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }

  getShopByData() {
    let url = this.config.getConfig().baseUrl;
    let newarrivalUrl = this.config.getConfig().shopBy;
    let finalUrl = url + newarrivalUrl;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }

  getGiftCardData() {
    let url = this.config.getConfig().baseUrl;
    let newarrivalUrl = this.config.getConfig().giftCard;
    let finalUrl = url + newarrivalUrl;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }

  redeemGiftCard(code) {
    let url = this.config.getConfig().baseUrl +
      this.config.getConfig().redeemGiftUrl + "?voucher_code=" + code;
    return this.http.get(url).map((res: Response) => res.json());
  }


  getData() {
    let url = this.config.getConfig().baseUrl;
    return this.http.get(url);
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('a20e6aca-ee83-44bc-8033-b41f3078c2b6:c199f9c8-0548-4be79655-7ef7d7bf9d20'));
  }

  getMenuData() {
    let url = this.config.getConfig().baseUrl;
    let menuUrl = this.config.getConfig().menuUrl;
    let finalUrl = url + menuUrl;

    var headers = new Headers();
    this.createAuthorizationHeader(headers);
    /*      headers.append('Access-Control-Allow-Origin','*')
    headers.append('Content-Type', 'text/json');
    headers.append('x-jyp-uuid', 'ZF/FXITpg7GGZ6Mk1M3IUg==');      */

    return this.http.get(finalUrl, { headers: headers });

  }

  recentView(pid) {
    let url = this.config.getConfig().baseUrl;
    let recentview_detailsUrl = this.config.getConfig().recentview_details_before_loginUrl;
    let finalUrl = url + recentview_detailsUrl + "?product_id=" + pid;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }

  payPalEnviromentSetUp() {
    let payPalEnviroments = {};
    payPalEnviroments['PayPalEnvironmentProduction'] = '';
    payPalEnviroments['PayPalEnvironmentSandbox'] = 'AXg409-ZD7lFcgk2JdHkLkggX8u7LnT7cfkGL2AG0y7bx5OAvOmErpKKz5D68kzXRxbfe_KRlFf681rk';
    return payPalEnviroments;
  }
  getCouponInfo() {
    let url = this.config.getConfig().baseUrl;
    let getCouponUrlinfo = this.config.getConfig().getCouponUrl;
    let finalUrl = url + getCouponUrlinfo;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }


  getHomeImage() {
    let url = this.config.getConfig().baseUrl;
    let homeimageurl = this.config.getConfig().homeimageurl;
    let finalUrl = url + homeimageurl;

    var headers = new Headers();
    this.createAuthorizationHeader(headers);
    /*      headers.append('Access-Control-Allow-Origin','*')
    headers.append('Content-Type', 'text/json');
    headers.append('x-jyp-uuid', 'ZF/FXITpg7GGZ6Mk1M3IUg==');      */

    return this.http.get(finalUrl, { headers: headers });

  }

  TermsAndCondtion() {
    let url = this.config.getConfig().baseUrl;
    let TermsAndCondtionurl = this.config.getConfig().TermsAndCondtionurl;
    let finalUrl = url + TermsAndCondtionurl;
    var headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(finalUrl, { headers: headers });

  }

  contactUs() {

    let url = this.config.getConfig().baseUrl;
    let contactUsurl = this.config.getConfig().TermsAndCondtionurl;
    let finalUrl = url + contactUsurl + "?pageType=contact_us";
    var headers = new Headers();
    this.createAuthorizationHeader(headers);
    // headers['pageType']='contact_us';
    return this.http.get(finalUrl, { headers: headers });
  }

  Privacy() {
    let url = this.config.getConfig().baseUrl;
    let privacyurl = this.config.getConfig().privacyurl;
    let finalUrl = url + privacyurl;
    var headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(finalUrl, { headers: headers });

  }

  internetLoging(data) {

    let url = this.config.getConfig().baseUrl + this.config.getConfig().ajaxLoging;
    return this.http.post(url, data).map((res: Response) => res.json());

  }

  checkSKU(pid) {
    let url = this.config.getConfig().baseUrl;
    let skuUrl = this.config.getConfig().validateSKU;
    let finalUrl = url + skuUrl + '?sku=' + pid;
    return this.http.get(finalUrl).map((res: Response) => res.json());
  }
  getQrHistory(data) {
    let url = this.config.getConfig().baseUrl;
    let skuUrl = this.config.getConfig().qrHistory;
    let finalUrl = url + skuUrl;
    return this.http.post(finalUrl, data).map((res: Response) => res.json());    
  }

  orderPlacedFeed(orderFeed) {
    let data = orderFeed;
    let url = this.config.getConfig().baseUrl;
    let orderfeedUrl = this.config.getConfig().betaoutOrderFeed;
    let finalUrl = url + orderfeedUrl;
    return this.http.post(finalUrl, JSON.stringify(data)).map((res: Response) => res.json());  
  }

  crossSelling(data) {
    let url = this.config.getConfig().baseUrl + this.config.getConfig().crossSellingUrl;
    return this.http.post(url, data).map((res: Response) => res.json());
  } 

  sendMsg(number, message) {
    let url = 'http://www.myvaluefirst.com/smpp/sendsms?username=Jayporehttp&password=jaypore12&to=' + number + '&from=JAYPOR&text=' + message + '.';

    return this.http.get(url).map((res: Response) => res.text());
  }

  tinyURL(url){
    let finalUrl = 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyDg0cUGtx5l6K6CaT7G3yXDasKPOfDGcCM';        
    return this.http.post(finalUrl, {longUrl:url}).map((res: Response) => res.json());  
  }
}
