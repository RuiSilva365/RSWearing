// src/services/firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { environment } from '../environments/environment'; // Correct path

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app = !getApps().length ? initializeApp(environment.firebaseConfig) : getApp();
  auth = getAuth(this.app);
  db = getDatabase(this.app);

  constructor() {
    console.log('Firebase initialized:', this.app.name);
  }
}

export default FirebaseService; // Ensure it is exported
