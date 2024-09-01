import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { getDatabase } from 'firebase/database';
// Import Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, EmailAuthProvider, setPersistence, browserLocalPersistence, User } from 'firebase/auth';

// Firebase configuration object (replace this with your Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyAk2kxLAofDJ3gyWNfz2_iwIU0PrJCqdYc",
  authDomain: "rswearing-4b75f.firebaseapp.com",
  databaseURL: "https://rswearing-4b75f-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "1:287024306857:web:85719ec1c07707648627b8",
  storageBucket: "rswearing-4b75f.appspot.com",
  messagingSenderId: "287024306857",
  appId: "1:287024306857:web:85719ec1c07707648627b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  email = '';
  password = '';
  errorMessage: string | null = null;
  forgotPasswordMessage: string | null = null;
  sidebarVisible: boolean = false;
  subMenuVisible: string | null = null;
  isHovering: { [key: string]: boolean } = {
    'new-collection': false,
    'trending': false,
    'recommended': false
  };
  user: { name: string; email: string } = { name: '', email: '' };

  constructor(private router: Router) {}

  ngOnInit() {
    // No FirebaseUI initialization needed as we're using custom forms
  }

  ngOnDestroy(): void {
    // No FirebaseUI cleanup needed
  }

  // Show the loader
  showLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    loaderContainer?.classList.remove('hidden');
  }

  // Hide the loader
  hideLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    loaderContainer?.classList.add('hidden');
  }

  // Show success message
  showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.textContent = 'Welcome back!';
    document.body.appendChild(successMessage);

    // Remove the message after 2 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 2000);
  }

  // Handle Email/Password login using Firebase Authentication
  login() {
    this.showLoader(); // Show loader on login click

    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Show welcome message
        this.showSuccessMessage();
        this.user.name = user.displayName || user.email || 'User';

        // Set auth persistence and redirect
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            setTimeout(() => {
              this.navigateTo('/home');
              this.hideLoader(); // Hide loader after navigation
            }, 2000); // Simulate a 2-second delay
          })
          .catch((error) => {
            console.error("Error setting persistence: ", error);
            this.hideLoader(); // Hide the loader in case of persistence error
          });
      })
      .catch((error) => {
        this.hideLoader(); // Hide the loader in case of error
        this.handleError(error);
      });
  }

  // Google sign-in using Firebase Authentication
  signInWithGoogle(): void {
    const provider = new GoogleAuthProvider();
    this.showLoader(); // Show loader when sign-in starts

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        // Show welcome message
        this.showSuccessMessage();
        this.user.name = user.displayName || user.email || 'User';

        // Set auth persistence
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            setTimeout(() => {
              this.navigateTo('/home');
              this.hideLoader(); // Hide loader after navigation
            }, 2000); // Simulate a delay before navigating
          })
          .catch((error) => {
            console.error("Error setting persistence: ", error);
            this.hideLoader(); // Hide loader in case of error
          });
      })
      .catch((error) => {
        this.handleError(error);
        this.hideLoader(); // Hide loader in case of error
      });
  }

  // Facebook sign-in using Firebase Authentication
  signInWithFacebook(): void {
    const provider = new FacebookAuthProvider();
    this.showLoader(); // Show loader when sign-in starts

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        // Show welcome message
        this.showSuccessMessage();
        this.user.name = user.displayName || user.email || 'User';

        // Set auth persistence
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            setTimeout(() => {
              this.navigateTo('/home');
              this.hideLoader(); // Hide loader after navigation
            }, 2000); // Simulate a delay before navigating
          })
          .catch((error) => {
            console.error("Error setting persistence: ", error);
            this.hideLoader(); // Hide loader in case of error
          });
      })
      .catch((error) => {
        this.handleError(error);
        this.hideLoader(); // Hide loader in case of error
      });
  }

  // Continue without login
  continueWithoutLogin() {
    this.showLoader(); // Show loader on continue without login click

    localStorage.setItem('continueWithoutLogin', 'true');
    
    setTimeout(() => {
      this.navigateTo('/home');
      this.hideLoader(); // Hide loader after navigation
    }, 2000); // Simulate a 2-second delay
  }

  // Navigation function to streamline router navigation
  private navigateTo(path: string) {
    this.router.navigate([path]);
  }

  // Handle errors and display user-friendly messages
  private handleError(error: any) {
    switch (error.code) {
      case 'auth/invalid-email':
        this.errorMessage = 'Invalid email address.';
        break;
      case 'auth/user-not-found':
        this.errorMessage = 'User not found.';
        break;
      case 'auth/wrong-password':
        this.errorMessage = 'Invalid credentials.';
        break;
      default:
        this.errorMessage = 'An error occurred. Please try again.';
    }
  }

  goToRegister() {
    this.navigateTo('/register');
  }

  forgotPassword() {
    this.errorMessage = 'Password reset is not implemented yet';
  }

  toggleHover(section: string, state: boolean) {
    this.isHovering[section] = state;
  }

  showSubMenu(menu: string) {
    this.subMenuVisible = menu;  // Set the visible submenu based on the passed menu identifier
  }

  hideSubMenu() {
    this.subMenuVisible = null;  // Hide the submenu
  }

  gotoFacebookPage() {
    this.navigateTo('/profile');
  }

  gotoInstagramPage() {
    this.navigateTo('/profile');
  }

  goToHome() {
    this.navigateTo('/home');
  }

  gotoTwitterPage() {
    this.navigateTo('/profile');
  }

  gotoTiktokPage() {
    this.navigateTo('/profile');
  }
}
