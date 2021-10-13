import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { FieldStatus } from '../models/field-status.model'


// Service to fetch field status data.
@Injectable()
export class FieldStatusService {

  apiUrl: string = "https://127.0.0.1:44340/api";
  constructor(private http: HttpClient)
  {
    
  }

  // Get the field status for the user with the given email address.
  public getCurrentFieldStatusForEmail(email: string): Observable<FieldStatus> {
    let headers = new HttpHeaders({"Content-Type": "application/json"});  
    return this.http.get<FieldStatus>(this.apiUrl + '/StatusForEmail/' + email, {headers: headers})
  }

  public add(item: FieldStatus): Observable<FieldStatus> {
    console.log("FieldStatus Data:" + item);
    let headers = new HttpHeaders({"Content-Type": "application/json"});
    return this.http.post<FieldStatus>(this.apiUrl+"/FieldStatus/", item, {headers: headers})
  }

}
