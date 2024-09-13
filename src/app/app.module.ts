import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms'; // For handling forms
import { environment } from '../environments/environment'; // Ensure path correctness
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy-modal/privacy-policy-modal.component'; // Ensure correct path
import { AuthService } from '../services/auth.service'; // Ensure correct path to service
// Import FirebaseService if needed, especially if it's handling initialization

@NgModule({
  declarations: [
    AppComponent,
    PrivacyPolicyComponent,
    // Include other components if needed
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Initialize Firebase
    AngularFireDatabaseModule, // Firebase Database
    AngularFireAuthModule, // Firebase Auth
    FormsModule, // Import FormsModule for form handling
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allows use of custom elements
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService, // Providing AuthService
    // If using FirebaseService, ensure it's also provided here
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
