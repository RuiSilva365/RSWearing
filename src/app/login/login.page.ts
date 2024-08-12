import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
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

  constructor(private router: Router) {}

  // Hide the loader when the component initializes
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

  login() {
    this.showLoader(); // Show loader on login click

    // Simulate a delay before navigating (to show the loader)
    setTimeout(() => {
      this.router.navigate(['/home']);
      this.hideLoader(); // Hide loader after navigation
    }, 2000); // Simulate a 2-second delay
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

  signInWithGoogle(): void {
    // Implement Google sign-in logic here
  }

  signInWithFacebook(): void {
    // Implement Facebook sign-in logic here
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

  gotoTwitterPage() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }
}
