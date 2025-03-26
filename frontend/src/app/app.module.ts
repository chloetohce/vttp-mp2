import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { PrimeNGPreset } from './modules/primeng/preset';
import { PrimengModule } from './modules/primeng/primeng.module';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GameComponent } from './components/game/game.component';
import { AuthInterceptor } from './services/authentication/AuthInterceptor';
import { HomeComponent } from './components/home/home.component';
import { provideStore, StoreModule } from '@ngrx/store';
import { authReducer } from './store/authentication/auth.store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/authentication/auth.effects';
import { provideStoreDevtools, StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SignupComponent } from './components/signup/signup.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AppState } from './store/app.store';
import { playerReducer } from './store/player/player.store';
import { PlayerEffects } from './store/player/player.effects';
import { EditorComponent } from './components/game/editor/editor.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameComponent,
    HomeComponent,
    SignupComponent,
    LogoutComponent,
    EditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot<AppState>({auth: authReducer, player: playerReducer}),
    EffectsModule.forRoot([AuthEffects, PlayerEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    MonacoEditorModule.forRoot({
      defaultOptions: {scrollBeyondLastLine: false}
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideStoreDevtools({
      logOnly: !isDevMode(),
      trace: true,
      traceLimit: 50,
      autoPause: true
    }),
    providePrimeNG({
      theme: {
        preset: PrimeNGPreset,
    }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
