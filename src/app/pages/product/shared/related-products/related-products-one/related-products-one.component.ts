import { Component, OnInit, Input } from '@angular/core';

import { sliderOpt } from 'src/app/shared/data';
import { MasterService } from 'src/app/shared/services/master.service';
import { IdServices } from 'src/app/shared/services/relatedId.service';


@Component( {
	selector: 'related-products-one',
	templateUrl: './related-products-one.component.html',
	styleUrls: [ './related-products-one.component.scss' ]
} )

export class RelatedProductsOneComponent implements OnInit {

	bindId:any=[]
	@Input() products = [];
	@Input() loaded = false;
	newId:any
	pId = 5;
	// loader:boolean = false;


	options = {
		...sliderOpt,
		nav: false,
		dots: true,
		margin: 20,
		loop: false,
		responsive: {
			0: {
				items: 2
			},
			480: {
				items: 2
			},
			768: {
				items: 3,
			},
			992: {
				items: 3,
			},
			1200: {
				items: 4,
				dots: false,
			},
			1400: {
				items: 4,
				nav: true,
				dots: false
			}
		}
	};

	constructor (
		private relatedID:IdServices,
		private master:MasterService
	) { 
	
	}

	ngOnInit (): void {
		// this.loader = true;
	
    this.relatedID.missionAnnounced$.subscribe((newValue:any)=>{
		console.log("gaurav-id",newValue.catId) 
		

		this.master.getMethod(`/product/list/${newValue.catId}`).subscribe(res=>{
			// this.loader = false;
			this.bindId = res['data'].filter(product=>{return product.id != newValue.productId}).slice(0,4);
			console.log("jai ho",this.bindId)
		})
	})
	


	}
}
