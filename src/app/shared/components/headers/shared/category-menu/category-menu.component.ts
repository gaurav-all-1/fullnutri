import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { MasterService } from 'src/app/shared/services/master.service';

@Component( {
 selector: 'molla-category-menu',
 templateUrl: './category-menu.component.html',
 styleUrls: [ './category-menu.component.scss' ]
} )

export class CategoryMenuComponent implements OnInit {

 categoryList:any=[]

 constructor (private master:MasterService,private categoryService:CategoryService) { }

 ngOnInit (): void {
  this.getAllCategory();
 }

 getAllCategory(){
  this.master.getMethod("/GetCategories").subscribe(data=>{
    this.categoryList=JSON.parse(JSON.stringify(data));
    this.categoryService.setCategoryList(this.categoryList)
  })
 }

 
}


