import { Component, OnInit, ViewEncapsulation, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import imagesLoaded from 'imagesloaded';

import { Product } from 'src/app/shared/classes/product';
import { environment } from 'src/environments/environment';

import { ApiService } from 'src/app/shared/services/api.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { CompareService } from 'src/app/shared/services/compare.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { sliderOpt } from 'src/app/shared/data';
import { MasterService } from 'src/app/shared/services/master.service';
import { ModalService } from 'src/app/shared/services/modal.service';

declare var $: any;

@Component({
	selector: 'molla-quick-view',
	templateUrl: './quick-view.component.html',
	styleUrls: ['./quick-view.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class QuickViewComponent implements OnInit {

	@Input() 
	slug = '';
	token:any=localStorage.getItem("token");
	product: any;
	loaded = false;
	productImage:any=[]
	product1:any
	options = {
		...sliderOpt,
		dots: false,
		nav: false,
		loop: false,
		onTranslate: (e: any) => this.itemChange(e, this)
	}
	variationGroup = [];
	selectableGroup = [];
	sizeArray = [];
	colorArray = [];
	selectedVariant = {
		color: null,
		colorName: null,
		price: null,
		size: "",
		disabled: false
	};
	maxPrice = 0;
	minPrice = 99999;
	liveurl:any
	paddingTop = '100%';
	currentIndex = 0;
	qty = 1;

	SERVER_URL = environment.SERVER_URL;

	variant: any;

	loader : any = 'skel-pro-single skel-quickview';
	loaderBody :any = 'skeleton-body';
	@ViewChild('singleSlider') singleSlider: any;

	constructor(
		public apiService: ApiService,
		public cartService: CartService,
		public wishlistService: WishlistService,
		public compareService: CompareService,
		public utilsService: UtilsService,
		public router: Router,
		public el: ElementRef,
		private master:MasterService,
		private modalService:ModalService) {
	}

	public trackByFn(index, item) {
		if (!item) return null;
		return item.id;
	}
	
	ngOnInit(): void {

		this.liveurl = location.href
		console.log("urlset",this.liveurl)
		
		console.log("hi",this.slug);
		this.product = this.product
		this.apiService.getSingleProduct(this.slug, true).subscribe(result => {

			this.loader ='';
			this.loaderBody = '';
			this.product = result["data"][0];
			this.productImage=this.product["productImage"]
			console.log("gaurav",this.product)
			console.log("gaurav00000",this.productImage)


			


			let min = this.minPrice;
			let max = this.maxPrice;

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

			// this.paddingTop = Math.floor((parseFloat(this.product.pictures[0].height.toString()) / parseFloat(this.product.pictures[0].width.toString()) * 1000)) / 10 + '%';

			// this.refreshSelectableGroup();

			// let self = this;
			// imagesLoaded(".quickView-modal").on("done", function () {
			// 	self.loaded = true;
			// })
		})
	}

	itemChange(e: any, self: any) {
		document.querySelector('#product-image-gallery').querySelector('.product-gallery-item.active').classList.remove('active');
		document.querySelector('#product-image-gallery').querySelectorAll('.product-gallery-item')[e.item.index].classList.add('active');

		self.currentIndex = e.item.index;
	}

	addCart(event: Event, index = 0) {
		event.preventDefault();
		if(this.token){
			if ((event.currentTarget as HTMLElement).classList.contains('btn-disabled')) return;

			let newProduct = { ...this.product };
			console.log(newProduct);
			if (this.product.variants.length > 0) {
				newProduct = {
					...this.product,
					name:
						this.product.name ,
					price: this.product.variants[0].price
				};
				// newProduct.variants.id = this.product.
			}
			console.log(newProduct);
	
			this.cartService.addToCart(newProduct,this.variant,index == 0 ? this.qty : this.product.qty);
				
		}else {
			this.modalService.showLoginModal();
		}
	
		
		// this.getvarientId = this.variant
		// console.log("ifofvarient",this.getvarientId)
		// if(!this.getvarientId){
		// 	this.toastrService.error('Please select the size');
		// }

	}


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

		this.colorArray = this.product.variants.reduce((acc, cur) => {
			if (
				tempArray.findIndex(item => item.color == cur.color) == -1
			) {
				return [
					...acc,
					{
						color: cur.color,
						colorName: cur.color_name,
						price: cur.price,
						disabled: true
					}
				];
			}
			return [
				...acc,
				{
					color: cur.color,
					colorName: cur.color_name,
					price: cur.price,
					disabled: false
				}
			];
		}, []);

		let toggle = this.el.nativeElement.querySelector('.variation-price');
		if (toggle) {
			if (this.selectedVariant.color && this.selectedVariant.size !== "") {
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
		}

		this.refreshSelectableGroup();
	}

	onChangeQty(current: number) {
		this.qty = current;
	}

	updateVarient(varient:Event){
		this.variant = $(varient.target).val()
		console.log(this.variant);
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

	closeQuickView() {
		let modal = document.querySelector('.quickView-modal') as HTMLElement;
		if (modal)
			modal.click();
	}

	changeImage($event: Event, i = 0) {
		this.currentIndex = i;
		this.singleSlider.to(i);
		$event.preventDefault();
	}
}