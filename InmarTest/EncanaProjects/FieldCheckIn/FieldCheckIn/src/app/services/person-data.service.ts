import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Text } from '@angular/compiler';
import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { DataService } from './data.service'


// Service to fetch area and route information.
@Injectable()
export class PersonDataService {

  constructor(private http: HttpClient) {
  }

  apiUrl: string = "https://127.0.0.1:44340/api/PersonData";

  public getLoginInformation(userName: string): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.append('responseType', 'json');
    userName = 'Sinha, Sujeet';
    return this.http.post<boolean>(this.apiUrl + '/' + userName, { headers: headers });
  }

  public getSupervisorInfo(emailAddress: string): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    let HTTPOptions: Object = {

      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    }

    return this.http.get<string>(this.apiUrl + '/' + emailAddress, HTTPOptions);

  }

}


