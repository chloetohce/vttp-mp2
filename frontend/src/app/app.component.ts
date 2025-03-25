import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTokens } from './store/authentication/auth.actions';
import { AuthService } from './services/authentication/auth.service';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  authStore = inject(Store)
  authSvc = inject(AuthService)
  router = inject(Router)

  isHome? = true;

  constructor() {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe(e =>{
        if (e.urlAfterRedirects == '/') {
          this.isHome = true;
        } else {
          this.isHome = false
        }
  })
  }

  ngOnInit(): void {
      // this.authStore.dispatch(loadTokens())
      this.authSvc.isAuthenticated()
  }
}
