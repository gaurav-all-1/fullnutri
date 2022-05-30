import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from 'src/app/shared/classes/product';

import { ModalService } from 'src/app/shared/services/modal.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { CompareService } from 'src/app/shared/services/compare.service';

import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/shared/services/api.service';
import { MasterService } from 'src/app/shared/services/master.service';
// import { EventEmitter } from 'stream';

@Component({
	selector: 'molla-product-nine',
	templateUrl: './product-nine.component.html',
	styleUrls: ['./product-nine.component.scss']
})

export class ProductNineComponent implements OnInit {

	@Input() products:any=[];
	@Output() getvalue = new EventEmitter<any>();
	getrating:any

	maxPrice = 0;
	minPrice = 99999;
	productid:any
	productlist:any=[]
	params = {};
	pageNo = 0;

	SERVER_URL = environment.SERVER_URL;
	categoryService: any;

	constructor(
		private router: Router,
		private route:ActivatedRoute,
		private modalService: ModalService,
		private cartService: CartService,
		private wishlistService: WishlistService,
		private compareService: CompareService,
		private apiServices:ApiService,
		private master:MasterService,
		public activeRoute: ActivatedRoute
	) { 
		this.route.queryParamMap.subscribe(params =>{ 
			this.productid=params.get("category")
			this.pageNo = parseInt(params.get("page"))}
			);
			// this.master.getMethod(`/product/list/${this.productid}?page=${this.pageNo-1}&size=10&isCacheable=true`).subscribe(res=>{
			// 	console.log("cat-pro",res)
			// 	this.products=res['data'];
			// 	console.log("get-product",this.products)
			// 	this.getvalue.emit({prducts:this.products.length,totalPage:res["totalPage"]})
			// 	console.log("get-product1234",this.products.length)				
			// })									
	}

	ngOnInit(): void {

	

		// this.allproduct()

		console.log("GAURAv",this.products);
		console.log("GAURAv",this.products[0].name)
		console.log("GAURAv",this.products[0].image)
		let min = this.minPrice;
		let max = this.maxPrice;

		// this.products.variants.map(item => {
		// 	if (min > item.price) min = item.price;
		// 	if (max < item.price) max = item.price;
		// }, []);

		// if (this.products.variants.length == 0) {
		// 	min = this.products.sale_price
		// 		? this.products.sale_price
		// 		: this.products.price;
		// 	max = this.products.price;
		// }

		// this.minPrice = min;
		// this.maxPrice = max;

	
	}


	// ratinglist(){
	// 	this.master.getMethod(`/review/list/${this.product.id}`).subscribe((allreview:any)=>{
	// 		console.log(allreview)
	// 		this.getrating=allreview
	// 		console.log("get-rating",this.getrating.rating)
	// 	  })
	// }

	allproduct(){
		this.apiServices.getSingleProduct(this.products)
	}



	// ngOnChange(){
	// 	console.log(this.product)
	// }

	addToCart(event: Event) {
		event.preventDefault();
		this.cartService.addToCart(this.products);
	}

	addToWishlist(event) {
	
		// console.log(this.products
		this.apiServices.getSingleProduct(event).subscribe(result => {
			console.log("hi",result.data[0]);
			let product = result.data[0];
			product.stock = result.data[0].variants[0].quantity;
			this.wishlistService.addToWishList(product);
		})
		// this.products.forEach(item => {
		// 	if(item.id==event){
		// 		console.log(item)
		// 	}
		// });

		// if (this.isInWishlist()) {
		// 	this.router.navigate(['/shop/wishlist']);
		// } else {
		// 	this.wishlistService.addToWishList(this.products);
		// }
	}


	addToCompare(event: Event) {
		event.preventDefault();
		if (this.isInCompare()) return;
		this.compareService.addToCompare(this.products);
	}

	quickView(event:any) {
		// event.preventDefault(); 
		// console.log("rohtash",this.products,event);
		console.log(event)
		this.modalService.showQuickView(event);
	}

	isInCompare() {
		return this.compareService.isInCompare(this.products);
	}

	isInWishlist() {
		return this.wishlistService.isInWishlist(this.products);
	}


	// productList(){
	// 	this.productlist= this.apiServices.fetchShopData
	// 	console.log(this.productlist)
	// }
}