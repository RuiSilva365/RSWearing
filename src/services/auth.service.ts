import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null); // Store the user as an observable
  private _logoutFlag = false; // Private flag to manage logout state
  private authSubscription: Subscription; // To manage subscription cleanup
  private showConsentFlag = false;

  constructor() {
    const auth = getAuth();
    this.authSubscription = new Subscription();

    this.authSubscription.add(
      onAuthStateChanged(auth, (user) => {
        if (this._logoutFlag) {
          this._logoutFlag = false; // Reset the flag after logout
          return; // Skip further execution
        }

        if (user) {
          this.userSubject.next(user); // Set the user in the observable when authenticated
        } else {
          this.userSubject.next(null); // Clear the user when not authenticated
        }
      })
    );
  }
  setShowConsentFlag(value: boolean) {
    this.showConsentFlag = value;
  }

  // Method to get the cookie consent flag
  getShowConsentFlag(): boolean {
    return this.showConsentFlag;
  }
  // Get the current user as an observable
  getUser() {
    return this.userSubject.asObservable();
  }

  // Optionally, get the current user directly
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  // Getter for logout flag
  get logoutFlag(): boolean {
    return this._logoutFlag;
  }

  // Setter for logout flag
  set logoutFlag(value: boolean) {
    this._logoutFlag = value;
  }

  // Clean up subscription when no longer needed
  cleanup() {
    this.authSubscription.unsubscribe();
  }
}
