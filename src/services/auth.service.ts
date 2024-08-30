import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null); // Store the user as an observable

  constructor() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userSubject.next(user); // Set the user in the observable when authenticated
      } else {
        this.userSubject.next(null); // Clear the user when not authenticated
      }
    });
  }

  // Get the current user as an observable
  getUser() {
    return this.userSubject.asObservable();
  }

  // Optionally, get the current user directly
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }
}
