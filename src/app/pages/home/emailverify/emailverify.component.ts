import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/shared/services/master.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'molla-emailverify',
  templateUrl: './emailverify.component.html',
  styleUrls: ['./emailverify.component.scss']
})
export class EmailverifyComponent implements OnInit {

	userForm?:FormGroup;
  message:string=''
	error:boolean=false
	loader:boolean = false;


  constructor(private master:MasterService,private toaster:ToastrService) { }

  ngOnInit(): void {
    this.userForm = new FormGroup({
			email : new FormControl("",[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])
		  })
  }

  updatePassword(){
		this.loader = true;

    var Email = this.userForm.get("email").value;
		console.log(Email);
    if(Email == "" || Email == null){
		  this.error = true;
		  this.message = "Please provide email";
		  return;
		}else {
        this.master.getGenericMethod(`/user/ForgotPassword?email=${Email}`).subscribe(res=>{
          console.log(res);
		      this.loader = false;
          this.toaster.success("Link has been send to your account email, Please reset the password using that link.")
				 this.userForm.reset()
        },(error:HttpErrorResponse)=>{
          this.loader = false;
          this.toaster.error(error.error.error);
        })
    } 
  }

}
