import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms'; // Imported FormsModule for form handling
import { environment } from '../environments/environment'; // Correct path
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy-modal/privacy-policy-modal.component'; // Ensure correct path
import { EditAvatarComponent } from './edit-avatar/edit-avatar.component';
import { AuthService } from '../services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    PrivacyPolicyComponent,
    // Add other components here if needed
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Initialize Firebase
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
     // Import FormsModule for form handling
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allows custom elements
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService, // Provide AuthService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
