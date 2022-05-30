import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { routeAnimation } from '../data';


@Component({
  selector: 'molla-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit,OnDestroy {

	current = "/";

	private subscr: Subscription;


  constructor(private router: Router) {
  
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
		// this.subscr.unsubscribe();
	}

	@HostListener('window:resize', ['$event'])
	handleKeyDown(event: Event) {
		this.resizeHandle()
	}

	prepareRoute (outlet: RouterOutlet) {
		return outlet && outlet.isActivated && outlet.activatedRoute && outlet.activatedRoute.url;
	}

	resizeHandle() {
	
	}

}
