import { Component, OnInit, HostListener,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from 'src/app/shared/services/api.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
	selector: 'shop-sidebar-page',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})

export class SidebarPageComponent implements OnInit {

	FilterProd:any;
	products = [];
	perPage = 10;
	type = 'list';
	productList:any
	newObject:any=[]
	allproducts:any
	totalCount = 1;
	orderBy = 'default';
	pageTitle = 'List';
	toggle = false;
	searchTerm = '';
	loaded = false;
	firstLoad = false;
	lenth1:any
	pageNo = 1;

	constructor(public activeRoute: ActivatedRoute, 
		public router: Router, 
		public utilsService: UtilsService, 
		public apiService: ApiService,
		private masterService:MasterService,
		) {
		this.activeRoute.params.subscribe(params => {
			this.type = params['type'];

			if (this.type == 'list') {
				this.pageTitle = 'List';
			} else if (this.type == '2cols') {
				this.pageTitle = 'Grid 2 Columns';
			} else if (this.type == '3cols') {
				this.pageTitle = 'Grid 3 Columns';
			} else if (this.type == '4cols') {
				this.pageTitle = 'Grid 4 Columns';
			}
		});
		
		this.activeRoute.queryParams.subscribe(params => {
			this.loaded = false;
			

			if (params['searchTerm']) {
				this.searchTerm = params['searchTerm'];
				let data = {"key":this.searchTerm}
				console.log("rohtash",data)
				this.masterService.fetchHeaderSearchData(this.searchTerm,data).subscribe(result => {
					console.log("query response",result);
					this.products = result;
					this.allproducts = result;
					this.totalCount = result?.totalPage;
					console.log("product",this.products);
					this.loaded = true;
					if (!this.firstLoad) {
						this.firstLoad = true;
					}
					this.utilsService.scrollToPageContent();
				})
			} else {
				this.searchTerm = '';
			}

			if (params['page']) {
				console.log("pageno",params.page)
				this.pageNo = params.page;
				this.apiService.fetchShopData(params, this.pageNo).subscribe(result => {
					this.products = result.data;
					this.allproducts = result
					this.totalCount = result.totalPage;
					console.log(this.totalCount)
					console.log("product",this.products)
	
					this.loaded = true;
					if (!this.firstLoad) {
						this.firstLoad = true;
					}
	
					this.utilsService.scrollToPageContent();
				})
			} else {
				this.orderBy = 'default';
			}

			
		})
	}

	ngOnInit(): void {
		if (window.innerWidth > 991) this.toggle = false;
		else this.toggle = true;

		this.getid()
	}

	getid(){
		this.masterService.getMethod("/product/menu").subscribe(res=>{
			this.productList=res
			var i=1
			for (const [key, value] of Object.entries(this.productList)) {
				const len=Object.keys(value).length
				this.newObject.push({
					id:i,
					name:key,
					value:len
				});
				i+=1
			}
		})
	}


	@HostListener('window: resize', ['$event'])
	onResize(event: Event) {
		if (window.innerWidth > 991) this.toggle = false;
		else this.toggle = true;
	}

	changeOrderBy(event: any) {
		this.router.navigate([], { queryParams: { orderBy: event.currentTarget.value, page: 1 }, queryParamsHandling: 'merge' });
	}

	toggleSidebar() {
		if (document.querySelector('body').classList.contains('sidebar-filter-active'))
			document.querySelector('body').classList.remove('sidebar-filter-active');
		else
			document.querySelector('body').classList.add('sidebar-filter-active');
	}

	hideSidebar() {
		document.querySelector('body').classList.remove('sidebar-filter-active');
	}

	value1(event:any){
		console.log("hi totalpages",event.totalPage)
		this.lenth1=event.prducts
		this.totalCount = event.totalPage
		this.totalCount = event.totalPage

		// location.reload();
	}

	onVoted(res:any){
		console.log("listner filter kaushal",res['data'] )
		this.products = res.data;
		console.log()
	}

	onVoted2(e:any){
		console.log("llisten fron gaurav",e)
		this.products = e;
		
	}
}
