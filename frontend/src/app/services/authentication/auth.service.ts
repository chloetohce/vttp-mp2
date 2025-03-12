import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, first, firstValueFrom, last, lastValueFrom, Observable, Subject, switchMap, take } from 'rxjs';
import { AuthResponse, User } from '../../model/auth.model';
import { jwtDecode } from 'jwt-decode';
import { select, Store } from '@ngrx/store';
import { AUTH_URL } from '../../constants/url';
import { AuthState, selectRefreshToken, selectToken } from '../../store/authentication/auth.store';
import {
  clearTokens,
  loadTokens,
  refreshToken,
  setLoggedIn,
  setRefreshToken,
  setToken,
} from '../../store/authentication/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);
  private authStore: Store<{auth: AuthState}> = inject(Store);

  // Change to store in component state
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private loggedInUserSubject: Subject<string> = new Subject<string>();
  loggedInUsername$ = this.loggedInUserSubject.asObservable();

  private authErrorMsg = new Subject<string | null>();
  authErrorMsg$ = this.authErrorMsg.asObservable();

  constructor() {}

  signup(newUser: User) {
    this.http.post(`${AUTH_URL}sigwnup`, newUser)
      .subscribe({
        next: (response) => {this.router.navigate(['/login'])},
        error: (err) => {alert("Something went wrong. Please try again.")}
      })
  }

  login(login: User) {
    this.http
      .post<AuthResponse>(`${AUTH_URL}login`, login)
      .subscribe({
        next: (response) => {
          console.log('Login response:', response);
          const token = response.token;
          const refreshToken = response.refreshToken;
          this.authStore.dispatch(setToken({ token: token }));
          this.authStore.dispatch(
            setRefreshToken({ refreshToken: refreshToken })
          );
          this.authStore.dispatch(setLoggedIn({ isLoggedIn: true }));

          this.authErrorMsg.next(null)
          this.router.navigate(['/game']);
        },
        error: (err) => {
          this.authStore.dispatch(setLoggedIn({ isLoggedIn: false }));
          this.authStore.dispatch(clearTokens());
          console.log(err)

          // Different error messages returned based on status code
          let msg: string;
          if (err.status == 401) {
            msg = "Your username and/or password is incorrect."
          } else {
            msg = "Something went wrong. Please try again. "
          }

          this.authErrorMsg.next(msg);
          
          this.router.navigate(['/login']);
        },
        complete: () => {},
      });
  }

  logout() {
    this.authStore.dispatch(clearTokens())
    this.router.navigate(['/']);
  }

  /**
   * Refreshes authentication tokens as needed. Reroutes user if refresh
   * token is invalid
   */
  async isAuthenticated(): Promise<boolean> {
    this.authStore.dispatch(loadTokens());
    if (!await this.isTokenValid("refreshToken")) {
      this.authStore.dispatch(setLoggedIn({isLoggedIn: false}))
      return false
    }

    if (!await this.isTokenValid("token")) {
      this.authStore.dispatch(refreshToken())
    }
    return true;
  }

  private async isTokenValid(type: string): Promise<boolean> {
    let tempToken: string | null = null;
    if (type == "token") {
      tempToken = await firstValueFrom(
        this.authStore.select(selectToken).pipe(take(1)))

    } else {
      tempToken = await firstValueFrom(
        this.authStore.select(selectRefreshToken).pipe(take(1)))
    }

    if (!tempToken) return false;

    return (jwtDecode(tempToken).exp ?? 0) * 1000 > Date.now()
  }

  refreshToken(): Observable<{token: string}> {
    return this.authStore.select(selectRefreshToken)
      .pipe(
        first(),
        switchMap((refreshToken) => {
          return this.http.post<{token:string}>(`${AUTH_URL}refresh`, {refreshToken: refreshToken})
        })
      )
  }

}
