import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  step = 1;
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.hideLoader();
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

  checkEmail() {
    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // If email is valid, move to the next step
    this.errorMessage = ''; // Clear any previous error message
    this.step = 2;
  }

  register() {
    // Validate passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Validate password strength
    if (this.password.length < 6) {
      this.errorMessage = 'Password should be at least 6 characters long.';
      return;
    }

    this.showLoader(); // Show loader on sign-up click

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Set the display name
        return updateProfile(user, {
          displayName: this.username,
        });
      })
      .then(() => {
        // Clear any previous error message
        this.errorMessage = '';
        
        // Show success message
        this.successMessage = 'Registration successful! Welcome!';

        // Hide loader after success
        this.hideLoader();

        // Redirect to home page after a short delay
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      })
      .catch((error) => {
        this.hideLoader(); // Hide loader if there's an error
        console.error('Registration error:', error);

        // Clear success message on error
        this.successMessage = '';

        // Set appropriate error messages based on error codes
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.errorMessage = 'The email is already in use by another account.';
            break;
          case 'auth/invalid-email':
            this.errorMessage = 'Invalid email address.';
            break;
          case 'auth/weak-password':
            this.errorMessage = 'The password is too weak.';
            break;
          default:
            this.errorMessage = 'An error occurred during registration. Please try again.';
        }
      });
  }

  gotoFacebookPage() {
    this.router.navigate(['/profile']); // Use the injected Router
  }

  gotoInstagramPage() {
    this.router.navigate(['/profile']); // Use the injected Router
  }

  gotoTwitterPage() {
    this.router.navigate(['/profile']); // Use the injected Router
  }

  gotoTiktokPage() {
    this.router.navigate(['/profile']); // Use the injected Router
  }
}
