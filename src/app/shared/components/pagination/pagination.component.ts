import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'molla-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent implements OnInit, OnChanges {

	@Input() adClass = '';
	@Input() perPage = 12;
	@Input() total = 1;

	currentPage = 1;
	lastPage = 1;
	startIndex = 1;
	pagesToBeShown = [];
	params = {};

	constructor(public activeRoute: ActivatedRoute, public router: Router) {
		activeRoute.queryParams.subscribe(params => {
			this.params = params;
			this.refresh();
		})
		console.log("total",this.total,"per page",this.perPage)
	}

	ngOnChanges() {
		this.refresh();
	}

	ngOnInit(): void {
	}

	refresh() {
		this.currentPage = this.params['page'] ? parseInt(this.params['page']) : 1;
		this.lastPage = this.total;
		this.startIndex = 1;

		this.pagesToBeShown = [];

		let pageCount = this.total;

		for (let i = -1; i < 2 && pageCount >= 3; i++) {
			if (1 < this.currentPage && this.currentPage < pageCount)
				this.pagesToBeShown.push(this.currentPage + i);
			if (1 === this.currentPage)
				this.pagesToBeShown.push(this.currentPage + i + 1);
			if (this.currentPage === pageCount)
				this.pagesToBeShown.push(this.currentPage + i - 1);
		}

		for (let i = 0; i < pageCount && pageCount < 3; i++) {
			this.pagesToBeShown.push(i + 1);
		}
	}
}