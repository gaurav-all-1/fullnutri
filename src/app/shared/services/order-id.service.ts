import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderIdService {

  listId:any=[]

  private orderId = new BehaviorSubject<any>('initialState');

  constructor() { }

  setOrderList(id:any){
    this.listId= id
  }

  getOrderList(){
    return this.listId
  }

  

}
