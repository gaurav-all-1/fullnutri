import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
	selector: 'molla-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {

	token:any=localStorage.getItem("token");

	@Input() containerClass = "container";
	@Input() isBottomSticky = false;

	year: any;

	constructor(private modalservice:ModalService) {
	}

	ngOnInit(): void {
		this.year = (new Date()).getFullYear();

		
	}

	showmodal(e:any) {
		this.modalservice.showLoginModal();
	}
}
