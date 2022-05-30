import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './shared/layout/layout.component';
// import { ComingSoonPageComponent } from './pages/others/coming-soon/coming-soon.component';
import { IndexComponent } from './pages/home/index/index.component';
import { PrivacyComponent } from './pages/home/privacy/privacy.component';
import { TermsComponent } from './pages/home/terms/terms.component';
import { AboutNutriComponent } from './pages/home/about-nutri/about-nutri.component';
import { ContactUsComponent } from './pages/home/contact-us/contact-us.component';
import { FAQComponent } from './pages/home/faq/faq.component';
import { SuccessComponent } from './pages/home/success/success.component';
import { ShippingComponent } from './pages/home/shipping/shipping.component';
import { SocialauthComponent } from './pages/home/socialauth/socialauth.component';
import { EmailverifyComponent } from './pages/home/emailverify/emailverify.component';
import { ForgotpasswordComponent } from './pages/home/forgotpassword/forgotpassword.component';
import { SingleComponent } from './shared/single/single.component';





const routes: Routes = [
	
	{
		path: '',
		component: LayoutComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				component: IndexComponent
			},
			{
				path: 'privacy',
				component: PrivacyComponent
			},
			{
				path: 'Terms&Condition',
				component: TermsComponent
			},
			{
				path: 'aboutUs',
				component: AboutNutriComponent
			},
			{
				path: 'contactUs',
				component: ContactUsComponent
			},
			{
				path: 'FAQ',
				component: FAQComponent
			},
			{
				path: 'shippingpolicy',
				component: ShippingComponent
			},
			{
				path: 'success',
				component: SuccessComponent
			},
			
			// {
			// 	path: 'socialauth',
			// 	component: SocialauthComponent
			// },
			{
				path: 'emailverify',
				component: EmailverifyComponent
			},

			{
				path: 'forgotpassword',
				component: ForgotpasswordComponent							
			},
			
			// {
			// 	path: 'elements',
			// 	loadChildren: () => import( './pages/elements/elements.module' ).then( m => m.ElementsModule )
			// },
			// {
			// 	path: 'blog',
			// 	loadChildren: () => import( './pages/blog/blog.module' ).then( m => m.BlogModule )
			// },
			// {
			// 	path: 'pages',
			// 	loadChildren: () => import( './pages/others/pages.module' ).then( m => m.PagesModule )
			// },
			{
				path: 'shop',
				loadChildren: () => import( './pages/shop/shop.module' ).then( m => m.ShopModule )
			},
			{
				path: 'product',
				loadChildren: () => import( './pages/product/product.module' ).then( m => m.ProductModule )
			}
			
			
		]
	},

	{
		path: 'gmail',
		component: SingleComponent,
		children: [
			{
				path: 'socialauth',
				pathMatch: 'full',
				component: SocialauthComponent
			},
		]
	},
	
	{
		path: '**',
		redirectTo: '/pages/404'
	}
];

@NgModule( {
	imports: [ RouterModule.forRoot( routes, { useHash: false, anchorScrolling: 'disabled', scrollPositionRestoration: 'disabled' } ) ],
	exports: [ RouterModule ]
} )

export class AppRoutingModule { }