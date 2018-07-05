import { Injectable } from '@angular/core';
import {
  Http,
  ConnectionBackend,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  Headers,
  Request,
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { ConstantsProvider } from '../constants/constants';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { Platform } from 'ionic-angular';

@Injectable()
export class HttpInterceptorProvider extends Http {

  constructor(
    backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private plt: Platform,
    private storage: LocalStorageProvider,
    private constant: ConstantsProvider
  ) {
    super(backend, defaultOptions);
  }

  /**
   * Request options.
   * @param options
   * @returns {RequestOptionsArgs}
   */
  request(url: any | Request, options?: RequestOptionsArgs): Observable<Response> {

    // console.log(Request);

    let token = this.storage.getnativeStorage('token');
    let uuid = this.storage.getnativeStorage('uuid');
    let storeID = this.constant.getStore().xjypstore;

    if (!uuid) {
      uuid = {
        uuid: '0tTYSsxBIGIXl7kxmCKTg123'
      }
    }
    if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
      if (!options) {
        // let's make option object
        options = { headers: new Headers() };
      }
      if (token != '') {
        //options.headers.set('Authorization', `Bearer ${token}`);
      }
    } else {
      if (uuid) {
        url.headers.set('x-jyp-uuid', uuid.uuid);
      }
      if (this.plt.is('ios')) {
        url.headers.append("x-jyp-app", "ios");
      } else if (this.plt.is('android')) {
        url.headers.append("x-jyp-app", "android");
      }
      if (token) {
        url.headers.set('x-jyp-token', token.token);
      }  
      url.headers.set('x-jyp-store', storeID);
      url.headers.set('Access-Control-Allow-Origin', '*');
      url.headers.set('Content-Type', 'application/json');
      //url.headers.set('x-jyp-test',true);      
    }


    if (url['url'] == 'http://dev-api.jaypore.com/index.php/checkout/order') {

      return this.intercept(super.request(url, options).timeout(50000), url['url']);

    } else if (url['url'] == 'http://ntest-api.jaypore.com/index.php/register') {

      return this.intercept(super.request(url, options).timeout(50000), url['url']);

    } else if (url['url'] == 'http://api.jaypore.com/index.php/checkout/order') {

      return this.intercept(super.request(url, options), url['url'])
        .catch(this.handleError)
        
    } else {
      return this.intercept(super.request(url, options).timeout(20000), url['url']);
    }


  }

  public handleError = (error: Response) => {
    return Observable.throw(error)
  }

  post(url: string, body: any, options?: RequestOptionsArgs, noIntercept?: boolean): Observable<Response> {

    return this.intercept(super.post(url, body, options), url);
  }

  put(url: string, body: any, options?: RequestOptionsArgs, noIntercept?: boolean): Observable<Response> {

    return this.intercept(super.put(url, body, options), url);
  }
  get(url: string, options?: RequestOptionsArgs, noIntercept?: boolean): Observable<Response> {

    return this.intercept(super.get(url, options), url);
  }

  intercept(observable: Observable<Response>, url): Observable<Response> {

    if (this.storage.getnativeStorage('ajax_url') == undefined) {
      let objData = {};
      this.storage.setnativeStorage('ajax_url', objData);
    }

    return observable.catch((err, source) => {
      if (err.name == "TimeoutError") {
        err.error = true;
        err.message = "Some error occured. Please try again."
        if (url != undefined) {
          console.log("TimeoutError");
          this.localAjaxStorage(url);
        }

        return Observable.throw(err);
      }
      if (err.status == 401) {
        if (url != undefined) {
          console.log("error 401");
          this.localAjaxStorage(url);
        }
        return Observable.empty();
      } else {

        return Observable.throw(err);
      }
    })
      .do((res: Response) => {

        return Observable.throw(res);

      }, (err: any) => {
        console.log("Caught error: " + err);
      })
      .finally(() => {
        console.log("Finally.. delaying, though.");

      });

  }

  localAjaxStorage(url) {

    let data = {};
    data = this.storage.getnativeStorage('ajax_url');
    console.log("data" + JSON.stringify(data));
    if (data[url] != undefined) {
      data[url] = data[url] + 1;
      this.storage.setnativeStorage('ajax_url', data);
    } else {
      data[url] = 1;
      this.storage.setnativeStorage('ajax_url', data);
    }

  }

}
