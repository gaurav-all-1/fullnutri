import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'src/app/shared/services/modal.service';

import { Product } from 'src/app/shared/classes/product';

import { CartService } from 'src/app/shared/services/cart.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { CompareService } from 'src/app/shared/services/compare.service';
import { environment } from 'src/environments/environment';
import { MasterService } from 'src/app/shared/services/master.service';
import { OfferServiceService } from 'src/app/shared/services/offer-service.service';

declare var $: any;

@Component({
	selector: 'product-detail-one',
	templateUrl: './detail-one.component.html',
	styleUrls: ['./detail-one.component.scss']
})

export class DetailOneComponent implements OnInit {

	getvarientId:any
	getoffer:any
	token:any=localStorage.getItem("token");
	@Input() product: any;
	variants = [];
	liveurl:any
	variationGroup = [];
	selectableGroup = [];
	sizeArray = [];
	colorArray = [];
	selectedVariant = {
		color: null,
		colorName: null,
		price: null,
		size: ""
	};
	maxPrice = 0;
	minPrice = 99999;
	ForDisable:boolean
	qty = 1;
	variantValue:boolean=false;
	newValue:boolean=true;
	hidden:boolean=false;

	price:any

	SERVER_URL = environment.SERVER_URL;
	variant: any=null;

	amount:number=0

	constructor(
		public cartService: CartService,
		public wishlistService: WishlistService,
		public compareService: CompareService,
		public router: Router,
		public el: ElementRef,
		private toastrService: ToastrService,
		private modalService:ModalService,
		private master:MasterService,
		private offerservice:OfferServiceService) {


			// let cartDataItems = localStorage.getItem('cartDataItems');
			// console.log("ssssssse*****",cartDataItems)
			// if(cartDataItems.length){
			// 	this.variantValue=true;
			// }
			
	}

	ngOnInit(): void {

		


		// if(this.token){
		// 	this.hidden = true
		// }else{
		// this.modalService.showLoginModal();
		// }

		
		this.offerservice.setqty(this.qty)
	



		 
		this.liveurl = location.href
		console.log("urlset",this.liveurl)

		// let min = this.minPrice;
		// let max = this.maxPrice;
		// this.variationGroup = this.product.variants.reduce((acc, cur) => {
		// 	cur.size.map(item => {
		// 		acc.push({
		// 			color: cur.color,
		// 			colorName: cur.color_name,
		// 			size: item.name,
		// 			price: cur.price
		// 		});
		// 	});
		// 	if (min > cur.price) min = cur.price;
		// 	if (max < cur.price) max = cur.price;
		// 	return acc;
		// }, []);

		// if (this.product.variants.length == 0) {
		// 	min = this.product.sale_price
		// 		? this.product.sale_price
		// 		: this.product.price;
		// 	max = this.product.price;
		// }

		// this.minPrice = min;
		// this.maxPrice = max;

		// this.refreshSelectableGroup();

		console.log("&&&&&");
		console.log(this.product.category.id);
		Object.keys(this.product['variants']).forEach((v)=>{
			console.log(JSON.stringify(this.product['variants'][v]));
			this.variants.push(this.product['variants'][v]);
		});
		console.log(this.variants);
		this.amount = this.product.variants[0].price;

	}

	onhide(){
		this.modalService.showLoginModal();
	}

	// onhide(){
	// 	if(!this.token){
	// 	this.modalService.showLoginModal();
	// 	}else{
	// 		this.router.navigateByUrl('/');
	// 	}
	// }

	offerList(){
		this.master.getMethod('/offer/list').subscribe(res=>{
			// console.log("offerslist",res);
			this.getoffer = res
			console.log("offerlist",this.getoffer)
			this.offerservice.setofferList(res);
		})
	}
	
	@HostListener('window:scroll', ['$event'])
	handleScroll(event: Event) {
		if (document.querySelector('.default-page')) {
			this.scrollHandler()
		}
	}
										
	addCart(event: Event, index = 0) {
		
		event.preventDefault();
		if(this.token){
			if ((event.currentTarget as HTMLElement).classList.contains('btn-disabled')) return;

			let newProduct = { ...this.product };
			console.log('crt',newProduct);
			if (this.product.variants.length > 0) {
				newProduct = {
					...this.product,
					name:
						this.product.name ,
					price: this.amount
				};
				// newProduct.variants.id = this.product.
			}
			console.log(newProduct);
			console.log("my hi variant",this.variant);
			this.cartService.addToCart(newProduct,this.variant,index == 0 ? this.qty : this.product.qty);
			// this.variantValue=true
		}else {


		this.modalService.showLoginModal();
			
			
			// let newProduct = { ...this.product };
			// console.log('crt',newProduct);
			// if (this.product.variants.length > 0) {
			// 	newProduct = {
			// 		...this.product,
			// 		name:
			// 			this.product.name ,
			// 		price: this.product.variants[0].price
			// 	};
			// 	// newProduct.variants.id = this.product.
			// }
			// console.log(newProduct);

			// localStorage.setItem('cartDataOffline',JSON.stringify(newProduct))
			// localStorage.setItem('offlineVarient',this.variant)
			// localStorage.setItem('offlineQuantity',index == 0 ? this.qty : this.product.qty)
		}
	
		
		// this.getvarientId = this.variant
		// console.log("ifofvarient",this.getvarientId)
		// if(!this.getvarientId){
		// 	this.toastrService.error('Please select the size');
		// }

	}

