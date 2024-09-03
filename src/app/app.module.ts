// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment'; // Correct path
import { AuthService } from '../services/auth.service';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy-modal/privacy-policy-modal.component'; // Ensure correct path



@NgModule({
  declarations: [
    AppComponent,
    PrivacyPolicyComponent,

    // other components
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireDatabaseModule, 
    AngularFireAuthModule // Import the Auth module here
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
