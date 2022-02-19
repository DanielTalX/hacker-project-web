import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';//'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Category } from './category';
import { environment } from 'src/environments/environment';

const API_URL = environment.BASE_URL + "category/";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(API_URL);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(API_URL + id.toString());
  }

  addCategory(entity: Category): Observable<Category> {
    return this.http.post<Category>(API_URL, entity, httpOptions);
  }

  updateCategory(entity: Category): Observable<any> {
    return this.http.put(API_URL, entity, httpOptions);
  }
}
