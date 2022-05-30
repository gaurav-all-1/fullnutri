import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subject, BehaviorSubject } from 'rxjs';

import { Product } from '../classes/product';
import { wishlistSelector } from 'src/app/core/selectors/selectors';
import { AddToWishListAction, RemoveFromWishListAction, AddToCartAction } from 'src/app/core/actions/actions';
import { CartService } from './cart.service';
import { ModalService } from './modal.service';

@Injectable( {
	providedIn: 'root'
} )

export class WishlistService {

	wishlist = [];
	wishlistStream: Subject<any> = new BehaviorSubject( [] );
	wishlistQty: Subject<number> = new BehaviorSubject( 0 );
	

	constructor ( private store: Store<any>, private toastrService: ToastrService,private modalService:ModalService, private cartSerVice: CartService ) {
		store.pipe( select( wishlistSelector ) ).subscribe( items => {
			this.wishlist = items;
			this.wishlistStream.next( items );
			this.wishlistQty.next( items.length );
		} );
	}

	// Product add to Wishlist
	addToWishList ( product ): void {
		if ( this.wishlist.findIndex( item => item.id === product.id ) === -1 ) {
			this.store.dispatch( new AddToWishListAction( { product } ) );
			this.toastrService.success( 'Product added to Wishlist.' );
		}
	}

	// Product removed from Wishlist
	removeFromWishList ( product ): void {
		this.store.dispatch( new RemoveFromWishListAction( { product } ) );
		this.toastrService.success( 'Product removed from Wishlist.' );
		location.reload()
	}

	// Product moved from Wishlist to Cart
	moveToCart ( product ): void {
		
		// this.store.dispatch( new AddToCartAction( { product, qty: 1 } ) );
		// this.toastrService.success( 'Product moved to Cart.' );
		let authentication = localStorage.getItem("token");
		if (authentication) {
		this.store.dispatch( new RemoveFromWishListAction( { product } ) );
		this.cartSerVice.addToCart(product,product['variants'][0].id);
		this.toastrService.success('Product moved to Cart.');
			setTimeout(()=>{
				location.reload()
			},700)
		}else
		{
			this.modalService.showLoginModal();
		}
	}

	// Check whether product is in Wishlist or not
	isInWishlist ( product: Product ): boolean {
		return this.wishlist.find( item => item.id == product.id ) ? true : false;
	}
}