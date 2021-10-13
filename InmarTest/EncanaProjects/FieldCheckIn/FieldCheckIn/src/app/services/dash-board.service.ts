import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Text } from '@angular/compiler';
import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { DataService } from './data.service'
import { DashBoardView } from '../models/dashboard-view.model'
import { FieldStatus } from '../models/field-status.model'


// Service to fetch dash-board data.
@Injectable()
export class DashBoardService{

  constructor(private http: HttpClient) {
  }

  apiUrl: string = "https://127.0.0.1:44340/api/DashBoard";

  public getDashboardData(statusDate: string,userName:string): Observable<any> {
    let headers = new HttpHeaders({"Content-Type": "application/json"});
    return this.http.get<DashBoardView[]>(this.apiUrl + '/GetStatusForDate/' + statusDate+ '/' + "userName", {headers: headers} );
  }

 /* public add(item: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, item)
  }*/
  public changeStatus(fieldstatus: FieldStatus): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post<boolean>(this.apiUrl + '/ChangeStatus/', fieldstatus, {headers: headers});
  }
}


