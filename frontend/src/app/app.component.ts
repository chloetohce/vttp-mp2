import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTokens } from './store/authentication/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  authStore = inject(Store)
  

  ngOnInit(): void {
      this.authStore.dispatch(loadTokens())
  }
}
