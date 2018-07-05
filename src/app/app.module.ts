import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Device } from '@ionic-native/device';
/* import {CleverTapPlugin} from '../../node_modules/clevertpa-cordova';; */
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';
import { Network } from '@ionic-native/network';
import { WordbreakPipe } from '../pipes/wordbreak/wordbreak';
import { AppMinimize } from '@ionic-native/app-minimize';
import {
  TilesWitoutheaderComponent, NarrowCarouselBigComponent, VerticalBannerComponent,
  MicrositeComponent, TagsComponent, TilesComponent, NarrowCarouselComponent, FullScreenBannerComponent,
  MostPopularComponent, ProductSliderComponent, ImageTextBannerComponent, ImageBannerComponent, NavigationMenuComponent, BannerWithCarouselsComponent
} from "../components/components";

import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';
import { DatePipe } from '@angular/common';

import { HockeyApp } from 'ionic-hockeyapp';
import { ManUpModule, ManUpService } from 'ionic-manup';
import { AppVersion } from '@ionic-native/app-version';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import {
  AuthPage,
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  HomePage,
  LandingPage,
  ResetPasswordPage,
  PdpPage,
  SearchPage,
  AuthModalsPage,
  SizeModalPage,
  ImageZoomPage,
  SizeViewPage,
  ListingPage,
  CartPage,
  ChangeSizePage,
  RemoveProductPage,
  RemoveWishlistProductPage,
  FilterModalPage,
  SortModalPage,
  AddressesPage,
  AddAddressPage,
  PaymentPage,
  WalkthroughPage,
  MyAccountPage,
  MyOrdersPage,
  OrdersDetailPage,
  JpCreditsPage,
  FavouriteLookPage,
  InviteEarnPage,
  SavedAddressPage,
  SavedCardsPage,
  NotLoginPage,
  EmptyOrderPage,
  PaymentStatusPage,
  GiftCardsPage,
  GiftCardsDetailsPage,
  WishlistPage,
  ProductSizePage,
  HelpScreenPage,
  MicrositePage,
  GiftcardPaymentPage,
  TermsPage,
  PrivacyPage,
  MyCouponsPage,
  ContactUsPage,
  QrCodePage,
  QrScanHistoryPage,
  QrModalPage
} from '../pages/pages';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicStorageModule } from '@ionic/storage';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { PayPal } from '@ionic-native/paypal';
import { Vibration } from '@ionic-native/vibration';
import { Clipboard } from '@ionic-native/clipboard';
import {
  ConstantsProvider,
  AlertServiceProvider,
  UtilitiesProvider,
  HttpInterceptorProvider,
  LocalStorageProvider,
  TosterserviceProvider,
  LoadingserviceProvider,
  ValidationServiceProvider,
  ModelinfoProvider,
  AppServiceProvider,
  GtmProvider,
} from '../providers/providers';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { RouterModule, Routes } from '@angular/router';
import { GoogleAnalytics } from 'ionic-native';
import { Keyboard } from '@ionic-native/keyboard';
import { Deeplinks } from '@ionic-native/deeplinks';
import { BetaoutProvider } from '../providers/betaout/betaout';
import { GlobalFunctionProvider } from '../providers/global-function/global-function';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
};

export function httpServiceInterceptor(backend: XHRBackend,
  options: RequestOptions,
  plt: Platform,
  storage: LocalStorageProvider,
  constant: ConstantsProvider
) {
  return new HttpInterceptorProvider(backend, options, plt, storage, constant);
};
const appRoutes: Routes = [
  {
    path: 'HomePage',
    component: MicrositeComponent
  }
];

