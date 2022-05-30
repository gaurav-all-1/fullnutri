import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { CartService } from 'src/app/shared/services/cart.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { OfferServiceService } from 'src/app/shared/services/offer-service.service';
import { environment } from 'src/environments/environment';


@Component({
	selector: 'molla-cart-menu',
	templateUrl: './cart-menu.component.html',
	styleUrls: ['./cart-menu.component.scss']
})

export class CartMenuComponent implements OnInit {
	finalamount: any
	sumall: any
	discount: any
	discount1: any
	finalamount1: any
	totalvalue: any
	SERVER_URL = environment.SERVER_URL;

	totalQuantity: number = 0;
	cartData: any;
	totalAmount: number = 0;


	constructor(public cartService: CartService, private master: MasterService, private toastrService: ToastrService, private offer: OfferServiceService) {
		// console.log("cartstream",cartService.cartStream)

	}

	ngOnInit(): void {

		this.offer.getdiscount().subscribe(res => {
			console.log("aja bhai discount", res)
			this.discount = res

			let cartDataItems = undefined;
			if (cartDataItems) {
				cartDataItems = JSON.parse(cartDataItems);
				this.cartData = cartDataItems;
				Object.keys(cartDataItems).forEach((cartItem) => {
					this.totalAmount += parseInt(cartDataItems[cartItem]['quantity']) * parseInt(cartDataItems[cartItem]['inventory'].price);
					// this.finalamount = this.totalAmount
					this.totalQuantity += parseInt(cartDataItems[cartItem]['quantity']);
				})
			} else {
				let token = localStorage.getItem('token');
				if (token) {
					this.master.getMethod(`/cart/list`).subscribe(res => {

						let data = res['data'];
						this.totalvalue = data.length
						this.cartData = data;
						localStorage.setItem('cartDataItems', JSON.stringify(data));
						Object.keys(data).forEach((cartItem) => {
							this.totalAmount += parseInt(data[cartItem]['quantity']) * parseInt(data[cartItem]['inventory'].price);
							this.totalQuantity += parseInt(data[cartItem]['quantity']);
						})
					})
				}else{
					this.totalvalue= 0;
				}
				//  this.finalamount1 = this.totalAmount

			}
		})

		// this.discount1 = this.discount

		// console.log("cart-service",this.cartService)
		// console.log("vstl-ae",this.cartService.cartItems,this.cartService.updateCart)

		//     this.sumall=0;
		// 	this.cartService.cartItems.forEach(item=>{
		// 	this.sumall+=(item.variants[0].price*item.qty)
		//   });




	}





	removeFromCart(event: Event, product: any) {
		// alert('product');
		// this.cartService.removeFromCart(product);
		// console.log("remove-cart",product)
		// let cartDataItems = localStorage.getItem('cartDataItems');
		// if(cartDataItems)
		// {
		// 	let cartId = undefined;
		// 	let cartDataItemsArray = JSON.parse(cartDataItems);
		// 	Object.keys(cartDataItemsArray).forEach((cartItem)=>{
		// 		if(cartDataItemsArray[cartItem].inventory.product.id === product.id)
		// 		{
		// 			cartId = cartDataItemsArray[cartItem].id;			
		// 		}
		// 	})
		// 	if(cartId){
		this.master.deleteMethod(`/cart/remove/` + product.id).subscribe(res => {
			console.log("remove-cart", res);
			this.toastrService.success('Product removed from Cart.');
			setTimeout(() => {
				location.reload()
			}, 700)
		})
		// }
		// }



	}
}