import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { CartService } from 'src/app/shared/services/cart.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { environment } from 'src/environments/environment';
import { CartItem } from 'src/app/shared/classes/cart-item';
import { OrderIdService } from 'src/app/shared/services/order-id.service';
import { OfferServiceService } from 'src/app/shared/services/offer-service.service';

declare var $: any;
declare var Razorpay:any

@Component({
	selector: 'shop-checkout-page',
	templateUrl: './checkout.component.html',
	styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, OnDestroy {
	cardData1:any
	cart_id:any
	rzrRes:any=[]
 paymentMode:any;
	userForm:any
	submitted = false;
	productId:any=[]
	sumall:any
	cartItems = [];
	getorderid:any
	discount:number=0
	finalamount:any
	totalQuantity : number = 0;
	cartData : any ;
	totalAmount : number = 0;
	loader:boolean = false;
	
	CarListId:any=[]
	private subscr: Subscription;

	constructor(public cartService: CartService,private master: MasterService,private formBuilder: FormBuilder,
		public toaster:ToastrService,public route:Router,private orderid:OrderIdService,private offer:OfferServiceService) {


	}

	ngOnInit(): void {

		// this.offer.getdiscount().subscribe(res=>{
		// 	this.discount = res
		// })	

	

      
		// this.subscr = this.cartService.cartStream.subscribe(items => {
		// 	this.cartItems = items;
		// 	console.log("cartitems-done",this.cartItems)
		// });

		
	  this.master.getMethod(`/cart/list`).subscribe(res=>{
		  
		

		  let data = res['data'];
		  this.cartData = data;
		  localStorage.setItem('cartDataItems',JSON.stringify(data));
		  Object.keys(data).forEach((cartItem)=>{
			 this.totalAmount += parseInt(data[cartItem]['quantity'])*parseInt(data[cartItem]['inventory'].price);
			 let offerProductIdResponse = this.getofferListByProductId((data[cartItem]['inventory']['product'].id));		
			 console.log("hello",offerProductIdResponse);

			if(offerProductIdResponse.length){
				let amount = offerProductIdResponse[0].discountType == "PERCENT"? (offerProductIdResponse[0].amount *data[cartItem]['inventory'].price)/100:offerProductIdResponse[0].amount;
				if(this.discount)
				{
					this.discount = this.discount + (amount * data[cartItem]['quantity'])				
				}else{
					this.discount = amount * data[cartItem]['quantity'];
				}
			}

			console.log("disCount",this.discount); 
			this.finalamount = this.totalAmount-this.discount
			this.totalQuantity += parseInt(data[cartItem]['quantity']);
		  })
	  })
  

  

		// for(let x=0;x<this.cartItems.length ;x++){
		// 	this.productId.push({"id":this.cartItems[x].id})
		// }
		// console.log("nutri-gaurav",this.productId)	
		this.getId()

		// this.sumall=0;
		// this.cartItems.forEach(item=>{
		// 	this.sumall+=(item.variants[0].price*item.qty)
		//   });

		document.querySelector('body').addEventListener("click", () => this.clearOpacity())


		this.userForm=this.formBuilder.group(
		{
			
			firstName:['', [Validators.required,Validators.pattern('^[a-zA-Z]{3,20}$')]],
			lastName:['', [Validators.required,Validators.pattern('^[a-zA-Z]{3,20}$')]],
			country:['', [Validators.required,Validators.pattern('^[a-zA-Z]{3,20}$')]],
			address:['', [Validators.required,Validators.pattern('^[a-zA-Z0-9_ ]{3,200}$')]],
			city:['', Validators.required],
			state:['', Validators.required],
			pinNumber:['', [Validators.required,Validators.pattern('[0-9 ]{6}')]],
			Phone:['', [Validators.required,Validators.pattern('[0-9 ]{10}')]],
			Email:['', [Validators.required,Validators.pattern('^[a-zA-Z]+([.-]?[a-zA-Z0-9]+)*@([a-zA-Z]+([.-]?[a-zA-Z]))[.]{1}[a-zA-Z]{2,}$')]]
 
		}
		   );
	}

	onItemChange(e:any){
		// console.log(" Value is : ", e.target.value );
		this.paymentMode = e.target.value
		console.log(this.paymentMode)
	 }


	getofferListByProductId(productId){
		console.log("hi product",productId)
		let offerData = localStorage.getItem("offerData");
		if(offerData)
		{
			let	offerJsonData = JSON.parse(offerData);

		
		let productList = offerJsonData;
		// this.setofferList(productList);
		console.log(productList)
		let response = productList.filter( res=> res.product?.id == productId);
		return response;
		}
	  }

	getId(){
		debugger;
		this.master.getMethod(`/cart/list`).subscribe(res=>{
			// console.log("cart-checkout",res['data'])
			this.cart_id = res['data']
			console.log("get-cart-id",this.cart_id)
			for(let y=0; y<this.cart_id.length ;y++){
				this.CarListId.push({"id":this.cart_id[y].id}) 
			}
			this.orderid.setOrderList(this.CarListId)
			console.log("cartlistid",this.CarListId)    
		})
	
	}

	

	get f(): { [key: string]: AbstractControl } {
		return this.userForm.controls;
	  }

	// getCardData(){
	// 	this.master.getMethod("/cart/list").subscribe((res:any)=>{
	// 	   this.cardData1=res.data;
	// 	   console.log(this.cardData1)
	// 	   for(let x=0;x<this.cardData1.length ;x++){
	// 		this.productId.push({"id":this.cardData1[x].id})
	// 	   }
		  
		  
	
		  
	// 	})
	//   }


	placeorder(){
		// var firstName=this.userForm.get("firstName")?.value;
		// var lastName=this.userForm.get("lastName")?.value;
		// var country=this.userForm.get("country")?.value;
		// var address=this.userForm.get("address")?.value;
		// var city=this.userForm.get("city")?.value;
		// var state=this.userForm.get("state")?.value;
		// var pin=this.userForm.get("pinNumber")?.value;
		// var phone=this.userForm.get("Phone")?.value;
		// var email=this.userForm.get("Email")?.value;
		this.loader = true;
		this.submitted = true;

		if (this.userForm.invalid) {
		this.loader = false;
		  return;
		}
	
		console.log(JSON.stringify(this.userForm.value, null, 2));
		
		// firstName:['', Validators.required],
		// 	lastName:['', Validators.required],
		// 	country:['', Validators.required],
		// 	address:['', Validators.required],
		// 	city:['', Validators.required],
		// 	state:['', Validators.required],
		// 	pinNumber:['', Validators.required],
		// 	Phone:['', Validators.required],
		// 	Email:['', Validators.required]
		
		const data={
			"cartItem":this.CarListId,
			"paymentMethod":this.paymentMode,
			"amount":this.finalamount,
			"shippingAddress":{
			  "name":this.userForm.get("firstName")?.value + this.userForm.get("lastName")?.value,
			  "country":this.userForm.get("country")?.value,
			  "street":this.userForm.get("address")?.value,
			  "state":this.userForm.get("state")?.value,
			  "city":this.userForm.get("city")?.value,
			  "pincode":this.userForm.get("pinNumber")?.value,
			  "mobile":this.userForm.get("Phone")?.value,
			  "email":this.userForm.get("Email")?.value
			}
		}
		console.log("cart",this.cartItems)
		// location.reload()
	// console.log("card-remove",this.cartService.removeFromCart(this.cartItems))
		this.master.methodPost(data,"/order/create").subscribe(res=>{
			console.log(res, res.msg=="make payment");
			this.loader = false;
			if(!res.status){
			  alert("something Wrong check once again")
			}
			if( res.msg=="make payment"){
				console.log("hi");
			  var options = {
				"key": environment.razorKey, // Enter the Key ID generated from the Dashboard
				"amount": res.data[1], // razorpay amount 
				"currency": "INR",
				"name": "Nutri-Village",
				"description": "Nutri_village Payment",
				"image": "http://cloud.flybunch.com/images/faviconnutri.jpeg",
				"order_id": res.data[0], //razorpay id 
				"handler":function(response:any){
					console.log(response);
					let data = response;
					// data["order"]={"id":res.data[2}
					var event = new CustomEvent("successPayment",{
						detail:data,
						bubbles:true,
						cancelable:true
					})
				 window.dispatchEvent(event);
				},
				"prefill": {
					"name": "Gaurav Kumar",
					"email": "gaurav.kumar@example.com",
					"contact": "9999999999"
				},
				"notes": {
					"address": "Razorpay Corporate Office"
				},
				"theme": {
					"color": "#a6c76c"
				}};
				var rzp1 = new Razorpay(options);
				rzp1.open();
				rzp1.on('payment.failed', function (response: any) {
				//   Todo - store this information in the server
				  console.log(response.error.code);
				  console.log(response.error.description);
				  console.log(response.error.source);
				  console.log(response.error.step);
				  console.log(response.error.reason);
				  console.log(response.error.metadata.order_id);
				  console.log(response.error.metadata.payment_id);
				}
				);
			}else{
				// alert("you have created order by cod")
				this.toaster.success("You have created order by cod");
				// location.reload()
			  }
			},error=>{
				this.loader = false;
				this.toaster.error("Something wrong with the Server. Please try again later!");

			})
		  
			}
		  
			@HostListener('window:paymentSuccess',['$event'])
			paymentSuccess(event:any){
			  console.log("detail-rzr",event.detail)
			  const data = {
				razorpayPaymentId: event.detail.RZPPID,
				razorpayOrderId :event.detail.RzpOid,
				razorpaySignature: event.detail.RzpSign	
			  }
			  this.master.methodPut(data,`/order/validatePayment`).subscribe((res:any)=>{
				console.log(res)
			  })
			}
			// onSubmit(){
			//   var firstName=this.userForm.get("firstName")?.value;
			//   var lastName=this.userForm.get("lastName")?.value;
			//   var email=this.userForm.get("Email")?.value;
			//   var phone=this.userForm.get("Phone")?.value;
			//   var state=this.userForm.get("state")?.value;
			//   var city=this.userForm.get("city")?.value;
			//   var pin=this.userForm.get("pinNumber")?.value;
			//   var address=this.userForm.get("address")?.value;
			//  console.log(firstName,lastName,email,phone,state,city,pin,address)
			// }
			@HostListener("window:successPayment",['$event'])
			onPaymentSuccess(event:any):void {
			  console.log("event-razor",event);
			  let data = {
				'razorpayOrderId':event.detail.razorpay_order_id,
				'razorpayPaymentId':event.detail.razorpay_payment_id,
				'razorpaySignature':event.detail.razorpay_signature
			  }
			  debugger
			 
			  this.master.methodPut(data,`/order/validatePayment`).subscribe((res:any)=>{
				console.log("razor-res",res);
				if(res.status){
				  this.toaster.success("payment successful by rzp")
				  
				  this.route.navigate(["/success"])
				// window.location.href = "/shop/dashboard";
				 
				}else{
				  this.toaster.error("payment failed");
				  this.route.navigate(["/dashboard"])
			   
				}
			  })
		  
			}
	

	ngOnDestroy(): void {
		// this.subscr.unsubscribe();
		document.querySelector('body').removeEventListener("click", () => this.clearOpacity())
	}

	clearOpacity() {
		let input: any = document.querySelector('#checkout-discount-input');
		if (input && input.value == "") {
			let label: any = document.querySelector('#checkout-discount-form label');
			label.removeAttribute('style');
		}
	}

	addOpacity(event: any) {
		event.target.parentElement.querySelector("label").setAttribute("style", "opacity: 0");
		event.stopPropagation();

	}

	formToggle(event: any) {
		const parent: HTMLElement = event.target.closest('.custom-control');
		const submenu: HTMLElement = parent.closest('.form-group').querySelector('.shipping-info');

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

		event.preventDefault();
		event.stopPropagation();
	}
}

