import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/category.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
	selector: 'molla-mobile-menu',
	templateUrl: './mobile-menu.component.html',
	styleUrls: ['./mobile-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class MobileMenuComponent implements OnInit, OnDestroy {

	searchTerm = "";
	categoryList:any=[{name:"hi"}];
	productList:any;
	liveurl:any

	private subscr: Subscription;

	constructor(private router: Router,private masterService:MasterService,private categoryService:CategoryService) {
		this.subscr = this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.hideMobileMenu();
			}
		});
	}

	ngOnInit(): void {

		this.liveurl = location.href

		this.categoryService.getCategoryList().subscribe(res=>{
			this.categoryList = res.slice(0,5);
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

	submenuToggle(e) {
		const parent: HTMLElement = e.target.closest('li');
		const submenu: HTMLElement = parent.querySelector('ul');

		if (parent.classList.contains('open')) {
			$(submenu).slideUp(300, function () {
				parent.classList.remove('open');
			});
		}
		else {
			$(submenu).slideDown(300, function () {
				parent.classList.add('open');
			});
		}

		e.preventDefault();
		e.stopPropagation();
	}

	hideMobileMenu() {
		document.querySelector('body').classList.remove('mmenu-active');
		document.querySelector('html').removeAttribute('style');
	}

	submitSearchForm(e: any) {
		e.preventDefault();
		this.searchTerm = e.currentTarget.querySelector('.form-control').value;
		this.router.navigate(['/shop/sidebar/list'], { queryParams: { searchTerm: this.searchTerm } });
	}
}
