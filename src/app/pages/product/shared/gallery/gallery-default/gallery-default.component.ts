import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';

import { Product } from 'src/app/shared/classes/product';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'product-gallery-default',
	templateUrl: './gallery-default.component.html',
	styleUrls: ['./gallery-default.component.scss']
})

export class GalleryDefaultComponent implements OnInit {

	@Input() product: Product;
	@Input() adClass = 'product-gallery-vertical';

	paddingTop = '100%';
	currentIndex = 0;
	album = []; 
	lightBoxOption = {
		showImageNumberLabel: true,
		centerVertically: true,
		showZoom: true,
		fadeDuration: .2,
		albumLabel: "%1 / %2"
	}


	MOLLA_URL = environment.MOLLA_URL;

	constructor(public lightBox: Lightbox) { }

	@HostListener('window:resize', ['$event'])
	closeLightBox(event: Event) {
		this.lightBox.close();
	}

	ngOnChanges() {
		this.album = [];
		debugger;
		for (let i = 0; i < this.product['productImage'].length; i++) {
			this.album.push({
				src:  this.product['productImage'][i].url,
				thumb:  this.product['productImage'][i].url,
				caption: this.product.name
			});
		}
	}

	ngOnInit(): void {
		debugger;
		this.product.stock = this.product.variants[0].quantity;
		this.product.new = this.product.quantity>200?true:false;
		this.product.top = false;
		console.log(this.product);

		// this.paddingTop = Math.floor((parseFloat(this.product.pictures[0].height.toString()) / parseFloat(this.product.pictures[0].width.toString()) * 1000)) / 10 + '%';

	}

	changeImage($event: Event, index = 0) {
		this.currentIndex = index;
		$event.preventDefault();
	}

	openLightBox() {
		this.lightBox.open(this.album, this.currentIndex, this.lightBoxOption);
	}
}