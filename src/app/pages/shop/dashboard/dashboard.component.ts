import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/shared/services/cart.service';
import { MasterService } from 'src/app/shared/services/master.service';
// import {CLEAR_CART} from 'src/app/core/constants/constants'

@Component({
	selector: 'shop-dashboard-page',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

	token:any=localStorage.getItem("token");
	userForm?:FormGroup;
	changePassword:any
	message:string=''
	error:boolean=false
	message1:string=''
	error1:boolean=false
	userId=localStorage.getItem("userId");
	AllOrder:any=[]
	hide = true;
	orderId:any

	constructor(private el: ElementRef, private renderer: Renderer2,private master:MasterService,private toaster:ToastrService,private cartservice:CartService) {
	}

	ngOnInit(): void {
		this.userForm = new FormGroup({
			firstName : new FormControl(),
			lastName : new FormControl(),
			phone : new FormControl(),
			email : new FormControl(),
			country : new FormControl(),
			state : new FormControl(),
			city : new FormControl(),
			pin : new FormControl(),
			address : new FormControl()
		  })
		  this.changePassword = new FormGroup({
			olderpass: new FormControl(),
			newpass: new FormControl(),
			confirmpass: new FormControl()
		  })
		  this.GetAllOrder()
		  
		  this.master.getMethod("/getProfile?userId="+this.userId).subscribe(res=>{
			  console.log("****");
			  console.log(res);
			  this.userForm.patchValue(res);
		  });
	}



	logOut(){
		alert("Are you sure");
		localStorage.removeItem('token');
		localStorage.removeItem("userId");
		this.cartservice.clearCart()
		location.reload();
	   }

	viewTab($event: Event, prevId: number, nextId: number) {
		$event.preventDefault();
		let nodes = this.el.nativeElement.querySelectorAll(".nav-dashboard .nav-link");
		this.renderer.removeClass(nodes[prevId], 'active');
		this.renderer.addClass(nodes[nextId], 'active');
	}
	onSave(){ 
		var firstName = this.userForm.get("firstName").value;
		console.log(firstName);
		var lastName = this.userForm.get("lastName").value;
		console.log(lastName);
		var Mobile = this.userForm.get("phone").value;
		console.log(Mobile);
		var Email = this.userForm.get("email").value;
		console.log(Email);
		var Country = this.userForm.get("country").value;
		console.log(Country);
		var State = this.userForm.get("state").value;
		console.log(State);
		var City = this.userForm.get("city").value;
		console.log(City);
		var Pin = this.userForm.get("pin").value;
		console.log(Pin);
		var Add = this.userForm.get("address").value;
		console.log(Add);
	
	
		if(firstName == "" || firstName == null){
		  this.error = true;
		  this.message = "Please provide firstname";
		  return;
		}
		else if(lastName == "" || lastName == null){
		  this.error = true;
		  this.message = "Please provide lastname";
		  return;
		}
		else if(Mobile == "" || Mobile == null){
		  this.error = true;
		  this.message = "Please provide mobile";
		  return;
		}
		else if(Email == "" || Email == null){
		  this.error = true;
		  this.message = "Please provide email";
		  return;
		}
		else if(Country == "" || Country == null){
		  this.error = true;
		  this.message = "Please provide country";
		  return;
		}
		else if(State == "" || State == null){
		  this.error = true;
		  this.message = "Please provide state";
		  return;
		}
		else if(City == "" || City == null){
		  this.error = true;
		  this.message = "Please provide city";
		  return;
		}
		else if(Pin == "" || Pin == null){
		  this.error = true;
		  this.message = "Please provide pincode";
		  return;
		}
		else if(Add == "" || Add == null){
		  this.error = true;
		  this.message = "Please provide address";
		  return;
		}
		else{
		  const data = {
			"firstName":firstName,
			"lastName":lastName,
			"email":Email,
			"aboutMe":null,
			"phone":Mobile,
			"profilePicName":null,
			"placeOfBirth":null,
			"dob":null,
			"timeOfBirth":null,
			"country":Country,
			"gender":null,
			"city":City,
			"state":State,
			"pin":Pin,
			"address":Add			
		  }
		  this.master.methodPost(data, "/saveProfile?userId="+this.userId).subscribe(res=>{
			if(res["message"]!=""){
			  this.error = false;
			  this.toaster.success("Your profile has been saved successfully ");
			  location.reload()
			  return 
			}else{
			  this.error = true;
			  this.toaster.error( "Something went wrong please check carefully");
			}
		  },(error)=>{
			this.toaster.error("something went wrong please check again!");
		  })
		}
	  }


	  onchangepass(){
    
		var oldpassword =this.changePassword.get("olderpass").value;
		
		var newpassword =this.changePassword.get("newpass").value;
		
		var confirmpassword =this.changePassword.get("confirmpass").value;
		
		if(oldpassword=="" || oldpassword==undefined || oldpassword==null){	
		  this.error1=true
		  this.message1="please old password"
		  return
		}else if(newpassword=="" || newpassword==undefined || newpassword==null){
		  this.error1=true
		  this.message1="please new password"
		  return
		}else if(confirmpassword=="" || confirmpassword==undefined || confirmpassword==null){
		  this.error1=true
		  this.message1="please confirm password"
		  return
		}else{
			if(confirmpassword==newpassword){
				const data = {
				  "oldPassword":oldpassword,
				  "newPassword":newpassword,				  
				}
				this.master.methodPost(data, `/user/updatePassword`).subscribe(res=>{
					console.log(res)
				 if("message"!=null){
					 this.toaster.success("Your password has been changed");
					
					 
					 return
				
				 }else{
					this.error1=true
					this.message1="Something went wrong password"
					return
				  }
				})
				return
			  }else{
				this.error1=true
				this.message1="please enter valid password"
				return 
			  }
		}
	
		
	}

	GetAllOrder(){
		this.master.getMethod("/order/user/list").subscribe(res=>{
			this.AllOrder=res['data']
			console.log("all-order-user",this.AllOrder)
		})
	}

	cancelOrder(x:number){

		this.orderId = x

		const data = {
			"id":this.orderId,
			"status":"canceled",
			"comment":"Sorry order by mistake"
		}

		this.master.methodPut(data,`/order/userOrderCancel`).subscribe(res=>{
			alert("Are you sure")
			this.toaster.success("Order cancel successfully")
			location.reload()
		})
	}
	
}
