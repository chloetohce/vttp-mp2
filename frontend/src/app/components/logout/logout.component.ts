import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: false,
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)

  @Input()
  type!: string;

  ngOnInit(): void {
  }

  protected logout() {
    this.authService.logout()
    this.router.navigate(['/'])
  }
}
