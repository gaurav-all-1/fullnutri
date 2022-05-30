import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private notifyService:ToastrService,
        private router:Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            // debugger;
            if(request.url.indexOf("/login")<0){
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.logOut();
                // alert("error")
                // location.reload();
            }
        }
            
            
            const error = err;
            return throwError(error);
        }))
    }


    logOut(){
		alert("Authentication has expired, Signing out!");
		localStorage.removeItem('token');
		localStorage.removeItem("userId");
		window.location.href = "/";
	   }
}


