import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class ApiService {

	constructor(private http: HttpClient) {
	}

	/**
	 * Get Products
	 */
	public fetchShopData(params: any, Pageno: number, initial = 'product/list'): Observable<any> {
		let temp = initial;
		if(params.category){
			temp += `/${params.category}`
		}


		if (!initial.includes('?')) {
			temp += '?';
		}
		

		if (params.page) {
			console.log(Pageno)
			temp += `page=${Pageno-1}&size=10`;
		}

		// temp += '&demo=' + environment.demo;
		// console.log(`${environment.SERVER_URL}/${temp}`)
		return this.http.get(`${environment.SERVER_URL}/${temp}`);
	}

	/**
	 * Get Products
	 */
	public fetchBlogData(params: any, initial = 'blogs/classic', perPage: number,): Observable<any> {
		let temp = initial;
		if (!initial.includes('?')) {
			temp += '?';
		}

		for (let key in params) {
			temp += key + '=' + params[key] + '&';
		}

		if (!params.page) {
			temp += 'page=1';
		}

		if (!params.perPage) {
			temp += '&perPage=' + perPage;
		}

		return this.http.get(`${environment.MOLLA_URL}/${temp}`);
	}

	/**
	 * Get Products
	 */
	public fetchSinglePost(slug: string): Observable<any> {
		return this.http.get(`${environment.MOLLA_URL}/${'single/' + slug + '?demo=' + environment.demo}`);
	}

	/**
	 * Get Products for home page
	 */
	public fetchHomeData(): Observable<any> {
		return this.http.get(`${environment.MOLLA_URL}/${environment.demo}`);
	}

	/**
	 * Get products by demo
	 */
	public getSingleProduct(slug: string, isQuickView = false): Observable<any> {
		return this.http.get(`${environment.SERVER_URL}/product/info/${slug}`);
		
	}

	/**
	 * Get Products
	 */
	public fetchHeaderSearchData(searchTerm: string,data : any): Observable<any> {
		return this.http.get(`${environment.SERVER_URL}/product/search`);
	}

	/**
	 * Get Element Products
	 */
	public fetchElementData(): Observable<any> {
		return this.http.get(`${environment.MOLLA_URL}/elements/products`);
	}

	/**
	 * Get Element Blog
	 */ 
	public fetchElementBlog(): Observable<any> {
		return this.http.get(`${environment.MOLLA_URL}/elements/blogs`);
	}
}