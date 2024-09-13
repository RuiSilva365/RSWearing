// src/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseService } from './firebase.service'; // Import the Firebase service

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private _logoutFlag = false;
  private authSubscription: Subscription;
  private showConsentFlag = false;
  constructor(private firebaseService: FirebaseService) { // Injecting FirebaseService correctly
    const auth = this.firebaseService.auth; // Use the initialized auth instance
    this.authSubscription = new Subscription();

    this.authSubscription.add(
      onAuthStateChanged(auth, (user) => {
        if (this._logoutFlag) {
          this._logoutFlag = false;
          return;
        }

        if (user) {
          this.userSubject.next(user);
        } else {
          this.userSubject.next(null);
        }
      })
    );
  }

  setShowConsentFlag(value: boolean) {
    this.showConsentFlag = value;
  }

  getShowConsentFlag(): boolean {
    return this.showConsentFlag;
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  getCurrentUserId(): string | null {
    const auth = this.firebaseService.auth; // Use initialized auth
    return auth.currentUser ? auth.currentUser.uid : null;
  }

  get logoutFlag(): boolean {
    return this._logoutFlag;
  }

  set logoutFlag(value: boolean) {
    this._logoutFlag = value;
  }

  cleanup() {
    this.authSubscription.unsubscribe();
  }
}
