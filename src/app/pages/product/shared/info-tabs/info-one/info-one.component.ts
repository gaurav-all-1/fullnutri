import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/shared/classes/product';
import { MasterService } from 'src/app/shared/services/master.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'src/app/shared/services/modal.service';


@Component({
	selector: 'product-info-one',
	templateUrl: './info-one.component.html',
	styleUrls: ['./info-one.component.scss']
})

export class InfoOneComponent implements OnInit {
	getdescription: any
	rating: any
	name: any
	comment: any
	printreview: any
	error: boolean = false
	loader: boolean = false;
	message: string = ""
	star: any
	review: any
	reviewform: any
	token: any = localStorage.getItem("token");

	@Input() product: any;

	constructor(private masterService: MasterService, private toastrService: ToastrService,private modalService: ModalService) { }

	ngOnInit(): void {
		this.reviewform = new FormGroup({
			user: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z]{3,20}$')]),
			comment: new FormControl("", [Validators.required]),
			// email:new FormControl("",Validators.required),
		})
		console.log(this.product.id)
		console.log(this.product)
		this.reviewprint()
		this.description()



	}



	description() {
		this.masterService.getMethod(`/product/info/${this.product.id}`).subscribe(res => {
			this.getdescription = res['data']
			console.log("description", this.getdescription)
		})
	}

	reviewprint() {
		this.masterService.getMethod(`/review/list/${this.product.id}`).subscribe((allreview: any) => {
			console.log(allreview)
			this.printreview = allreview
			console.log("reviewlist", this.printreview)
		})
	}

	onContinue() {
		let authentication = localStorage.getItem("token");
		if (authentication) {
			this.loader = true;
			console.log("hello")
			var user = this.reviewform.get("user")?.value;
			console.log("user", user)
			var comment = this.reviewform.get("comment")?.value;
			// var email = this.reviewform.get("comment").value;
			console.log(user, comment)

			if (user == "" || user == undefined) {
				this.error = true;
				this.message = "please enter the name"

			} else if (comment == "" || comment == undefined) {
				this.error = true;
				this.message = "please enter the comment";
			} else {
				const data = {
					user: { id: localStorage.getItem('userId') },
					"product": { id: this.product.id },
					"comment": comment,
					"rating": this.star
				}
				console.log(data)
				this.masterService.methodPost(data, "/review/addReview").subscribe((res: any) => {
					this.review = res
					console.log(this.review)
					this.reviewprint()
					this.toastrService.success("Review Added!")
					this.loader = false

					setTimeout(() => {
						location.reload()
					}, 500)
				})
			}
		}else{
			this.modalService.showLoginModal();
		}
	}

	setRating = (event: any, num: Number) => {
		this.star = num
		console.log(num)
		event.preventDefault();

		if (event.currentTarget.parentNode.querySelector('.active')) {
			event.currentTarget.parentNode.querySelector('.active').classList.remove('active');
			console.log()
		}

		event.currentTarget.classList.add('active');
	}


}