import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { CarouselModule } from 'primeng/carousel';
import { RatingModule } from 'primeng/rating';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';


const MODULES = [
  CommonModule, 
  ButtonModule,
  InputTextModule,
  FloatLabelModule,
  PasswordModule,
  MessageModule,
  MenubarModule,
  RippleModule,
  CarouselModule,
  RatingModule,
  CardModule,
  DividerModule,
  IconFieldModule,
  InputIconModule,
  TooltipModule
]

@NgModule({
  declarations: [],
  imports: [MODULES],
  exports: [MODULES],
  providers: [
    MessageService
  ]
})
export class PrimengModule { }
