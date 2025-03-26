import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, first, firstValueFrom, last, lastValueFrom, map, Observable, of, Subject, switchMap, take, throwError } from 'rxjs';
import { AuthResponse, User } from '../../model/auth.model';
import { jwtDecode } from 'jwt-decode';
import { Store } from '@ngrx/store';
import { selectRefreshToken, selectToken } from '../../store/authentication/auth.store';
import {
  clearTokens,
  loadTokens,
  refreshToken,
  setLoggedIn,
  setRefreshToken,
  setToken,
} from '../../store/authentication/auth.actions';
import { AppState } from '../../store/app.store';
import { getPlayerData } from '../../store/player/player.action';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);
  private store: Store<AppState> = inject(Store);

  // Change to store in component state
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private loggedInUserSubject: Subject<string> = new Subject<string>();
  loggedInUsername$ = this.loggedInUserSubject.asObservable();

  private authErrorMsg = new Subject<string | null>();
  authErrorMsg$ = this.authErrorMsg.asObservable();

  constructor() {}

  signup(newUser: User): Observable<string> {
    return this.http.post('/auth/signup', newUser)
      .pipe(
        map(() => {
          this.router.navigate(['/login'])
          return 'success'
        }),
        catchError((err) => {
          return throwError(() => err.error)
        })
      )
  }

  login(login: User) {
    return this.http
      .post<AuthResponse>('/auth/login', login)
      .subscribe({
        next: (response) => {
          const token = response.token;
          const refreshToken = response.refreshToken;
          this.store.dispatch(setToken({ token: token }));
          this.store.dispatch(
            setRefreshToken({ refreshToken: refreshToken })
          );
          this.store.dispatch(setLoggedIn({ isLoggedIn: true }));
          this.store.dispatch(getPlayerData({username: login.username}));

          this.authErrorMsg.next(null)
          this.router.navigate(['/game']);
        },
        error: (err) => {
          this.store.dispatch(setLoggedIn({ isLoggedIn: false }));
          this.store.dispatch(clearTokens());
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
    console.log("logging out")
    this.store.dispatch(clearTokens())
  }

  /**
   * Refreshes authentication tokens as needed. Reroutes user if refresh
   * token is invalid
   */
  async isAuthenticated(): Promise<boolean> {
    this.store.dispatch(loadTokens());
    if (!await this.isTokenValid("refreshToken")) {
      this.store.dispatch(setLoggedIn({isLoggedIn: false}))
      return false
    }

    if (!await this.isTokenValid("token")) {
      this.store.dispatch(refreshToken())
    }
    this.store.dispatch(setLoggedIn({isLoggedIn: true}))
    return true;
  }

  private async isTokenValid(type: string): Promise<boolean> {
    let tempToken: string | null = null;
    if (type == "token") {
      tempToken = await firstValueFrom(
        this.store.select(selectToken).pipe(take(1)))

    } else {
      tempToken = await firstValueFrom(
        this.store.select(selectRefreshToken).pipe(take(1)))
    }

    if (!tempToken) return false;

    return (jwtDecode(tempToken).exp ?? 0) * 1000 > Date.now()
  }

  refreshToken(): Observable<{token: string}> {
    return this.store.select(selectRefreshToken)
      .pipe(
        first(),
        switchMap((refreshToken) => {
          return this.http.post<{token:string}>('/auth/refresh', {refreshToken: refreshToken})
        })
      )
  }

  
}