@NgModule({
  declarations: [
    MyApp,
    AuthPage,
    LoginPage,
    SignupPage,
    ForgotPasswordPage,
    HomePage,
    LandingPage,
    ResetPasswordPage,
    PdpPage,
    SizeModalPage,
    ImageZoomPage,
    SizeViewPage,
    SearchPage,
    AuthModalsPage,
    ListingPage,
    CartPage,
    ChangeSizePage,
    RemoveWishlistProductPage,
    RemoveProductPage,
    FilterModalPage,
    SortModalPage,
    AddressesPage,
    AddAddressPage,
    PaymentPage,
    WalkthroughPage,
    WordbreakPipe,
    NavigationMenuComponent,
    ImageBannerComponent,
    ImageTextBannerComponent,
    ProductSliderComponent,
    MostPopularComponent,
    FullScreenBannerComponent,
    NarrowCarouselComponent,
    MyAccountPage,
    MyOrdersPage,
    OrdersDetailPage,
    JpCreditsPage,
    FavouriteLookPage,
    InviteEarnPage,
    SavedAddressPage,
    SavedCardsPage,
    TilesComponent,
    TagsComponent,
    NotLoginPage,
    EmptyOrderPage,
    PaymentStatusPage,
    GiftCardsPage,
    GiftCardsDetailsPage,
    WishlistPage,
    ProductSizePage,
    EmptyOrderPage,
    MicrositeComponent,
    VerticalBannerComponent,
    NarrowCarouselBigComponent,
    TilesWitoutheaderComponent,
    PaymentStatusPage,
    MicrositePage,
    HelpScreenPage,
    GiftcardPaymentPage,
    TermsPage,
    PrivacyPage,
    MyCouponsPage,
    ContactUsPage,
    BannerWithCarouselsComponent,
    QrCodePage,
    QrScanHistoryPage,
    QrModalPage
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      iconMode: 'md',
      tabsHideOnSubPages: false,
      platforms: {
        ios: {
          statusbarPadding: false,
        }
      }
    }),
    IonicStorageModule.forRoot(),
    HttpModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    // in your module's import array
    ManUpModule.forRoot({ url: 'http://api.jaypore.com/index.php/getappversion' })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AuthPage,
    LoginPage,
    SignupPage,
    ForgotPasswordPage,
    HomePage,
    LandingPage,
    ResetPasswordPage,
    PdpPage,
    SizeModalPage,
    ImageZoomPage,
    SizeViewPage,
    SearchPage,
    AuthModalsPage,
    ListingPage,
    CartPage,
    ChangeSizePage,
    RemoveWishlistProductPage,
    RemoveProductPage,
    FilterModalPage,
    SortModalPage,
    AddressesPage,
    AddAddressPage,
    PaymentPage,
    WalkthroughPage,
    NavigationMenuComponent,
    ImageBannerComponent,
    ImageTextBannerComponent,
    ProductSliderComponent,
    MostPopularComponent,
    FullScreenBannerComponent,
    NarrowCarouselComponent,
    MyAccountPage,
    MyOrdersPage,
    OrdersDetailPage,
    JpCreditsPage,
    FavouriteLookPage,
    InviteEarnPage,
    SavedAddressPage,
    SavedCardsPage,
    TilesComponent,
    TagsComponent,
    NotLoginPage,
    EmptyOrderPage,
    PaymentStatusPage,
    GiftCardsPage,
    GiftCardsDetailsPage,
    WishlistPage,
    ProductSizePage,
    EmptyOrderPage,
    MicrositeComponent,
    VerticalBannerComponent,
    NarrowCarouselBigComponent,
    TilesWitoutheaderComponent,
    PaymentStatusPage,
    MicrositePage,
    HelpScreenPage,
    GiftcardPaymentPage,
    TermsPage,
    PrivacyPage,
    MyCouponsPage,
    ContactUsPage,
    BannerWithCarouselsComponent,
    QrCodePage,
    QrScanHistoryPage,
    QrModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ConstantsProvider,
    AlertServiceProvider,
    UtilitiesProvider,
    ValidationServiceProvider,
    HttpInterceptorProvider,
    NativeStorage,
    IonicStorageModule,
    LocalStorageProvider,
    Facebook,
    GooglePlus,
    TosterserviceProvider,
    LoadingserviceProvider,
    Device,
    Network,
    ModelinfoProvider,
    SocialSharing,
    InAppBrowser,
    AppServiceProvider,
    GoogleAnalytics,
    PayPal,
    Keyboard,
    GtmProvider,
    AppMinimize,
    Vibration,
    DatePipe,
    Clipboard,
    QRScanner,
    AndroidPermissions,
    {
      provide: Http,
      useFactory: httpServiceInterceptor,
      deps: [XHRBackend, RequestOptions, Platform, LocalStorageProvider, ConstantsProvider]
    },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GtmProvider,
    HockeyApp,
    AppVersion,
    ManUpService,
    Deeplinks,
    BetaoutProvider,
    GlobalFunctionProvider
    ]
})

export class AppModule { }

