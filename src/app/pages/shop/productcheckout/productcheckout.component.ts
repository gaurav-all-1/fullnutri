import { Component, OnInit,HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OfferServiceService } from 'src/app/shared/services/offer-service.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


declare var Razorpay:any

// import { AnyRecord } from 'dns';


@Component({
  selector: 'molla-productcheckout',
  templateUrl: './productcheckout.component.html',
  styleUrls: ['./productcheckout.component.scss']
})
export class ProductcheckoutComponent implements OnInit {

  userForm:any
	submitted = false;
  pid:any
  loader:boolean = false;
  info:any
  change:any
  total:any
  offervalue:any
  discountoffer:any
  discount:number=0;
 paymentMode:any;
 varient:number;


  constructor(private formBuilder: FormBuilder,
    private activeRoute:ActivatedRoute,
    private offer:OfferServiceService,
    private master: MasterService,
    private toaster:ToastrService,
    private route:Router) { 


    this.activeRoute.params.subscribe((params)=>{
      console.log("product-checkout",params.id)
      this.pid = params.id
				
    })
  }

  ngOnInit(): void {

	this.activeRoute.queryParams.subscribe(res=>{
		console.log("activateroute",res);
		this.varient = res.varient
	})

    this.offer.getqty().subscribe(res=>{
      console.log("hjgdj",res)
      this.change = res
    })


    this.master.getMethod(`/product/info/${this.pid}`).subscribe(res=>{
      console.log("gggggg",res)
      this.info = res['data'][0]
      console.log(this.info)
	  for(let x of this.info.variants){
		console.log(x)
		if( x.id == this.varient){
			this.total = x.price*this.change;
		}
	}
    this.master.getMethod(`/offer/product/${this.pid}`).subscribe(res=>{
      console.log("offerproduct",res)
      this.offervalue = res
      this.discountoffer = this.total
      console.log(this.total)
      if(this.offervalue.length != 0){
        this.discount = this.offervalue[0].amount*this.change
        this.discountoffer = this.discountoffer - this.discount;
      }

      console.log("amout",this.discountoffer)
    })

    })



    this.userForm=this.formBuilder.group(
      {
  
        firstName:['', [Validators.required,Validators.pattern('^[a-zA-Z]{3,20}$')]],
        lastName:['', [Validators.required,Validators.pattern('^[a-zA-Z]{3,20}$')]],
        country:['', [Validators.required,Validators.pattern('^[a-zA-Z]{3,20}$')]],
        address:['', [Validators.required,Validators.pattern('^[a-zA-Z0-9_ ]{3,20}$')]],
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

  get f(): { [key: string]: AbstractControl } {
		return this.userForm.controls;
	  }

  placeorder(){
		this.loader = true;
    this.submitted = true;

		if (this.userForm.invalid) {
		this.loader = false;
		  return;
		}


    const data={
			"productId":this.pid,
      "variantId":this.varient,
      "quantity":this.change,
			"paymentMethod":this.paymentMode,
			"amount":this.discountoffer,
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
		console.log("cart",this.pid)
		// location.reload()
	// console.log("card-remove",this.cartService.removeFromCart(this.cartItems))
		this.master.methodPost(data,"/order/product").subscribe(res=>{
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
			this.loader = false;
				alert("you have created order by cod")
			  }
			},error=>{
			this.loader = false;
				this.toaster.error("internal server error");
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
				//   this.route.navigate(["shop/dashboard"])
				this.route.navigate(["/success"])
				//  location.reload()
				}else{
				  this.toaster.error("payment failed");
				  this.route.navigate(["/dashboard"])
			   
				}
			  })
		  
			}
	

}
