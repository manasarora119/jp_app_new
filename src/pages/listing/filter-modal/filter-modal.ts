import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import {
  TosterserviceProvider, LocalStorageProvider, ValidationServiceProvider
} from '../../../providers/providers';
import { Validators, FormBuilder } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';
@IonicPage()
@Component({
  selector: 'page-filter-modal',
  templateUrl: 'filter-modal.html',
})
export class FilterModalPage {
  public errorTrue: any = false;
  KeyboardStatus: number = 0;
  public isKeyboardShown: any = false;
  ppApply: boolean = false;
  maxPrice: any;
  minPrice: any;
  priceRange: any;
  public options: any;
  public optionsFilter: any;
  public filterData: any;
  public category: string = '';
  public active: string = '';
  public filterCheckedData: any;
  filterCheckedDataTemp: any;
  public dotArray: any;
  internetflag: any;
  fromAmt: any; // Default is 0
  toAmt: any; // Default is 0
  public priceClear: boolean = true;

  constructor(public toasterCtrl: TosterserviceProvider, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public events: Events,
    public nativeStorage: LocalStorageProvider, private formBuilder: FormBuilder,
    public keyboard: Keyboard,
  ) {
    this.priceRange = this.formBuilder.group({
      fromAmt: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9]*')])],
      toAmt: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9]*')])]
    });

    this.filterData = this.navParams.get('filters');
    console.log('this.filterData..', this.filterData);
    if (this.filterData.error != true) {
      if (this.filterData.data.filters) {
        for (var key in this.filterData.data.filters) {
          if (this.filterData.data.filters[key].options.length) {
            this.category = this.filterData.data.filters[key].id;
            this.options = this.filterData.data.filters[key].options;
            //sort by size label
            if (this.filterData.data.filters[key].id == 'size') {
              var filterSortedArr = this.sortArr(this.filterData.data.filters[key].options);
              this.options = filterSortedArr;
            }
            this.optionsFilter = this.options;
            this.active = this.filterData.data.filters[key].id;
            break;
          }
        }
        for (var key in this.filterData.data.filters) {
          if (this.filterData.data.filters[key].minPrice) {
            this.minPrice = this.filterData.data.filters[key].minPrice;
            this.maxPrice = this.filterData.data.filters[key].maxPrice;
            // this.toAmt = this.maxPrice;
            console.log(this.filterData.data.filters[key].minPrice, '---', this.minPrice);
            console.log(this.filterData.data.filters[key].maxPrice, '---', this.maxPrice);
          }
        }
      }
    }
    for (var key1 in this.filterData.data.filters) {
      if (!this.filterData.data.filters[key1].options) {
        this.filterData.data.filters[key1].options = [];
      }
    }
    this.filterCheckedData = this.navParams.get('filterCheckedData');

    this.filterCheckedDataTemp = JSON.stringify(this.filterCheckedData);
    this.filterCheckedDataTemp = JSON.parse(this.filterCheckedDataTemp);
    this.dotArray = [];
    for (var key2 in this.filterCheckedData) {
      if (this.filterCheckedData[key2].length > 0) {
        this.dotArray.push(key2);
      }
    }
    this.nativeStorage.setnativeStorage('modalStatus', '6');
    this.events.subscribe('dismiss6', () => {
      this.dismisss();
    });
    let vav = this.filterCheckedData.price.length ? this.filterCheckedData.price[0] : null;
    if (this.filterCheckedData.fPrice) {
      this.fromAmt = this.filterCheckedData.fPrice;
    }
    if (this.filterCheckedData.tPrice && this.filterCheckedData.tPrice != 0) {
      this.toAmt = this.filterCheckedData.tPrice;
    }
    // this.fromAmt = this.filterCheckedData.fPrice ? this.filterCheckedData.fPrice : null ;
    // this.toAmt = this.filterCheckedData.tPrice ? this.filterCheckedData.tPrice : null ;
    if (this.fromAmt || this.toAmt) {
      this.priceClear = false;
    }

    console.log("from data:"+this.fromAmt);
    console.log('filterCheckedDataTemp....', this.filterCheckedDataTemp);
    console.log('filterCheckedData....', this.filterCheckedData.price);
    console.log('filterCheckedData....', vav);

    keyboard.onKeyboardShow()
      .subscribe(data => {

        this.isKeyboardShown = true;

      });

    keyboard.onKeyboardHide()
      .subscribe(data => {

        this.isKeyboardShown = false;

      });

  }

  ionViewDidLoad() {
  }

  dismisss() {
    this.nativeStorage.setnativeStorage('modalStatus', '0');
    this.viewCtrl.dismiss();
  }
  IntegerParse(val) {
    return parseInt(val);
  }
  sortArr(sizeArr) {
    // sort by value
    sizeArr.sort(function (a, b) {
      return a.label - b.label;
    });

    // sort by label
    sizeArr.sort(function (a, b) {
      var nameA, nameB;
      nameA = (isNaN(a.label) === true ? a.label : parseInt(a.label));
      nameB = (isNaN(b.label) === true ? a.label : parseInt(b.label));
      //console.log(a.label + "----" + nameA + "||||" +b.label + "----" + nameB);
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
    return sizeArr;
  }

  dismiss(btnFlag) {

    let Filtervaluesapplied = '';
    if (btnFlag == 1) {
      for (var key3 in this.filterCheckedData) {
        this.filterCheckedData[key3] = [];
        Filtervaluesapplied += Filtervaluesapplied + ",";
      }
      this.viewCtrl.dismiss({ 'btnFlag': btnFlag });
    } else if (btnFlag == 0) {
      let a = JSON.stringify(this.filterCheckedDataTemp);
      this.filterCheckedData = JSON.parse(a);
      this.viewCtrl.dismiss({ 'btnFlag': btnFlag, 'btnFlag1': this.filterCheckedData });
    } else if (btnFlag == 2) {
      console.log('2222.dismis', btnFlag, 'this.ppApply', this.ppApply);
      let that = this;
      setTimeout(() => {
        if (!that.ppApply) {
          console.log('if case');
          that.viewCtrl.dismiss({ 'btnFlag': btnFlag });
        }
        else {
          console.log('else case');
          // that.toasterCtrl.presentToast('Filter not apply', 'bottom', '3000', false);
          console.log('Filter not apply')
        }
      }, 500);
    }
    else {
      this.viewCtrl.dismiss({ 'btnFlag': btnFlag });
    }

  }

  checkFromToValue(from, to) {
    let fromValue = (from ? from : "");
    let toValue = (to ? to : "");
    
    if (fromValue && toValue == '') {
      return true;
    }
    if (toValue && fromValue == '') {
      return true;
    } 
    return false;
  }


  showSubCat(cat, el) {
    el.scrollIntoView();
    this.active = cat.id;
    this.category = cat.id;
    this.options = cat.options;
    this.optionsFilter = this.options;
  }


  getValue(type, event) {
    console.log('event....', type, '..', event);
    console.log('ggg', this.fromAmt, this.toAmt);
    console.log('kkkk', this.priceRange.fromAmt, this.priceRange.toAmt);
  }
  checkboxClick(key, val) {
    var valIndex = this.filterCheckedData[key].indexOf(val);
    if (key == 'price') {
      console.log('Key', key, 'Value', val, 'valIndex', valIndex, '...', this.filterCheckedData);
      var nindx = this.dotArray.indexOf(key);
      if (this.filterCheckedData[key][0] == val) {
        this.dotArray.splice(nindx, 1);
        this.filterCheckedData[key].splice(0);
      } else {
        if (nindx >= 0) {
          this.dotArray.splice(nindx, 1);
        }
        this.dotArray.push(key);
        this.filterCheckedData[key].splice(0);
        this.filterCheckedData[key].push(val);
      }
    } else {
      if (valIndex < 0) {
        this.filterCheckedData[key].push(val);
      } else {
        this.filterCheckedData[key].splice(valIndex, 1);
      }
      var nindx2 = this.dotArray.indexOf(key);
      if (this.filterCheckedData[key].length == 0) {
        this.dotArray.splice(nindx2, 1);
      } else {
        if (nindx2 < 0) {
          this.dotArray.push(key);
        }
      }
    }
  }




  priceFilter(type, ev) {
    this.errorTrue = false;
    console.log('ev.....', type, '-------', ev);
    if (type == 'from') {
      if (this.toAmt && this.toAmt != '') {
        if (parseInt(ev) < parseInt(this.toAmt)) {
          this.fromAmt = ev;
          this.ppApply = false;
        }
        else {
          //this.toasterCtrl.presentToast('Upper limit must be greater than lower limit', 'bottom', '3000', false);
          this.errorTrue = true;
          this.ppApply = true;
          //this.isKeyboardShown = true;
        }
      }
      else {
        this.fromAmt = ev;
      }
    }
    else if (type == 'to' && this.fromAmt) {
      if (parseInt(ev) >= parseInt(this.fromAmt)) {
        this.toAmt = ev;
      }
      else {
        //this.toasterCtrl.presentToast('Upper limit must be greater than lower limit', 'bottom', '3000', false);
        this.ppApply = true;
        this.errorTrue = true;
        //this.isKeyboardShown = true;
      }
    }

    if (this.fromAmt && this.fromAmt != '' && this.toAmt && this.toAmt != '') {
      if (parseInt(this.fromAmt) >= parseInt(this.toAmt)) {
        this.ppApply = true;
        // this.toAmt = '';
      }
      else {
        this.ppApply = false;
      }
    }
    else {
      this.ppApply = false;
      this.priceClear = true;
    }
    if (this.fromAmt || this.toAmt) {
      this.priceClear = false;
    }
    this.setFilterPrice();
  }


  setFilterPrice() {
    // console.log(this.fromAmt, '..', this.toAmt);
    let ff = this.fromAmt ? this.fromAmt : '';
    let tt = this.toAmt ? this.toAmt : '';
    let val;
    this.filterCheckedData['fPrice'] = this.fromAmt;
    if(this.toAmt!=undefined){
      this.filterCheckedData['tPrice'] = this.toAmt;
    }else{
      this.filterCheckedData['tPrice']='';
    }
    this.filterCheckedData['price'].splice(0);
    if (ff >= 0 && tt > 0 && ff != '' && tt != '') {
      val = ff + '-' + tt;
      this.filterCheckedData['price'].splice(0);
      this.filterCheckedData['price'].push(val);
      // this.ppApply=false;
    }
    else {
      if(!this.ppApply){
        console.log("this.ppApply"+this.ppApply);
      }else{
        console.log("this.ppApply"+this.ppApply);
        this.ppApply = true;
      }

      // this.toasterCtrl.presentToast('Upper limit and lower limit must be set', 'bottom', '3000', false);
    }
    console.log('this.filterCheckedData ... ', this.filterCheckedData);
    console.log('From ', this.fromAmt, " To ", this.toAmt);


  }
  reSetInput() {
    this.fromAmt = '';
    this.toAmt = '';
    this.setFilterPrice();
    this.filterCheckedData['price'].splice(0);
    this.priceClear = true;
    this.ppApply = false;

  }

  filterItems(ev: any) {
    // Reset items back to all of the items
    this.options = this.optionsFilter;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.options = this.options.filter((item) => {
        return (item.value.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
