import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlModule } from 'angular-owl-carousel';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
// import { ElementsModule } from './pages/elements/elements.module';
// import { PagesModule } from './pages/others/pages.module';
import { HomeModule } from './pages/home/home.module';

import { CarouselModule } from 'ngx-owl-carousel-o';

// reducers
import { appReducers, metaReducers } from './core/reducers/app.reducer';
import { wishlistReducer } from './core/reducers/wishlist.reducer';
import { compareReducer } from './core/reducers/compare.reducer';
import { cartReducer } from './core/reducers/cart.reducer';

import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ErrorInterceptor } from './shared/services/error.interceptor';




@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    OwlModule,
    CarouselModule,
    ShareButtonsModule,
    ShareIconsModule, 
    // ElementsModule,
    // PagesModule,
 SharedModule,
    HomeModule,
    // HttpModule,
    BrowserAnimationsModule,
    NgxSliderModule,
    
    
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: false,
      enableHtml: true,
    }),
    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreModule.forFeature('cart', cartReducer),
    StoreModule.forFeature('wishlist', wishlistReducer),
    StoreModule.forFeature('compare', compareReducer),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    StoreDevtoolsModule.instrument(),
  ],

  providers: [{provide: HTTP_INTERCEPTORS,useClass: ErrorInterceptor,multi:true}],
  bootstrap: [AppComponent]
})

export class AppModule { }
