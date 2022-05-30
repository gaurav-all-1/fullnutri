import { Component, OnInit } from '@angular/core';
import Cookie from 'js-cookie';
import { ToastrService } from 'ngx-toastr';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from 'src/environments/environment';
import { MasterService } from 'src/app/shared/services/master.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
	selector: 'molla-newsletter-modal',
	templateUrl: './newsletter-modal.component.html',
	styleUrls: ['./newsletter-modal.component.scss']
})

export class NewsletterModalComponent implements OnInit {


	emailForm:any
	checkState = false;

	constructor(private modalService: NgbActiveModal,private master:MasterService,private toaster:ToastrService) {
		this.emailForm = new FormGroup({
			email : new FormControl()
		  })
	 }

	ngOnInit(): void {
	}

	onSave(){ 
		var email = this.emailForm.get("email").value;
		alert(email)
		console.log(email);
		var data = {
			service_id: 'service_8zp4yhp',
			template_id: 'template_kvsj7kk',
			user_id: 'user_mTjMBBP092bpZsnZTyLfp',
			template_params: {
				'company': 'Nutrivillage',
				'reply_to': 'gaurav.singhal@flybunch.com',
				'user_email': email
			}
		  };	

		  this.master.sendMail(data).subscribe(res=>{
	  
			
	  
		  }, err=>{
			this.toaster.success("subscribed successfully")
		 });
	}

	changeCheck() {
		this.checkState = !this.checkState;
	}

	closeModal() {
		this.modalService.dismiss();
		this.checkState && Cookie.set(`hideNewsletter-${environment.demo}`, "true", { expires: 7 });
	}
}