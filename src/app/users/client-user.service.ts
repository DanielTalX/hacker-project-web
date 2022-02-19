import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SecurityService } from '../security/security.service';
import { AppUserClaim } from '../security/app-user-claim';
import { ClientUser } from './client-user';
import { AppUserAuth } from '../security/app-user-auth';

const API_URL = environment.BASE_URL + "user/";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class ClientUserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<ClientUser[]> {
    return this.http.post<ClientUser[]>(API_URL+"GetAllClientUsers/", {}, httpOptions);
  }

  getUser(userId: string): Observable<ClientUser> {
    return this.http.post<ClientUser>(API_URL+"GetClientUserById/", {userId}, httpOptions);
  }

  updateUserRole(entity: ClientUser): Observable<ClientUser> {
    return this.http.post<ClientUser>(API_URL+"UpdateUserRole/", entity, httpOptions);
  }

  updateUserProfile(entity: AppUserAuth): Observable<ClientUser> {
    return this.http.post<ClientUser>(API_URL+"UpdateUserProfile/", entity, httpOptions);
  }

  addAppUserCliam(entity: AppUserClaim): Observable<AppUserClaim> {
    return this.http.post<AppUserClaim>(API_URL+"PostUserClaim/", entity, httpOptions);
  }

  deleteAppUserCliam(entity: AppUserClaim): Observable<AppUserClaim> {
    return this.http.post<AppUserClaim>(API_URL+"DeleteUserClaim/", entity, httpOptions);
  }

  deleteUser(userId: string): Observable<AppUserClaim> {
    return this.http.post<AppUserClaim>(API_URL+"DeleteUser/", {userId}, httpOptions);
  }
}
