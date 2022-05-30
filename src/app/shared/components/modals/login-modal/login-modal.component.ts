import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/shared/services/cart.service';
import { MasterService } from 'src/app/shared/services/master.service'; 

@Component({
	selector: 'molla-login-modal',
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.scss']
})

export class LoginModalComponent implements OnInit {
	loginForm:any
	registerForm:any
	error:boolean=false
  message:string=""
  error1:boolean=false
  message1:string=""
  loader:boolean=false

	constructor(private masterService:MasterService,private route:Router,private cartService:CartService,private toastr:ToastrService) { }

	ngOnInit(): void {
		this.loginForm=new FormGroup({
			email : new FormControl("",[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]),
			password:new FormControl("",Validators.required)
			
		  })

		  this.registerForm=new FormGroup({
			email : new FormControl("",[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]),
			password:new FormControl("",Validators.required),
			confirmpassword:new FormControl("",Validators.required)
		  })
	}

	onlogin() {

			this.loader = true;
			var email=this.loginForm.get("email").value;
			var password=this.loginForm.get("password").value;
			if(email==""||email==undefined){
			  this.error=true;
			  this.message="Please enter your email id"
			  
			}else if (password==""|| password==undefined){
			  this.error=true;
			  this.message="Please enter your password";
			
			}else{
			  const data={
				"username":email,
				"password":password
			  }
			  this.masterService.methodPost(data,"/login").subscribe((res:any)=>{
				var data=JSON.parse(JSON.stringify(res));
				console.log(data)
				console.log(data.token)
				this.loader = false;
				if(data.token!="" && data.token!=undefined){
				  localStorage.setItem("token", data.token);
				  localStorage.setItem("userId", data.id);
				  
				  this.error=false;
				  this.message="You are logged in"
				  this.route.navigate([" "])

				// var datacart:any = localStorage.getItem('cartDataOffline')
				// var varient:any = localStorage.getItem('offlineVarient')
				// var quantity:any = localStorage.getItem('offlineQuantity')

				// this.cartService.addToCart(datacart,varient,quantity);	

				location.reload()

				}else{
				  this.error=false;
				  this.message="Something wrong please check your details"
				  this.loader = false;
				}
				
			  },(err)=>
			  {
				  this.toastr.error("Invalid Credentials!");
				  this.loader = false;
				 
				}
			  )
			   
			}
		 
		  
	}

	userRegister(){
		this.loader = true;
		var email=this.registerForm.get("email").value;
		var confirmpassword=this.registerForm.get("confirmpassword").value;
		var password=this.registerForm.get("password").value;
		console.log(email,password)
		if (email=="" || email==undefined || email==null){
			this.loader = false;
		  this.error1=true
		  this.message1="Please enter the email ID"
		  
		}else if  (password==""|| password==undefined || password==null){
			this.loader = false;
		  this.error1=true;
		  this.message1="Please enter your password"
		}
		else if  (confirmpassword==""|| confirmpassword==undefined || confirmpassword==null){
			this.loader = false;
			this.error1=true;
			this.message1="Please enter your password"
		  }else{
			  if(confirmpassword==password){
				const data={
					"email":email,
					"password":password
				  }
				  this.masterService.methodRegistrationPost(data,"/user/registration").subscribe(res=>{

					var data=JSON.parse(JSON.stringify(res));
					console.log(data)
					this.loader = false;
				   if(data["message"]!=""){
					   
					 this.error1=false;
					 this.message1="You are Registered Please Login"
					 this.route.navigate([" "]);
					 location.reload();
					 
				   }else{
					this.loader = false;

					 this.error1=true
					 this.message1="Something wrong please try again"

				   }

				  
			  },(err)=>
			  {if(err)
				{
					this.loader = false;
					this.toastr.error(err.error.message);
				}
			  }
		 )
		 
		  
		}else{
					this.loader = false;
					this.error1=true
					 this.message1="Something wrong please try again"
		}
		
	   
	  }
	}

	closeModal() {
		let modal = document.querySelector('.login-modal') as HTMLElement;
		if (modal)
			modal.click();
	}
}