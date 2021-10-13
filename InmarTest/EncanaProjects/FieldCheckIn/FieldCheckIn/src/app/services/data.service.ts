import { HttpClient, HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'


// Base class to make rest API calls.
export class DataService<T> {
  // Base URL for all the requests.
  protected apiUrl: string

  constructor(
    protected baseUrl: string,
    protected http: HttpClient,
    endpoint: string)
  {
    //this.apiUrl = this.baseUrl + 'api/' + endpoint
    this.apiUrl = "http://localhost:44345/" + 'api/' + endpoint
    console.log('api URL: ', this.apiUrl)
  }

  // Get all items from the endpoint.
  public getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl)
  }

  // Get multiple items from the endpoint matching the id.
  public getMultiple(id: number): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl + '/' + id)
  }

  // Get a single item with the given database id.
  public getSingle(id: any): Observable<T> {
    return this.http.get<T>(this.apiUrl + '/' + id)
  }

  // Add a new item to the database.
  public add(item: T): Observable<T> {
    console.log("FieldStatus Data:" + item)
    return this.http.post<T>(this.apiUrl, item)
  }

  // Update the item with the given database id using the provided data.
  public update(id: number, itemToUpdate: any): Observable<T> {
    return this.http.put<T>(this.apiUrl + '/' + id, itemToUpdate)
  }

  // Delete the item with the given database id.
  public delete(id: number): Observable<T> {
    return this.http.delete<T>(this.apiUrl + '/' + id)
  }
}

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    }

    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
    return next.handle(req);
  }

}

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {
  // Global access token to send with http requests
  private static bearer: string = null

  constructor() {

  }

  // Set the access token.
  static setAccessToken(token: string) {
    if (token === undefined || token == null || token.length == 0) {
      AccessTokenInterceptor.bearer = null
    } else {
      AccessTokenInterceptor.bearer = token
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (AccessTokenInterceptor.bearer != null && !request.headers.has('Authorization')) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + AccessTokenInterceptor.bearer) })
    }

    return next.handle(request)
  }

}

