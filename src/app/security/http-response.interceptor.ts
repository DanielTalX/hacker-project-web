import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
    static NONE: string = "NONE";

    static csrf: string = HttpResponseInterceptor.NONE;
    static xsrf: string = HttpResponseInterceptor.NONE;
    static default: string = HttpResponseInterceptor.NONE;
    static ttd: string = HttpResponseInterceptor.NONE;
    static tag: string = HttpResponseInterceptor.NONE;

    constructor() { }
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        if (req.url.indexOf('/api/cs/')>-1) {
            return next.handle(req).pipe(
                tap(evt => {
                    if (evt instanceof HttpResponse) {
                        // console.log("HttpResponseInterceptor: evt.url = ", evt.url);
                        // console.log("HttpResponseInterceptor: evt.headers = ", evt.headers);
                        const xsrf = evt.headers.get('XSRF-TOKEN');
                        const csrf = evt.headers.get('csrf');
                        if(xsrf) HttpResponseInterceptor.xsrf = xsrf;
                        if(csrf) HttpResponseInterceptor.csrf = csrf;
                        //HttpResponseInterceptor.default = evt.headers.has('default')?(evt.headers.get('default')):(HttpResponseInterceptor.default);
                        //HttpResponseInterceptor.ttd = evt.headers.has('ttd')?(evt.headers.get('ttd')):(HttpResponseInterceptor.ttd);
                        //HttpResponseInterceptor.tag = evt.headers.has('tag')?(evt.headers.get('tag')):(HttpResponseInterceptor.tag);
                    }
                }),
                // catchError((err: any) => {
                //     if (err instanceof HttpErrorResponse) {
                //         console.log("HttpResponseInterceptor: err = ", err);
                //     }
                //     return of(err);
                //     //return next.handle(req); 
                // })
                );
        }else{
            return next.handle(req); 
        }
    }

}