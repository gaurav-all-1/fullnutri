import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// RxJS
import { Subject, BehaviorSubject } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Product } from 'src/app/shared/classes/product';
import { CartItem } from 'src/app/shared/classes/cart-item';
import { cartItemsSelector } from 'src/app/core/selectors/selectors';
import { AddToCartAction, RefreshStoreAction, RemoveFromCartAction, UpdateCartAction } from 'src/app/core/actions/actions';
import { MasterService } from './master.service';

@Injectable({
	providedIn: 'root'
})

export class CartService { 

	totalPrice:any
	public cartItems: CartItem[] = [];
	public cartStream: Subject<any> = new BehaviorSubject([]);
	public qtyTotal: Subject<number> = new BehaviorSubject(0);
	public priceTotal: Subject<number> = new BehaviorSubject(0);

	constructor(private store: Store<any>, private toastrService: ToastrService,private master:MasterService) {
		store.pipe(select(cartItemsSelector)).subscribe(items => {
			this.cartItems = items;

			this.cartStream.next(items);

			this.qtyTotal.next(
				this.cartItems.reduce((acc, cur) => {
					console.log("quantity-cart",acc + cur.qty)
					return acc + cur.qty
				}, 0));
			this.priceTotal.next(
				this.cartItems.reduce((acc, cur) => {
					console.log("current-price",acc+cur.variants[0].price)
					return acc + cur.variants[0].price
				}, 0)
			)	
		})
	}

	// Product Add to Cart
	addToCart(product: Product,variant?:number,qty = 1) {
		console.log("cart",variant);
		if(!variant)
		{
			this.toastrService.error('Please select a size');
		}else{
			// if (this.canAddToCart(product, qty)) {
		let cartDataItems = localStorage.getItem('cartDataItems');
		if(cartDataItems)
		{
			let isExists = false;
			let cartId = undefined;
			let quantity = undefined;
			let cartDataItemsArray = JSON.parse(cartDataItems);
			console.log(cartDataItems)
			Object.keys(cartDataItemsArray).forEach((cartItem)=>{
				if(cartDataItemsArray[cartItem].inventory.product.id === product.id 
					&& cartDataItemsArray[cartItem].inventory.variant.id == variant)
				{
					isExists = true;
					cartId = cartDataItemsArray[cartItem].id;
					quantity = cartDataItemsArray[cartItem].quantity;
				}
			})
		this.toastrService.success("Product is adding...")

			if(!isExists){
				this.master
				.methodPost(
				  {
					product: { id: product.id },
					quantity: qty,
					variant: { id: variant },
				  },
				  '/cart/insert'
				)
				
				.subscribe((res) => { 
				  console.log('cart-insert done', res);
				  product.id = res.data[0].product.id;
				  console.log('cart-id done', product.id);
				  this.store.dispatch(new AddToCartAction({ product, qty }));
				  this.toastrService.success('Product added to Cart.');
				  setTimeout(()=>{
					  location.reload()
				  },700)
				  
				});
			}else{
				this.master
				.methodPost(
				  {
					id: cartId ,
					quantity: quantity+qty
				  },
				  '/cart/edit'
				)
				.subscribe((res) => { 
				  console.log('cart-insert done', res);
				//   product.id = res.data[0].product.id;
				//   console.log('cart-id done', product.id);
				//   this.store.dispatch(new AddToCartAction({ product, qty }));
				Object.keys(cartDataItems).forEach((cartItem)=>{
					if(cartDataItems[cartItem].id===cartId){
						cartDataItems[cartItem].quantity+=qty;
						localStorage.setItem('cartDataItems',JSON.stringify(cartDataItems));
					}
				})
				  this.toastrService.success('Product added to Cart.');
				  setTimeout(()=>{
					  location.reload()
				  },700)
				  
				});
			}
		}
        
		  
		 
		 
        
    //   } else {
    //     this.toastrService.error(
    //       "Sorry, you can't add that product to the cart."
    //     );
    //   }
		}
	}

	


	// Product Add to Cart
	addToCartFromCartPage(product: Product,variant?:number,qty = 1) {
		console.log("cart",variant);
		if(!variant)
		{
			this.toastrService.error('Please select a size');
		}else{
			// if (this.canAddToCart(product, qty)) {
		let cartDataItems = localStorage.getItem('cartDataItems');
		if(cartDataItems)
		{
			let isExists = false;
			let cartId = undefined;
			let quantity = undefined;
			let cartDataItemsArray = JSON.parse(cartDataItems);
			Object.keys(cartDataItemsArray).forEach((cartItem)=>{
				if(cartDataItemsArray[cartItem].inventory.product.id === product.id)
				{
					isExists = true;
					cartId = cartDataItemsArray[cartItem].id;
					quantity = cartDataItemsArray[cartItem].quantity;
				}
			})
			if(!isExists){
				this.master
				.methodPost(
				  {
					product: { id: product.id },
					quantity: qty,
					variant: { id: variant },
				  },
				  '/cart/insert'
				)
				.subscribe((res) => { 
				  console.log('cart-insert done', res);
				  product.id = res.data[0].product.id;
				  console.log('cart-id done', product.id);
				  this.store.dispatch(new AddToCartAction({ product, qty }));
				  this.toastrService.success('Product added to Cart.');
				  setTimeout(()=>{
					  location.reload() 
				  },700)
				  
				});
			}else{
				this.master  
				.methodPost(
				  {
					 id: cartId ,
					quantity: qty
				  },
				  '/cart/edit'
				)
				.subscribe((res) => { 
				  console.log('cart-insert done', res);
				//   product.id = res.data[0].product.id;
				//   console.log('cart-id done', product.id);
				//   this.store.dispatch(new AddToCartAction({ product, qty }));
				Object.keys(cartDataItems).forEach((cartItem)=>{
					if(cartDataItems[cartItem].id===cartId){
						cartDataItems[cartItem].quantity+=qty;
						localStorage.setItem('cartDataItems',JSON.stringify(cartDataItems));
					}
				})
				  this.toastrService.success('Product added to Cart.');
				  setTimeout(()=>{
					  location.reload()
				  },700)
				});
			}
		}

		  
		 
		 
        
    //   } else {
    //     this.toastrService.error(
    //       "Sorry, you can't add that product to the cart."
    //     );
    //   }
		}
	}

	

	// Product Removed from the Cart
	removeFromCart(product: CartItem) {
		this.store.dispatch(new RemoveFromCartAction({ product }));
		this.toastrService.success('Product removed from Cart.');
	}

	// Cart update
	updateCart(cartItems: CartItem[]) {
		this.store.dispatch(new UpdateCartAction({ cartItems }));
		this.toastrService.success('Cart Updated.');
	}

	// Check whether product is in Cart or not
	isInCart(product: Product): boolean {
		return this.cartItems.find(item => item.id == product.id) ? true : false;   
	}
	// Check where product could be added to the cart
	canAddToCart(product: Product, qty = 1) {
		var find = this.cartItems.find(item => item.id == product.id);

		if (find) {
			if (product.stock == 0 || (product.stock && product.stock < (find.qty + qty))) return false;
			else return true;
		} else {
			if (product.stock == 0 || (product.stock && product.stock < qty)) return false;
			else return true;
		}
	}

	clearCart(){
		this.store.dispatch(new RefreshStoreAction());
	}

	
}
