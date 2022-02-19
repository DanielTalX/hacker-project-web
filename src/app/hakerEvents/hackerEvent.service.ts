import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HackerEvent } from './hackerEvent';
import { environment } from 'src/environments/environment';

const API_URL = environment.BASE_URL + "hackerEvents/";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class HackerEventService {

  constructor(private http: HttpClient) { }

  getHackerEvents(rangeDate: {start: Date, end: Date}): Observable<HackerEvent[]> {
    const query = `?start=${rangeDate.start.toUTCString()}&end=${rangeDate.end.toUTCString()}`;
    // console.log("getHackerEvents - query = ", query);
    return this.http.get<HackerEvent[]>(API_URL+ 'range/' + query);
  }

  getHackerEvent(id: string): Observable<HackerEvent> {
    return this.http.get<HackerEvent>(API_URL + id);
  }

  addHackerEvent(entity: HackerEvent): Observable<HackerEvent> {
    return this.http.post<HackerEvent>(API_URL, entity, httpOptions);
  }

  updateHackerEvent(entity: HackerEvent): Observable<any> {
    return this.http.patch(API_URL + entity.id, entity, httpOptions);
  }

  deleteHackerEvent(id: string): Observable<HackerEvent> {
    return this.http.delete<HackerEvent>(API_URL + id, httpOptions);
  }
}
