import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/authentication/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../model/auth.model';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  authService = inject(AuthService)
  fb = inject(FormBuilder)

  form!: FormGroup
  errUsername!: string | null
  errEmail!: string | null

  ngOnInit(): void {
      this.form = this.createForm();
  }
  
  processSignup(event: Event) {
    event.preventDefault()
    const newUser: User = {
      ...this.form.value
    }
    this.authService.signup(newUser)
      .subscribe({
        next:() => {},
        error: (err) => {
          if (err.username) {
            this.errUsername = err.username;
          }

          if (err.email) {
            this.errEmail = err.email;
          }
        }
      })
  }

  protected resetFieldDbErrorMessage(field: string) {
    if (field === 'username') {
      this.errUsername = null;
    }

    if (field === 'email') {
      this.errEmail = null;
    }
  }

  protected isFieldValid(field: string): boolean {
    return !!this.form.get(field)?.valid || !!this.form.get(field)?.pristine
  }

  private createForm(): FormGroup {
    return this.fb.group({
      username: this.fb.control<string>('', [Validators.required, Validators.minLength(4)]),
      email: this.fb.control<string>('', [Validators.email, Validators.required]),
      password: this.fb.control<string>('', [Validators.minLength(6), Validators.required])
    })
  }
}
