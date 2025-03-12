import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  authService = inject(AuthService)

  processSignup(event: Event) {
    event.preventDefault()
    this.authService.signup({username: 'test', email: 'test', password:''})
  }
}
