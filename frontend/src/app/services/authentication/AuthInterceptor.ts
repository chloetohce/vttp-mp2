import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(req);

    const token = localStorage.getItem('token');

    if (!req.url.includes("/auth/")) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(authReq);
    } else {
        const authReq = req.clone({
            setHeaders: {'Content-Type': 'application/json'}
        })
        
      return next.handle(authReq)
    }
  }
}
