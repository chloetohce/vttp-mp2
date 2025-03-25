import { Component, ElementRef, inject, TemplateRef, ViewChild } from '@angular/core';
import { LogoutComponent } from '../logout/logout.component';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../../store/authentication/auth.store';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  store = inject(Store)

  @ViewChild('logoutIcon') logoutButton!: LogoutComponent

  isLoggedIn$ = this.store.select(selectIsLoggedIn)

  items = [
    {
      label: 'Home',
      routerLink: ['/'],
    },
    {
      label: 'Play',
      routerLink: ['/game'],
    }
  ]

  reviews = [
    {
      name: 'John Doe',
      title: 'definitely a real person',
      content: 'I tried countless tutorials before, but BitRunner made learning actually fun! The game-based approach kept me engaged and I learned more in 3 weeks than in 3 months of traditional courses.',
      rating: 5,
    },
    {
      name: 'Tan Jun Jie',
      title: 'CS Student',
      content: 'The way concepts are introduced through gameplay is brilliant. I went from struggling with algorithms to implementing them naturally as I progressed through levels. The visualization really helps solidify concepts.',
      rating: 5,
    },
    {
      name: 'Aloysius Lim',
      title: 'Career Switcher',
      content: 'As someone transitioning from marketing to development, BitRunner made learning to code approachable and less intimidating. The game format turned what could be frustrating debugging sessions into fun puzzles.',
      rating: 4,
    },
  ]
}
