import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'molla-socialauth',
  templateUrl: './socialauth.component.html',
  styleUrls: ['./socialauth.component.scss']
})
export class SocialauthComponent implements OnInit {

  id:any
  token:any

    
    constructor(private activeRoute:ActivatedRoute, private route:Router, private toaster:ToastrService) {

      


     }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params=>{
      console.log("akash",params)
      this.id = params.id
      this.token = params.token
      if(this.token!="" && this.token!=undefined){
        localStorage.setItem("token", this.token);
        localStorage.setItem("userId", this.id);
        // this.message="You are logged in"
        // setTimeout(()=>{
        //  this.route.navigateByUrl("/");
        // },700)
        window.location.href = "https://nutrivillage.in/";

      // location.reload()

      }else {
        this.toaster.error("something went wrong")
      }
    })
  }

}
