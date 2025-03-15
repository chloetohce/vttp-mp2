import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { LogoutComponent } from '../logout/logout.component';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild('logoutIcon') logoutButton!: LogoutComponent
}
