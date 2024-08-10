import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';
  errorMessage: string | null = null;
  forgotPasswordMessage: string | null = null;
  sidebarVisible: boolean = false;
  subMenuVisible: string | null = null;  // Add this line to define the property

  isHovering: { [key: string]: boolean } = {
    'new-collection': false,
    'trending': false,
    'recommended': false
  };

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    // Implement the login functionality here
  }

  signInWithGoogle(): void {
    // Implement Google sign-in logic here
  }

  signInWithFacebook(): void {
    // Implement Facebook sign-in logic here
  }

  continueWithoutLogin() {
    localStorage.setItem('continueWithoutLogin', 'true');
    this.router.navigate(['/home']);
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
}
