import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // categoryList:any;

  private categoryList = new BehaviorSubject<any>('initialState');

  

  constructor() { 

  }

  setCategoryList(list:any){
    this.categoryList.next(list);
  }

  getCategoryList(){
    return this.categoryList.asObservable();
  }
}
