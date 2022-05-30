import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferServiceService {

  private offerList = new BehaviorSubject<any>('initialState');
  private discountno = new BehaviorSubject<any>('initialState');
  private changeqty = new BehaviorSubject<any>('initialState');

  constructor() { }

  setofferList(list:any){
    this.offerList.next(list);
  }

  getofferList(){
    return this.offerList.asObservable();
  }

  getofferListByProductId(productId){
    console.log("hi product",productId)
    let productList = this.offerList.getValue()
    this.setofferList(productList);
    console.log(productList)
    let response = productList.filter( res=> res.product?.id == productId);
    return response;
  }
  
  setdiscount(no:any){
    this.discountno.next(no);
  }

  getdiscount(){
    return this.discountno.asObservable();
  }


  setqty(value:any){
    this.changeqty.next(value);
  }

  getqty(){
    return this.changeqty.asObservable();
  }

}
