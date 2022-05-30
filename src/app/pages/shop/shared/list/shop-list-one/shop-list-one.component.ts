import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/shared/classes/product';
import { MasterService } from 'src/app/shared/services/master.service';

@Component({
	selector: 'molla-shop-list-one',
	templateUrl: './shop-list-one.component.html',
	styleUrls: ['./shop-list-one.component.scss']
})

export class ShopListOneComponent implements OnInit,OnChanges {

	@Input() type: string;
	// @Input() FilterProd1:any;
	@Input() products :any= [];
	@Input() loaded = false;
	@Output() getvalue1 = new EventEmitter<any>();
	valueId:any


	grid = {
		"2cols": "col-6",
		"3cols": "col-6 col-md-4 col-lg-4",
		"4cols": "col-6 col-md-4 col-lg-4 col-xl-3"
	};
	fakeArray = {
		"list": [1, 2, 3, 4, 5],
		"2cols": [1, 2, 3, 4, 5, 6],
		"3cols": [1, 2, 3, 4, 5, 6, 7, 8, 9],
		"4cols": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	}

	constructor(private master:MasterService) {

	}
	ngOnChanges(products:any): void {
	
		
		
	}

	ngOnInit(): void {
		console.log("o",this.products)
		// console.log("filterhuyr",this.FilterProd1)
		// this.master.getMethod("product/list").subscribe(res=>{
		// 	this.products=res;
		// 	console.log("kaushal",this.products)
		// })

	
	}
	
	value(e:any){
		console.log("value-parent",e)
		this.getvalue1.emit(e)
		
	}


}