import { Injectable } from '@angular/core';
import { Platform } from "ionic-angular";

@Injectable()
export class ConstantsProvider {

  public appConfig: any;
  public paymentkey: any;
  public gaKey: any;
  public toastConfig: any;

  constructor(public platform: Platform) {

  }

  getConfig() {
    this.appConfig = {
      tncUrl: "https://www.jaypore.com/terms.php",
      // baseUrl: "http://api.jaypore.com/index.php/",
      hostURL: "https://www.jaypore.com/",
      baseUrl: "https://api.jaypore.com/index.php/", //for NTest Build
      // baseUrl: "http://ntest-api.jaypore.com/index.php/",
      // baseUrl: "http://staging-api.jaypore.com/index.php/",
      loginUrl: "login",
      tokenUrl: "secure/init",
      registrationUrl: "register",
      forgotPasswordUrl: "forgot_password",
      menuUrl: "allCategories",
      socialLoginUrl: "social_login",
      accountinfoUrl: "account_info",
      productUrl: "products",
      addToBagUrl: "checkout/add_to_bag",
      similarProductUrl: "products/similar",
      //listingUrl: 'solarAppFilter',
      listingUrl: 'webfilterApp',
      cartUrl: "cart",
      updateCartUrl: "checkout/update_bag",
      removeCartUrl: "checkout/remove_from_bag",
      getCredits: "credit_info",
      applyCreditsUrl: "apply_credit",
      removeCreditsUrl: "remove_credit",
      applyCouponUrl: "apply_promo",
      removeCouponUrl: "remove_promo",
      getAddressUrl: 'getAddress',
      deleteAddress: 'deleteaddress',
      checkoutUrl: 'checkout/order',
      popularProductUrl: 'products_popular',
      newarrivalUrl: "products_new",
      tagkeyUrl: "categorytag",
      eventUrl: "events",
      completethelookUrl: "product/completethelook",
      countrysUrl: "country_details",
      autoSuggest: "filter/getSuggetions",
      shopBy: "component/search",
      CoponentsUrl: "component",
      recentview_details_before_loginUrl: "recentview_details_before_login",
      cancelOrderUrl: 'checkout/cancle/',
      changeOrderStatus: 'checkout/updateorder',
      getInviteCode: "refferal_code",
      getOrders: "orders",
      giftCard: "component/giftcart",
      getGiftAmount: "giftamounts",
      giftUrl: "giftcart/request",
      giftUrlUpdate: "giftcart/success",
      redeemGiftUrl: "redeem/voucher",
      cartCountUrl: "getCartProductCount",
      homeimageurl: 'getDesktopImg',
      wishlisturl: 'wishlist',
      wishlismanageturl: 'managewishlist',
      TermsAndCondtionurl: 'termdata',
      privacyurl: 'privacydata',
      getCouponUrl: "mycoupon",
      ajaxLoging: "ajaxLoging",
      sidenav: 'sidenav',
      validateSKU: 'validateproduct',
      qrHistory: 'qrhistory',
      betaoutOrderFeed: 'betaout/order',
      api_key: 'tekjljw4m4lhq9yswaq4v3y4yhwu3sn4t472k1t4bo', //betaout production api-key
      project_id: '34746', //betaout production project id
      betaoutFlag: true, //Enable-Disable flag
      crossSellingUrl: 'staquCrossSelling',
      smsUsername: 'Jayporehttp',
      smsPassword: 'jaypore12',
    };

    return this.appConfig;
  }

  getStore() {
    this.appConfig = {
      xjypstore: "2",
      componentRetryTime: "5",
    }
    return this.appConfig;
  }

  getPaymentKey() {
    //live
    this.paymentkey = "rzp_live_LPpG5imOmpphpP";
    //test
    //this.paymentkey = "rzp_test_gcZxmwYYOcgLKJ";
    return this.paymentkey;
  }

  getGaKey() {
    if (this.platform.is('ios')) {
      this.gaKey = 'UA-35906572-7';
    } else {
      this.gaKey = 'UA-35906572-6';
    }
    return this.gaKey;
  }

  toastMsg() {
    this.toastConfig = {

      noInternet: 'Please check your internet connection.',
      productAlreadyInCart: 'This product already exists in your cart.',
      productOutOffStock: 'Product is out of stock, you can checkout similar products below',
      productNotAvailable: 'Retry another product',
      closeApp: 'Press again to exit Jaypore',
      loginRegistration: 'Please login to use this feature.',
      apiNotRespondingOrTimeOut: 'Oops! Something went wrong. Try again',
      removeProductMsg: "This product has been successfully removed from cart.",
      giftCartSuccessPaymentsError: 'Some error occurred. Please try again.',
      loginWithNotRegisteredEmailID: 'This email does not exist. Please check in case of any typos or create a new account.',
      productMoveFromWishListToCart: "The product has successfully been moved from your wishlist to cart.",
      copyCoupon: 'Coupon copied successfully.',
      cartItemsChanges: 'Your cart has been updated.',
      cameraPermissionChangeMsg: "Please use your phone's settings to enable permission for accessing the Camera and restart the app",
      productQrScanDoesNotExist: 'The product you are scanning does not exist on Jaypore.',
      msgSent: 'Message  sent successfully',
      msgNotSent: 'Oops! Something went wrong. Please try again.'

    };
    return this.toastConfig;
  }


}