	buyNowLink(event: Event)
	{
		if(this.token){
		event.preventDefault();
		if(!this.variant)
		{
			this.toastrService.error('Please select a size');
		}else{
			this.router.navigate([`/shop/productcheckout/${this.product.id}`],{
				queryParams: { "varient": this.variant },
				queryParamsHandling: 'merge' })
			// this.router.navigate(['/shop/productcheckout/'],{queryParams: {productid:this.product.id,varientid:this.variant}});
			
		}
	}else{
		this.modalService.showLoginModal();
	}

	}





	// showLoginModal(event: Event): void {
	// 	event.preventDefault();
	// 	this.modalService.showLoginModal();
	// }

	addToWishlist(event: Event) {
		event.preventDefault();

		if (this.isInWishlist()) {
			this.router.navigate(['/shop/wishlist']);
		} else {
			this.wishlistService.addToWishList(this.product);
		}
	}

	addToCompare(event: Event) {
		event.preventDefault();
		if (this.isInCompare()) return;
		this.compareService.addToCompare(this.product);
	}

	isInCompare() {
		return this.compareService.isInCompare(this.product);
	}

	isInWishlist() {
		return this.wishlistService.isInWishlist(this.product);
	}
	

	refreshSelectableGroup() {
		let tempArray = [...this.variationGroup];
		if (this.selectedVariant.color) {
			tempArray = this.variationGroup.reduce((acc, cur) => {
				if (this.selectedVariant.color !== cur.color) {
					return acc;
				}
				return [...acc, cur];
			}, []);
		}

		this.sizeArray = tempArray.reduce((acc, cur) => {
			if (acc.findIndex(item => item.size == cur.size) !== -1)
				return acc;
			return [...acc, cur];
		}, []);

		tempArray = [...this.variationGroup];
		if (this.selectedVariant.size) {
			tempArray = this.variationGroup.reduce((acc, cur) => {
				if (this.selectedVariant.size !== cur.size) {
					return acc;
				}
				return [...acc, cur];
			}, []);
		}

		// this.colorArray = this.product.variants.reduce((acc, cur) => {
		// 	if (
		// 		tempArray.findIndex(item => item.color == cur.color) == -1
		// 	) {
		// 		return [
		// 			...acc,
		// 			{
		// 				color: cur.color,
		// 				colorName: cur.color_name,
		// 				price: cur.price,
		// 				disabled: true
		// 			}
		// 		];
		// 	}
		// 	return [
		// 		...acc,
		// 		{
		// 			color: cur.color,
		// 			colorName: cur.color_name,
		// 			price: cur.price,
		// 			disabled: false
		// 		}
		// 	];
		// }, []);

		let toggle = this.el.nativeElement.querySelector('.variation-price');
		if (toggle) {
			if (this.selectedVariant.color && this.selectedVariant.size != "") {
				$(toggle).slideDown();
			} else {
				$(toggle).slideUp();
			}
		}
	}

	selectColor(event: Event, item: any) {
		event.preventDefault();

		if (item.color == this.selectedVariant.color) {
			this.selectedVariant = {
				...this.selectedVariant,
				color: null,
				colorName: null,
				price: item.price
			};
		} else {
			this.selectedVariant = {
				...this.selectedVariant,
				color: item.color,
				colorName: item.colorName,
				price: item.price
			};
		}
		this.refreshSelectableGroup();
	}

	selectSize(event: Event) {
		if (this.selectedVariant.size == 'null') {
			this.selectedVariant = { ...this.selectedVariant, size: "" };
		}
		if ($(event.target).val() == "") {
			this.selectedVariant = { ...this.selectedVariant, size: "" };
		} else {
			this.selectedVariant = { ...this.selectedVariant, size: $(event.target).val() };
			// console.log(this.selectedVariant.size,$(event.target).val())
		}
		this.refreshSelectableGroup();
	}

	onChangeQty(current: number) {
		this.qty = current;
		this.offerservice.setqty(this.qty)
	}

	onChangeQty2(current: number) {
		this.product.variants.quantity= current;
	}

	clearSelection() {
		this.selectedVariant = {
			...this.selectedVariant,
			color: null,
			colorName: null,
			size: ""
		};
		this.refreshSelectableGroup();
	}

	scrollHandler() {
		let stickyBar = this.el.nativeElement.querySelector('.sticky-bar');
		if (stickyBar.classList.contains('d-none') && this.el.nativeElement.getBoundingClientRect().bottom < 0) {
			stickyBar.classList.remove('d-none');
			return;
		}
		if (!stickyBar.classList.contains('d-none') && this.el.nativeElement.getBoundingClientRect().bottom > 0) {
			stickyBar.classList.add('d-none');
		}
	}

	updateVarient(varient:Event){
		this.variant = $(varient.target).val()
		console.log(this.variant,this.variantValue);
		for(let x of this.product.variants){
			console.log(x)
			if( x.id == this.variant){
				this.amount = x.price;
			}
		}

	}


}