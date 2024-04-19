import {catchError, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Router} from "@angular/router";

/**
 * Class which checks the ongoing HTTP requests when they are triggered, and looks for Unauthorized responses to send the user back to the login screen, while also deleting the access token.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  /**
   * Intercept method which overwrites the Http Interceptor interface's methods. Handles the job of this class alone.
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error.status === 401) {

          sessionStorage.removeItem('token');
          this.router.navigate(['/login'])
        }
        throw error;
      })
    );
  }
}
