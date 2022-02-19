import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { SecurityService } from './security.service';
import { HttpResponseInterceptor } from './http-response.interceptor';
// import { UtilService } from '../../shared/services/util.service';
// import { HttpResponseInterceptor } from '../http-interceptors/http-response.interceptor';

@Injectable()
export class SecurityInterceptorService implements HttpInterceptor {

    constructor(private _securityService: SecurityService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.url.indexOf('/api/cs/') > -1) {

            // Clone the request and replace the original headers with
            // cloned headers, updated with the authorization.
            //let x = document.cookie.replace("XSRF-TOKEN=", "@");
            //let y = x?x.substring(x.indexOf("@")+1):"none";

            const authReq = req.clone({
                headers: req.headers
                    .set('Authorization', `Bearer ${this._securityService.securityObject.bearerToken}`)
                    .set('accessToken', this._securityService.securityObject.accessToken)
                    .set('Content-Type', 'application/json')
                    .set('app', 'web')
                    .set('platform', 'angular')
                    .set('device', navigator.appCodeName + '_' + navigator.appName + '_' + navigator.platform + '_' + navigator.product + '_' + navigator.productSub + '_' + navigator.vendor)
                    // .set('location', UtilService.location)

                    .set('csrf-token', HttpResponseInterceptor.xsrf)
                    .set('_csrf', HttpResponseInterceptor!.csrf)
                //.set('default', HttpResponseInterceptor.default)
                //.set('ttd', HttpResponseInterceptor.ttd)
                //.set('tag', HttpResponseInterceptor.tag)

                //.set('Cookie', "_csrf=" + HttpResponseInterceptor.csrf)

                //.set('Access-Control-Allow-Origin', '*')
                //.set('csrf-token',  y)
                //csrf-token
                //.append("InlineBusinessId", "businessDataId")
                
            });

            // send cloned request with header to the next handler.
            return next.handle(authReq);
        } else {
            //console.log('AuthInterceptorService - out - authService req.url = ', req.url);
            return next.handle(req);
        }
    }
}