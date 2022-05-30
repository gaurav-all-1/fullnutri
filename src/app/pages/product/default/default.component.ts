import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from 'src/app/shared/classes/product';
import { ApiService } from 'src/app/shared/services/api.service';
import { IdServices } from 'src/app/shared/services/relatedId.service';


@Component({
	selector: 'product-default-page',
	templateUrl: './default.component.html',
	styleUrls: ['./default.component.scss']
})

export class DefaultPageComponent implements OnInit {

	catId:any
	product: any;
	prev: Product;
	next: Product;
	related = [];
	loaded = false;

	constructor(
		public apiService: ApiService,
		private activeRoute: ActivatedRoute,
		public router: Router,
		private relatedID:IdServices

	
	) {
		activeRoute.params.subscribe(params => {
			this.loaded = false;
			console.log("slug-g",params['slug'])
			this.apiService.getSingleProduct(params['slug']).subscribe(result => {

				if (result === null) {
					this.router.navigate(['/pages/404']);
				}

				this.product = result.data[0];
				// this.prev = result.prevProduct;
				// this.next = result.nextProduct;
				// this.related = result.relatedProducts;
				this.loaded = true;
				debugger;
				console.log("*****");
				console.log("sahab",this.product.category.id);

				this.catId = this.product.category.id
				this.relatedID.announceMission({catId:this.catId,productId:this.product.id})
				
			});
		});
	}

	ngOnInit(): void {
		// console.log("default com",this.catId)
	}
}