import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../model/auth.model';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService)

  form!: FormGroup

  errorMsg$!: Observable<string | null>

  ngOnInit(): void {
      this.form = this.fb.group({
        username: this.fb.control<string>(''),
        password: this.fb.control<string>('')
      });

      this.errorMsg$ = this.authService.authErrorMsg$
  }

  protected processLogin(event: Event) {
    event.preventDefault()
    const loginInfo: User = this.form.value;
    this.authService.login(loginInfo)
  }

}
