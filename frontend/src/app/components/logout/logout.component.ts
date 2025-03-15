import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'app-logout',
  standalone: false,
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  authService = inject(AuthService)

  @Input()
  type!: string;

  protected logout() {
    this.authService.logout()
  }
}
