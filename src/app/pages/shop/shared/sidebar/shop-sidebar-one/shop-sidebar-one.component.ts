import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Options, LabelType } from "@angular-slider/ngx-slider";

import { shopData } from '../../data';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/classes/product';
import { environment } from 'src/environments/environment';
import { MasterService } from 'src/app/shared/services/master.service';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
	selector: 'molla-shop-sidebar-one',
	templateUrl: './shop-sidebar-one.component.html',
	styleUrls: ['./shop-sidebar-one.component.scss']
})

export class ShopSidebarOneComponent implements OnInit {


	minValueFilter:any
	maxValueFilter:any





	
	allvarient:any
	categoryList:any=[{name:"hi"}];
	productList:any
	listname:any
	variant:any
    newObject:any=[]
	newObject1:any=[]
	
	
	@Input() toggle = false;
	@Input() product:any;
	@Input() productL:any;

	@Output() vote = new EventEmitter();
	@Output() vote1 = new EventEmitter();
	shopData = shopData;
	params = {};
	priceRange: any = [0, 100];
	category = [];

	@ViewChild('priceSlider') priceSlider: any;

	SERVER_URL = environment.SERVER_URL;

	constructor(public activeRoute: ActivatedRoute, public router: Router, private masterService:MasterService, private categoryService:CategoryService,private toastrService: ToastrService) {
		activeRoute.queryParams.subscribe(params => {
			this.params = params;
			if (params['minPrice'] && params['maxPrice']) {
				this.priceRange = [
					params['minPrice'] / 10,
					params['maxPrice'] / 10
				]
			} else {
				this.priceRange = [0, 10000];
				
				if(this.priceSlider) {
					this.priceSlider.slider.reset({min: 0, max: 10000});
				}
			}
		})
		// this.activeRoute.params.subscribe(res => console.log("param-i1",res));
	}

	ngOnInit(): void {
		this.categoryService.getCategoryList().subscribe(res=>{
			this.categoryList = res.slice(0,5);
			console.log("hi in mains",this.categoryList)
		})

		this.categoryService.getCategoryList().subscribe(res=>{
			this.newObject = res
			console.log("new object",this.newObject)
		})

		this.masterService.getMethod("/product/menu").subscribe((res)=>{
			// console.log("james-bond",res);
			console.log("james-bond",res);
			this.productList= res
			var i=1
			for (const [key, value] of Object.entries(this.productList)) {
				const len=Object.keys(value).length;
				console.log(key,value,len);
			  for( var NewList of this.newObject){
				  if (key==NewList.name){
					this.newObject1.push({
						id:NewList.id,
						key:key,
						value:len
					});
				  }

			  }
			  console.log("new Obejct3",this.newObject1)
				
				
			
				
			
				
			}
			
			
		
		})
	//    console.log("newobject",this.newObject)



	   this.getvarient()
		
	}

	onfilter(e:any){
		this.variant = e.target.value
		console.log(this.variant)
		
		this.masterService.getMethod(`/product/getProductsByVariant?variant=${this.variant}`).subscribe(res=>{
			this.vote.emit(res);
			this.toastrService.success('Filter Applied');
		})
	}

	

	getvarient(){
		this.masterService.getMethod("/getAllVariants").subscribe(res=>{
			this.allvarient = res
			console.log("allvarient-g",this.allvarient) 
		})
	}

	containsAttrInUrl(type: string, value: string) {
		const currentQueries = this.params[type] ? this.params[type].split(',') : [];
		return currentQueries && currentQueries.includes(value);
	}

	getUrlForAttrs(type: string, value: string) {
		let currentQueries = this.params[type] ? this.params[type].split(',') : [];
		currentQueries = this.containsAttrInUrl(type, value) ? currentQueries.filter(item => item !== value) : [...currentQueries, value];
		return currentQueries.join(',');
	}

	onAttrClick(attr: string, value: string) {
		let url = this.getUrlForAttrs(attr, value);
		this.router.navigate([], { queryParams: { [attr]: this.getUrlForAttrs(attr, value), page: 1 }, queryParamsHandling: 'merge' });
	}

	filterPrice() {
		this.router.navigate([], { queryParams: { minPrice: this.priceRange[0] * 10, maxPrice: this.priceRange[1] * 10, page: 1 }, queryParamsHandling: 'merge' });
	}

	changeFilterPrice(value: any) {
		this.minValueFilter = value[0]
		this.maxValueFilter = value[1]
		this.priceRange = ["MinPrice"+value[0], "MaxPrice"+value[1]];
		// console.log(this.priceRange)

		this.masterService.getMethod(`/getInventoryByPrice?maxPrice=${this.maxValueFilter}&minPrice=${this.minValueFilter}`).subscribe(res=>{
			this.vote1.emit(res)
			console.log(res)
			this.toastrService.success('Filtered Applied');
		})
	}
}