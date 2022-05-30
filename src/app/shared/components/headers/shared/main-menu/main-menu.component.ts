import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/shared/services/category.service';
import { MasterService } from 'src/app/shared/services/master.service';

@Component({
	selector: 'molla-main-menu',
	templateUrl: './main-menu.component.html',
	styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {

	current = '/';
	category = [];
	categoryList:any=[{name:"hi"}];
	productList:any;
	private subscr: Subscription;

	constructor(private router: Router,private masterService:MasterService,private categoryService:CategoryService) {
		this.subscr = this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.current = event.url;
			} else if (event instanceof NavigationEnd) {
				this.current = event.url;
			}
		});

		
	}

	ngOnInit(): void {
		this.categoryService.getCategoryList().subscribe(res=>{
			this.categoryList = res.slice(0,4);
			console.log("hi in main2",this.categoryList)
		})
 
		this.masterService.getMethod("/product/menu").subscribe((res)=>{
			console.log(res);
			this.productList= res
		})
	}

	ngOnDestroy(): void {
		this.subscr.unsubscribe();
	}

	viewAllDemos(event: any) {
		event.preventDefault();
		var list = document.querySelectorAll('.demo-list .hidden');
		for (let i = 0; i < list.length; i++) {
			list[i].classList.add('show');
		}

		event.target.parentElement.classList.add('d-none');
	}

	// showDefinition(e){
	// 	alert(e)
	// }
}
