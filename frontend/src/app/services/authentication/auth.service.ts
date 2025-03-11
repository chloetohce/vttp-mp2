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

  constructor() {}

  get isLoggedIn() {
    return this.loggedIn.value;
  }

  login(login: User) {
    this.http
      .post<AuthResponse>('http://localhost:8080/auth/login', login)
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
          this.router.navigate(['/game']);
        },
        error: (err) => {
          console.log(err)
          this.authStore.dispatch(setLoggedIn({ isLoggedIn: false }));
          this.authStore.dispatch(clearTokens());
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
    console.info("Authenticating user.")
    this.authStore.dispatch(loadTokens());
    if (!await this.isTokenValid("refreshToken")) {
      console.log(await this.isTokenValid("refreshToken"))
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
    console.log(tempToken)
    console.log((jwtDecode(tempToken).exp ?? 0) * 1000)

    return (jwtDecode(tempToken).exp ?? 0) * 1000 > Date.now()
  }

  refreshToken(): Observable<{token: string}> {
    return this.authStore.select(selectRefreshToken)
      .pipe(
        first(),
        switchMap((refreshToken) => {
          return this.http.post<{token:string}>(`${AUTH_URL}/refresh`, {refreshToken: refreshToken})
        })
      )
  }

}
