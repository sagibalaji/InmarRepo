import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BasinArea } from '../models/basin-area.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AreaRouteService {

  constructor(private http: HttpClient) { }

  apiUrl: string = "https://127.0.0.1:44340/api";

  // Get a list of all basins and areas to select from.
  public getBasinAreas(): Observable<BasinArea[]> {
    let headers = new HttpHeaders({"Content-Type": "application/json"});
    let observable = this.http.get<any[]>(this.apiUrl + '/AreaRoute/BasinAreas', {headers: headers})
      .pipe(
        map((data: any[]) => {
          let results: BasinArea[] = []
          if (data && data.length > 0) {
            data.forEach(item => {
              let basinArea = BasinArea.jsonToBasinArea(item)
              if (basinArea) { 
                results.push(basinArea)
              }
            })
          }
          return results
        })
      )

    return observable
  }

  public getRoutesForBasinArea(basinArea: BasinArea): Observable<string[]> {
    let params = new HttpParams()
      .set('basin', basinArea.basin)
      .set('area', basinArea.area)
    return this.http.get<string[]>(this.apiUrl + '/AreaRoute/RoutesForBasinArea', { params })
  }
}
