import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CartService } from 'src/app/shared/services/cart.service';

import { environment } from 'src/environments/environment';
import { MasterService } from 'src/app/shared/services/master.service';
import { OrderIdService } from 'src/app/shared/services/order-id.service';
import { ToastrService } from 'ngx-toastr';
import { OfferServiceService } from 'src/app/shared/services/offer-service.service';
// import { runInThisContext } from 'vm';

@Component({
	selector: 'shop-cart-page',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit, OnDestroy {

	finalamount:any
	getoredrid:any
	sumall:any
	valuequantity:any
	cartItems = [];
	SERVER_URL = environment.SERVER_URL;
	shippingCost = 0;

	totalQuantity : number = 0;
	cartData : any ;
	totalAmount : number = 0;

	disCountAmount:number =0;

	private subscr: Subscription;

	constructor(private store: Store<any>, 
		public cartService: CartService,
		private master:MasterService,
		private orderid:OrderIdService,
		private toastrService:ToastrService,
		private offerservice:OfferServiceService) {
	}

	ngOnInit() {

		

		// console.log("gauarv-id",this.orderid.getOrderList())

		// this.subscr = this.cartService.cartStream.subscribe(items => {
		// 	this.cartItems = items;
		// 	console.log("cartitems-cart",this.cartItems)
		// 	// this.getmultiply()
		// });

		// this.sumall=0;
		// this.cartItems.forEach(item=>{
		// 	this.sumall+=(item.variants[0].price*item.qty)
		//   });	
		
		let cartDataItems = undefined;
		if(cartDataItems){
		  cartDataItems = JSON.parse(cartDataItems);
		  this.cartData = cartDataItems;
		  Object.keys(cartDataItems).forEach((cartItem)=>{
			  this.totalAmount += parseInt(cartDataItems[cartItem]['quantity'])*parseInt(cartDataItems[cartItem]['inventory'].price);
			  this.totalQuantity += parseInt(cartDataItems[cartItem]['quantity']);
		  })
		} else{ 
	  this.master.getMethod(`/cart/list`).subscribe(res=>{
		   
		  let data = res['data'];
		  this.cartData = data;
		  localStorage.setItem('cartDataItems',JSON.stringify(data));
		  Object.keys(data).forEach((cartItem)=>{
			  this.totalAmount += parseInt(data[cartItem]['quantity'])*parseInt(data[cartItem]['inventory'].price);
			  this.totalQuantity += parseInt(data[cartItem]['quantity']);
			  console.log("cart discount",this.disCountAmount);
		  })
	  })
  }
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
			this.master.deleteMethod(`/cart/remove/`+product.id).subscribe(res=>{
				console.log("remove-cart",res);
				this.toastrService.success('Product removed from Cart.');
				  setTimeout(()=>{
					  location.reload()
				  },700) 
			})
		// }
		// }
		


	}


	// allclear() {
	// 	this.master.getMethod("/cart/clear").subscribe((res:any)=>{
	// 	  console.log(res);
	// 	  if(res["message"]!=""){
	// 		alert("cart is clear")
	// 		location.reload()
	// 	  }else{
	// 		alert("something went wrong")
	// 	  }
	// 	},error=>{
	
	// 	  alert("something went wrong")
	//   })
	//   }


	// getmultiply(){
	// 	this.valuequantity = this.cartItems.
	// }

	ngOnDestroy() {
		// this.subscr.unsubscribe();
	}

	trackByFn(index: number, item: any) {
		if (!item) return null;
		return item.slug;
	}

	updateCart(event: any) {
		event.preventDefault();
		event.target.parentElement.querySelector('.icon-refresh').classList.add('load-more-rotating');
		setTimeout(() => {
			console.log(event);
			this.cartService.updateCart(event);
			event.target.parentElement.querySelector('.icon-refresh').classList.remove('load-more-rotating');
			document.querySelector('.btn-cart-update:not(.diabled)') && document.querySelector('.btn-cart-update').classList.add('disabled');
		}, 400);
	}

	changeShipping(value: number) {
		this.shippingCost = value;
	}
	
	onChangeQty(event: number, product: any) {
		console.log(event+"   &&&");
		console.log(product);
		// this.sumall=0;

		// this.cartItems.forEach(item=>{
		// 	let addqty = event - item.qty ;
		// 	console.log("item",item)
		// 	this.sumall+=(item.variants[0].price*event)
			this.cartService.addToCartFromCartPage(product,product.name,event);
		// 	console.log(item)
		// });
		// this.cartService.updateCart(this.cartItems)
		// console.log(this.sumall,this.cartItems)
		// document.querySelector('.btn-cart-update.disabled') && document.querySelector('.btn-cart-update.disabled').classList.remove('disabled');
								
		// this.cartItems = this.cartItems.reduce((acc, cur) => {
		// 	if (cur.name === product.name) {
		// 		acc.push({
		// 			...cur,
		// 			qty: event,
		// 			sum: (cur.sale_price ? cur.sale_price : cur.price) * event
		// 		});
		// 	}
		// 	else acc.push(cur);
		// 	return acc;
		// }, [])
		// console.log("new value",this.cartItems)	
	}


	
}