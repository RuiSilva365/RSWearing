import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// Import Firebase and FirebaseUI
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, EmailAuthProvider } from 'firebase/auth';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import * as firebaseui from 'firebaseui';

// Firebase configuration object (replace this with your Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyAk2kxLAofDJ3gyWNfz2_iwIU0PrJCqdYc",
  authDomain: "rswearing-4b75f.firebaseapp.com",
  projectId: "1:287024306857:web:85719ec1c07707648627b8",
  storageBucket: "rswearing-4b75f.appspot.com",
  messagingSenderId: "287024306857",
  appId: "1:287024306857:web:85719ec1c07707648627b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  ui: firebaseui.auth.AuthUI | null = null; // Initialize to null
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
  user: any = {
    name: '',
    email: '',
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // Configuration for FirebaseUI
    const uiConfig = {
      signInSuccessUrl: '/home',  // Redirect after sign-in
      signInOptions: [
        EmailAuthProvider.PROVIDER_ID,
        GoogleAuthProvider.PROVIDER_ID,
        FacebookAuthProvider.PROVIDER_ID,
      ],
      tosUrl: '/terms-of-service',
      privacyPolicyUrl: '/privacy-policy'
    };

    // Initialize FirebaseUI Auth
    if (!this.ui) {
      this.ui = new firebaseui.auth.AuthUI(auth);
    }

    // Start the FirebaseUI auth widget
    this.ui.start('#firebaseui-auth-container', uiConfig);
  }

  ngOnDestroy(): void {
    if (this.ui) {
      this.ui.delete();  // Clean up FirebaseUI when the component is destroyed
    }
  }

  // Show the loader
  showLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    loaderContainer?.classList.remove('hidden');
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

  // Hide the loader
  hideLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    loaderContainer?.classList.add('hidden');
  }

  // Handle Email/Password login using Firebase Authentication
  login() {
    this.showLoader(); // Show loader on login click

    // Perform the login with email and password
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        // Extract the user from the userCredential object
        const user = userCredential.user;

        // Show welcome message
        this.showSuccessMessage();
        this.user.name = user.displayName || user.email || 'User';

        // Set auth persistence and redirect
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            // Simulate a delay before navigating (to show the loader)
            setTimeout(() => {
              this.router.navigate(['/home']);
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

        // Show user-friendly error message
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
      });
  }

  // Google sign-in using Firebase Authentication
  signInWithGoogle(): void {
    const provider = new GoogleAuthProvider();
    this.showLoader(); // Show loader when sign-in starts

    signInWithPopup(auth, provider)
      .then((result) => {
        // Extract the user from the result
        const user = result.user;

        // Show welcome message
        this.showSuccessMessage();
        this.user.name = user.displayName || user.email || 'User';

        // Set auth persistence
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            // Navigate to the home page after setting persistence
            setTimeout(() => {
              this.router.navigate(['/home']);
              this.hideLoader(); // Hide loader after navigation
            }, 2000); // Simulate a delay before navigating
          })
          .catch((error) => {
            console.error("Error setting persistence: ", error);
            this.hideLoader(); // Hide loader in case of error
          });
      })
      .catch((error) => {
        // Handle error and display message
        this.errorMessage = error.message;
        this.hideLoader(); // Hide loader in case of error
      });
  }

  // Facebook sign-in using Firebase Authentication
  signInWithFacebook(): void {
    const provider = new FacebookAuthProvider();
    this.showLoader(); // Show loader when sign-in starts

    signInWithPopup(auth, provider)
      .then((result) => {
        // Extract the user from the result
        const user = result.user;

        // Show welcome message
        this.showSuccessMessage();
        this.user.name = user.displayName || user.email || 'User';

        // Set auth persistence
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            // Navigate to the home page after setting persistence
            setTimeout(() => {
              this.router.navigate(['/home']);
              this.hideLoader(); // Hide loader after navigation
            }, 2000); // Simulate a delay before navigating
          })
          .catch((error) => {
            console.error("Error setting persistence: ", error);
            this.hideLoader(); // Hide loader in case of error
          });
      })
      .catch((error) => {
        // Handle error and display message
        this.errorMessage = error.message;
        this.hideLoader(); // Hide loader in case of error
      });
  }

  continueWithoutLogin() {
    this.showLoader(); // Show loader on continue without login click

    localStorage.setItem('continueWithoutLogin', 'true');
    
    // Simulate a delay before navigating (to show the loader)
    setTimeout(() => {
      this.router.navigate(['/home']);
      this.hideLoader(); // Hide loader after navigation
    }, 2000); // Simulate a 2-second delay
  }

  goToRegister() {
    this.router.navigate(['/register']);
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
    this.router.navigate(['/profile']);  // Use the injected Router
  }

  gotoInstagramPage() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  gotoTwitterPage() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }

  gotoTiktokPage() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }
}
