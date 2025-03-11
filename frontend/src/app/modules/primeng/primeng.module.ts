import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';

const MODULES = [
  CommonModule, 
  ButtonModule,
  InputTextModule,
  FloatLabelModule,
  PasswordModule,
]

@NgModule({
  declarations: [],
  imports: [MODULES],
  exports: [MODULES]
})
export class PrimengModule { }
