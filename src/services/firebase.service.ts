// src/services/firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { environment } from '../environments/environment'; // Correct path
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAnalytics } from 'firebase/analytics';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
      // Initialize App Check with reCAPTCHA

  private app = !getApps().length ? initializeApp(environment.firebaseConfig) : getApp();
  auth = getAuth(this.app);
  db = getDatabase(this.app);
  analytics = getAnalytics(this.app); 

  constructor() {
    console.log('Firebase initialized:', this.app.name);

    initializeAppCheck(this.app, {
      provider: new ReCaptchaV3Provider(environment.recaptchaSiteKey), // Replace with your site key
      isTokenAutoRefreshEnabled: true, // Optional, enable token auto-refresh
    });
  }
}

export default FirebaseService; // Ensure it is exported
