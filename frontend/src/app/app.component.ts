import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTokens } from './store/authentication/auth.actions';
import { AuthService } from './services/authentication/auth.service';

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

  ngOnInit(): void {
      // this.authStore.dispatch(loadTokens())
      this.authSvc.isAuthenticated()
  }
}
