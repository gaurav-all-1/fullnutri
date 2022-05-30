import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from 'src/app/shared/services/master.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'molla-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

	userForm?:FormGroup;
	changePassword:any
  	message:string=''
	error:boolean=false
	key:any
	loader:boolean = false;


  constructor(private master:MasterService, private toaster:ToastrService,private route:Router,private activeRoute:ActivatedRoute) { 

	this.activeRoute.queryParams.subscribe(params=>{
		console.log("params_value",params)
		this.key = params.key
	})
  }

  ngOnInit(): void {

	

    this.changePassword = new FormGroup({
			// olderpass: new FormControl(),
			newpass: new FormControl(),
			confirmpass: new FormControl()
		  })	
  }

  onchangepass(){

	this.loader = true;

    
		// var oldpassword =this.changePassword.get("olderpass").value;
		
		var newpassword =this.changePassword.get("newpass").value;
		
		var confirmpassword =this.changePassword.get("confirmpass").value;
		
    if(newpassword=="" || newpassword==undefined || newpassword==null){
		  this.error=true
		  this.message="Please enter new password"
		  this.loader = false;
		  return
		}else if(confirmpassword=="" || confirmpassword==undefined || confirmpassword==null){
		  this.error=true
		  this.message="Please enter confirm password"
		  this.loader = false;
		  return
		}else{
			if(confirmpassword==newpassword){
				const data = {
				  "newPassword":newpassword,
				  "token":this.key				  
				}
				this.master.methodPut(data,`/user/changePassword`).subscribe(res=>{
					// console.log("reset password",res)
					// this.toaster.success("your password is reset successfully")
					// this.route.navigateByUrl("/")
				this.loader = false;

				 if(res['message']!=null){
					 this.toaster.success("Your password has been changed, Please log in with the updated credentials.");
					 this.route.navigateByUrl("/");
					 return
				 }else{
					this.loader = false;
					this.error=true
					this.message="Something went wrong please try again later."
					return
				  }
				},(error)=>{
					this.loader = false;
					this.toaster.error("Something went wrong, please try creating a fresh forgotpassword link.")
				})
				return
			  }else{
				this.loader = false;
				this.error=true
				this.message="Password and confirm password should be same."
				return 
			  }
		}
	
		
	}

}
