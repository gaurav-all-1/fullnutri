import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable(
    {
        providedIn: 'root'
  
    }
)
export class IdServices {

    newID:any
  // Observable string sources
  private GetID= new Subject<string>();
  

  // Observable string streams
  missionAnnounced$ = this.GetID.asObservable();
 

  // Service message commands
  announceMission(mission: any) {
    console.log("related service",mission);
    this.GetID.next(mission);
  }
  

}