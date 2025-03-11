import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthResponse, User } from '../../model/AuthModels';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  // Change to store in component state
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loggedInUserSubject: Subject<string> = new Subject<string>()
  loggedInUsername$ = this.loggedInUserSubject.asObservable();

  constructor() { }

  get isLoggedIn() {return this.loggedIn.value}

  login(login: User) {
    this.http.post<AuthResponse>('http://localhost:8080/auth/login', login)
      .subscribe({
        next: (response) => {
          console.log("Login response:", response)
          const token = response.token;
          this.loggedIn.next(true);
          this.loggedInUserSubject.next(login.username);
          localStorage.setItem('token', token); 
          this.router.navigate(["/game"])
        },
        error: (err) => {
          console.log(err)
          this.loggedIn.next(false);
          localStorage.removeItem('token');
          this.router.navigate(['/login'])
        } 
    })
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('token');
    this.router.navigate(['/'])
  }

  isTokenExpired(): boolean {
    const expiry: number = this.expiry
    return expiry > Date.now();
  }

  private get jwtToken() : string | null {
    return localStorage.getItem("token")
  }

  get username(): string {
    let token: string = this.jwtToken || ""
    return jwtDecode(token).sub || ""
  }
  
  get expiry(): number {
    let token: string = this.jwtToken || ""
    return jwtDecode(token).exp || 0
  }
}
