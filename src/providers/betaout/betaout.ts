import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { LocalStorageProvider, AppServiceProvider, ConstantsProvider } from '../../providers/providers';
import { BrowserModule } from '@angular/platform-browser';
declare var cordova;

@Injectable()
export class BetaoutProvider {

  constructor(
    public http: Http,
    public platform: Platform,
    private AppService: AppServiceProvider,
    public nativeStorage: LocalStorageProvider,
    public constants: ConstantsProvider,
  ) {
    console.log('Hello BetaoutProvider');

  }

  setCustomerProperties() {

    console.log("setCustomerProperties");
    if (this.constants.getConfig().betaoutFlag === true) {
      if (this.nativeStorage.getnativeStorage('user') != undefined) {
        let userData = this.nativeStorage.getnativeStorage('user');
        let vm = this;
        console.log("betaout cistomer details");
        console.log(userData);
        console.log(this.nativeStorage.getnativeStorage('betaout-setCustomerId'));
        console.log(userData['customer_id']);

        if (this.nativeStorage.getnativeStorage('betaout-setCustomerId') != null) {

          if (this.nativeStorage.getnativeStorage('betaout-setCustomerId') != userData['customer_id']) {
            console.log("IF :: Set user to betaout");
            cordova.plugins.Betaout.setCustomerId(userData['customer_id'],
              function success(res) {
                console.log("setCustomerId");
                console.log(userData);
                vm.nativeStorage.setnativeStorage('betaout-setCustomerId', userData['customer_id']);
              }, function error() {
                console.log("Not setCustomerId");
              }
            );

            cordova.plugins.Betaout.setCustomerEmail(userData['email_id'],
              function success(res) {
                console.log("setCustomerEmail");
              }, function error() {
                console.log("Not setCustomerEmail");
              }
            );

            cordova.plugins.Betaout.setCustomerPhone((userData['telephone'] ? userData['telephone'] : ""),
              function success(res) {
                console.log("setCustomerPhone");
              }, function error() {
                console.log("Not setCustomerPhone");
              }
            );

            let name = (userData['first_name'] ? userData['first_name'] : "") + "" + (userData['last_name'] ? userData['last_name'] : "");

            cordova.plugins.Betaout.updateUserProperties(
              [{ "name": "bucket_id", "value": (userData['batch_id'] ? userData['batch_id'] : "100") }, { "name": "fullname", "value": name }],
              function success(res) {
                console.log("bucket_id success");
                console.log(res);
              }, function error(err) {
                console.log("bucket_id fail");
                console.log(err);
              }
            );

          } else {
            console.log("ELSE CASE");
            this.addUserDetailBetaout(userData);
          }
        } else {
          console.log("Set user to betaout 1");
          this.addUserDetailBetaout(userData);
        }

      }
    }

  }

  addUserDetailBetaout(userData) {
    if (this.constants.getConfig().betaoutFlag === true) {
      let vm = this;
      cordova.plugins.Betaout.setCustomerId(userData['customer_id'],
        function success(res) {
          console.log("setCustomerId");
          console.log(res);
          vm.nativeStorage.setnativeStorage('betaout-setCustomerId', userData['customer_id']);
        }, function error(err) {
          console.log("Not setCustomerId");
          console.log(err);
        }
      );

      cordova.plugins.Betaout.setCustomerEmail(userData['email_id'],
        function success(res) {
          console.log("setCustomerEmail");
          console.log(res);
        }, function error(err) {
          console.log("Not setCustomerEmail");
          console.log(err);
        }
      );

      cordova.plugins.Betaout.setCustomerPhone((userData['telephone'] ? userData['telephone'] : ""),
        function success(res) {
          console.log("setCustomerPhone");
          console.log(res);
        }, function error(err) {
          console.log("Not setCustomerPhone");
          console.log(err);
        }
      );

      let name = (userData['first_name'] ? userData['first_name'] : "") + "" + (userData['last_name'] ? userData['last_name'] : "");

      cordova.plugins.Betaout.updateUserProperties(
        [{ "name": "bucket_id", "value": (userData['batch_id'] ? userData['batch_id'] : "100") }, { "name": "fullname", "value": name }],
        function success(res) {
          console.log("bucket_id success");
          console.log(res);
        }, function error(err) {
          console.log("bucket_id fail");
          console.log(err);
        }
      );
    }
  }


