import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from 'src/app/shared/services/master.service';

@Component({
  selector: 'molla-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  myorder:any=[]

  constructor(private master:MasterService,private route:Router,private activeRoute:ActivatedRoute) { }

  ngOnInit(): void {
    // this.master.getMethod()
    const id = this.activeRoute.snapshot.paramMap.get('id');
    console.log("id of order",id)


    this.master.getMethod(`/order/detail/${id}`).subscribe(res=>{
        console.log("detail",res['data'])
        this.myorder = res['data']
    })


  }

}
