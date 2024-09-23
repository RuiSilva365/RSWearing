import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PrivacyPolicyComponent } from '../privacy-policy-modal/privacy-policy-modal.component';
import { DatabaseService } from '../../services/database.service';
import { FirebaseService } from '../../services/firebase.service'; // Use Firebase service
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';

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

  constructor(
    private router: Router,
    private modalController: ModalController,
    private databaseService: DatabaseService,
    private firebaseService: FirebaseService // Inject Firebase service
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  // Method to open the Privacy Policy modal
  async openPrivacyPolicy() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyComponent,
    });
    await modal.present();
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
    setTimeout(() => {
      successMessage.remove();
    }, 2000);
  }

  // Handle Email/Password login using Firebase Authentication
  login() {
    this.showLoader(); // Show loader on login click
    const auth = this.firebaseService.auth; // Use initialized auth from FirebaseService

    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.showSuccessMessage();
        this.user.name = user.displayName || user.email || 'User';
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            setTimeout(() => {
              this.navigateTo('/home');
              this.checkPrivacyPolicy(user.uid);
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

  async checkPrivacyPolicy(userId: string) {
    try {
      const userData = await this.databaseService.getUserData(userId);
      //console.log('User data:', userData); // Debugging line

      // Show the privacy policy modal only if it hasn't been accepted
      if (!userData?.privacyAccepted) {
        console.log('Privacy policy not accepted, showing modal.'); // Debugging line
        const modal = await this.modalController.create({
          component: PrivacyPolicyComponent,
          backdropDismiss: false, // Prevent the user from dismissing the modal by clicking outside
          cssClass: 'privacy-policy-modal', // Add CSS class for additional styling if needed
        });

        await modal.present();

        // Wait for the modal to be dismissed and handle the result
        const { data } = await modal.onDidDismiss();
        console.log('Modal dismissed with data:', data); // Debugging line

        if (data?.accepted) {
          // If the user accepted the privacy policy, proceed to the home page
          this.navigateTo('/home');
        } else {
          // Optionally handle if the user rejects the policy
          console.warn('User did not accept the privacy policy.');
        }
      } else {
        // Directly navigate to home if the policy was already accepted
        console.log('Privacy policy already accepted, navigating to home.'); // Debugging line
        this.navigateTo('/home');
      }
    } catch (error) {
      //console.error('Error checking privacy policy:', error);
      // Handle any errors retrieving user data
    }
  }

  // Google sign-in using Firebase Authentication
  signInWithGoogle(): void {
    const provider = new GoogleAuthProvider();
    this.showLoader(); // Show loader when sign-in starts
    const auth = this.firebaseService.auth;

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        // Show welcome message
        this.showSuccessMessage();
        this.user.name = user.displayName || user.email || 'User';
        this.checkPrivacyPolicy(user.uid);

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
    const auth = this.firebaseService.auth;

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        this.checkPrivacyPolicy(user.uid);


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
    this.errorMessage = null; // Reset error message
    this.forgotPasswordMessage = null; // Reset success message
  
    if (!this.email) {
      this.errorMessage = 'Please enter your email address first.';
      return;
    }
  
    const auth = this.firebaseService.auth; // Use Firebase auth
  
    sendPasswordResetEmail(auth, this.email) // Use sendPasswordResetEmail with auth instance
      .then(() => {
        this.forgotPasswordMessage = 'A password reset email has been sent to your email address.';
      })
      .catch((error: any) => { // Explicitly type the error parameter
        switch (error.code) {
          case 'auth/invalid-email':
            this.errorMessage = 'Invalid email address.';
            break;
          case 'auth/user-not-found':
            this.errorMessage = 'No user found with this email address.';
            break;
          default:
            this.errorMessage = 'An error occurred. Please try again.';
        }
      });
  }
  
  toggleHover(section: string, state: boolean) {
    this.isHovering[section] = state;
  }

  showSubMenu(menu: string) {
    this.subMenuVisible = menu; // Set the visible submenu based on the passed menu identifier
  }

  hideSubMenu() {
    this.subMenuVisible = null; // Hide the submenu
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