  updateUserProperty(data) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(data);
      cordova.plugins.Betaout.updateUserProperties(
        data,// JSONArray properties,
        function success(res) {
          console.log("updateUserProperties success");
          console.log(res);
        }, function error(err) {
          console.log("updateUserProperties fail");
          console.log(err);
        }
      );
    }
  }

  updateUserPhone(phone) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(phone);
      cordova.plugins.Betaout.setCustomerPhone(phone,
        function success(res) {
          console.log("updateCustomerPhone");
          console.log(res);
        }, function error(err) {
          console.log("Not updateCustomerPhone");
          console.log(err);
        }
      );
    }
  }

  viewProduct(viewedProduct) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(viewedProduct);
      console.log(viewedProduct.category_name);
      cordova.plugins.Betaout.viewProduct(
        viewedProduct.id, // productId
        viewedProduct.final_price, // productPrice
        viewedProduct.brand_name, // productBrand 
        viewedProduct.name,
        (viewedProduct.gallery.thumbnail ? viewedProduct.gallery.thumbnail : ""),
        "/",
        viewedProduct.quantity,
        viewedProduct.sku,
        '',
        '',
        [],
        0,
        0,
        0,
        0,
        [],
        [],
        [{ "name": "category_name", "value": viewedProduct.category_name }],
        [],
        function success(res) {
          console.log("viewProduct success call");

        }, function error(err) {
          console.log('viewProduct erro');
          console.log(err);
        }
      );
    }
  }

  getCartItems() {
    if (this.constants.getConfig().betaoutFlag === true) {
      this.AppService.getItemsInCart().subscribe(
        (res) => {
          if (res && res.error) {
          } else if (res && !res.error) {
            console.log(res);
            return res;
          }
        },
        (err) => {
          console.log(err);
        });
    }
  }


  productAddedInCart(data) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(data.productIdAdded);
      this.AppService.getItemsInCart().subscribe(
        (res) => {
          if (res && res.error) {
          } else if (res && !res.error) {
            console.log(res);
            data.sel_qty = (data.sel_qty ? data.sel_qty : 1);
            var productIdSku = '';
            var productId = '';
            if (data.productIdAdded && data.productIdAdded != '') {
              productId = data.productIdAdded;
              data.child_products.collection.forEach((childProducts) => {
                if (childProducts.id == data.productIdAdded) {
                  productIdSku = childProducts.sku;
                }
              });
            } else {
              productIdSku = data.sku;
              productId = data.id;
            }
            console.log(productIdSku, productId);
            cordova.plugins.Betaout.addToCart(
              res.data.subTotal,
              res.data.grandTotal,
              'INR',
              '/',
              '',
              '',
              productId, //String productId
              data.final_price, //double productPrice,
              data.brand_name, // String productBrand
              data.name, // String productName
              (data.gallery.thumbnail ? data.gallery.thumbnail : ""), //String productImageUrl,
              '/', //String productUrl
              data.sel_qty, //int productQuantity,
              productIdSku, //String productSku
              '', //String productGroupId
              '', //String productGroupName, 
              [], //JSONArray productTags
              0.01, //double productDiscount,
              0.01, //double productMargin
              0.01,// double productOldPrice
              0.01, //double productCostPrice,
              [], //JSONArray productSpecs,
              [], //JSONArray productCategories
              [], //JSONArray appendProperties,
              [{ "name": "category_name", "value": data.category_name }], //JSONArray updateProperties
              function success(res) {
                console.log("productAddedInCart success call");
              },
              function error(err) {
                console.log('productAddedInCart erro');
                console.log(err);
              }
            );
          }
        },
        (err) => {
          console.log(err);
        });

      console.log(data);
    }
  }

  updateProductToCart(data, cartDetail) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(data);
      console.log(cartDetail.data.subTotal, cartDetail.data.grandTotal);
      cordova.plugins.Betaout.updateCart(
        cartDetail.data.subTotal, //double cartTotal, 
        cartDetail.data.grandTotal, //double cartRevenue, 
        'INR', //String cartCurrency,
        '/', //String cartAbandonUrl, 
        '', //String cartDeeplinkIOS,
        '', //String cartDeeplinkAndroid, 
        data.product_id, //String productId, 
        data.final_price, //double productPrice,
        data.brand_name, //String productBrand, 
        data.name, //String productName, 
        '', //String productImageUrl,
        '', //String productUrl, 
        data.quantity, //int productQuantity, 
        data.sku, //String productSku, 
        '', //String productGroupId,
        '', //String productGroupName, 
        [], //JSONArray productTags, 
        0.01, //double productDiscount,
        0.01, //double productMargin, 
        0.01, //double productOldPrice, 
        0.01, //double productCostPrice,
        [], //JSONArray productSpecs, 
        [], //JSONArray productCategories, 
        [], //JSONArray appendProperties,
        [], //JSONArray updateProperties, 
        function success(res) {
          console.log("updateProductToCart success call");
        },
        function error(err) {
          console.log('updateProductToCart erro');
          console.log(err);
        }
      );
    }
  }

  productRemovedFromCart(data, cartDetail) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(data);
      console.log(cartDetail.data.subTotal, cartDetail.data.grandTotal);
      cordova.plugins.Betaout.removeFromCart(
        cartDetail.data.subTotal, //double cartTotal, 
        cartDetail.data.grandTotal, //double cartRevenue, 
        'INR', //String cartCurrency,
        '/', //String cartAbandonUrl, 
        '', //String cartDeeplinkIOS,
        '', //String cartDeeplinkAndroid, 
        data.product_id, //String productId,
        data.final_price, //double productPrice,
        data.brand_name,  //String productBrand, 
        data.name,  //String productName, 
        '/', //String productImageUrl,
        '', //String productUrl, 
        data.quantity, //int productQuantity, 
        data.sku, //String productSku, 
        '', //String productGroupId,
        '', //String productGroupName, 
        [], //JSONArray productTags, 
        0.01, //double productDiscount,
        0.01, //double productMargin, 
        0.01, //double productOldPrice, 
        0.01, //double productCostPrice,
        [], //JSONArray productSpecs, 
        [], //JSONArray productCategories, 
        [], //JSONArray appendProperties,
        [{ "name": "category_name", "value": data.category }], //JSONArray updateProperties, 
        function success(res) {
          console.log("productRemovedFromCart success call");

        }, function error(err) {
          console.log('productRemovedFromCart erro');
          console.log(err);
        }

      );
    }
  }

  proceedToShipping(data) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(data);
      cordova.plugins.Betaout.logEvent(
        'proceed_to_shipping', //String event, 
        data,  //JSONArray appendProperties, 
        [], //JSONArray updateProperties, 

        function success(res) {
          console.log("proceedToShipping success call");

        }, function error(err) {
          console.log('proceedToShipping erro');
          console.log(err);
        }
      );
    }
  }

  checkoutStarted(data) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(data);
      cordova.plugins.Betaout.logEvent(
        'checkout_started', //String event, 
        data,  //JSONArray appendProperties, 
        [], //JSONArray updateProperties, 

        function success(res) {
          console.log("checkoutStarted success call");

        }, function error(err) {
          console.log('checkoutStarted erro');
          console.log(err);
        }
      );
    }
  }

  checkoutCompleted(data) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(data);
      cordova.plugins.Betaout.logEvent(
        'checkout_completed', //String event, 
        data,  //JSONArray appendProperties, 
        [], //JSONArray updateProperties, 

        function success(res) {
          console.log("checkoutCompleted success call");

        }, function error(err) {
          console.log('checkoutCompleted erro');
          console.log(err);
        }
      );
    }
  }

  orderPlaced(data) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(data);
      console.log(data.subTotal, data.grandTotal);
      cordova.plugins.Betaout.orderPlaced(
        data.subTotal, //double cartTotal, 
        data.grandTotal, //double cartRevenue, 
        'INR', //String cartCurrency,
        '',//String cartAbandonUrl, 
        '', //String cartDeeplinkIOS, 
        '', //String cartDeeplinkAndroid,
        data.products, //JSONArray products, 
        data.order_id, //String orderId, 
        0.01,//data.total_cart_value, //double orderTotal, 
        0.01, //double orderRevenueFromCart,
        'INR', //String orderCurrency, 
        'confirmed',//String orderStatus, 
        data.payment_mode, //String orderMethodOfPayment,
        data.orderCouponCode, //String orderCouponCode, 
        data.shipping_price, //double orderShippingCharges, 
        0.01, //double orderTax,
        data.total_discount, //double orderDiscount, 
        data.payment_mode, //String orderShippingMethod,
        [], //JSONArray customProperties, 
        [], //JSONArray appendProperties, 
        [], //JSONArray updateProperties,
        function success(res) {
          console.log("orderPlaced success call");

        }, function error(err) {
          console.log('orderPlaced erro');
          console.log(err);
        }

      );
    }
  }

  logout() {
    if (this.constants.getConfig().betaoutFlag === true) {
      cordova.plugins.Betaout.logout(
        function success(res) {
          console.log("logout success call");
        },
        function error(err) {
          console.log('logout erro');
          console.log(err);
        }
      );
    }
  }

  eventViewed(data) {
    console.log(data);
    if (this.constants.getConfig().betaoutFlag === true) {
      
      cordova.plugins.Betaout.logEvent(
        'event_viewed', //String event, 
        data,  //JSONArray appendProperties, 
        [], //JSONArray updateProperties,  
        function success(res) {
          console.log("eventViewed success call");
        },
        function error(err) {
          console.log('eventViewed erro');
          console.log(err);
        }
      );
    } 
  } 

  specialPage(data) {
    console.log(data);
    if (this.constants.getConfig().betaoutFlag === true) {
      cordova.plugins.Betaout.logEvent(
        'special_page', //String event, 
        data,  //JSONArray appendProperties, 
        [], //JSONArray updateProperties,  
        function success(res) {
          console.log("specialPage success call");
        },
        function error(err) {
          console.log('specialPage erro');
          console.log(err);
        }
      );
    }
  } 

  categoryViewed(data) {
    console.log(data);
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(data);
      cordova.plugins.Betaout.logEvent(
        'category_viewed', //String event, 
        data,  //JSONArray appendProperties, 
        [], //JSONArray updateProperties, 
        function success(res) {
          console.log("categoryViewed success call");
        },
        function error(err) {
          console.log('categoryViewed erro');
          console.log(err);
        }
      );
    }
  }

  brandViewed(data) {
    console.log(data);
    if (this.constants.getConfig().betaoutFlag === true) {
      cordova.plugins.Betaout.logEvent(
        'brand_viewed', //String event, 
        data,  //JSONArray appendProperties, 
        [], //JSONArray updateProperties, 
        function success(res) {
          console.log("brandViewed success call");
        },
        function error(err) {
          console.log('brandViewed erro');
          console.log(err);
        }
      );
    }
  }

  searchQuery(data) {
    console.log(data);
    if (this.constants.getConfig().betaoutFlag === true) {
      cordova.plugins.Betaout.logEvent(
        'search_query', //String event, 
        data,  //JSONArray appendProperties, 
        [], //JSONArray updateProperties, 
        function success(res) {
          console.log("searchQuery success call");
        },
        function error(err) {
          console.log('searchQuery erro');
          console.log(err);
        }
      );
    }
  }

  sort(data) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(data);
      cordova.plugins.Betaout.logEvent(
        'sort', //String event, 
        data,  //JSONArray appendProperties, 
        [], //JSONArray updateProperties, 
        function success(res) {
          console.log("sort success call");
        },
        function error(err) {
          console.log('sort erro');
          console.log(err);
        }
      );
    }
  }

  filter(data) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(data);
      cordova.plugins.Betaout.logEvent(
        'filter', //String event, 
        data,  //JSONArray appendProperties, 
        [], //JSONArray updateProperties, 

        function success(res) {
          console.log("filter success call");

        }, function error(err) {
          console.log('filter erro');

          console.log(err);
        }
      );
    }
  }

  emptyCart(data) {
    if (this.constants.getConfig().betaoutFlag === true) {
      console.log(data);
      cordova.plugins.Betaout.clearCart(
        0.01, // double cartTotal, 
        0.01, //double cartRevenue, 
        'INR', //String cartCurrency,
        '', //String cartAbandonUrl, 
        '', //String cartDeeplinkIOS, 
        '', //String cartDeeplinkAndroid,
        [], //JSONArray appendProperties, 
        [], //JSONArray updateProperties

        function success(res) {
          console.log("emptyCart success call");

        }, function error(err) {
          console.log('emptyCart erro');
          console.log(err);
        }

      );
    }
  }


}
