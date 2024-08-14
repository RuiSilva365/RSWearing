import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    // Here you would typically check the email against the database
    // For now, let's assume the email is valid and doesn't exist in the DB
    this.step = 2;
  }

  register() {
    // Registration logic goes here
    // For now, let's just log the data and navigate to the home page
    console.log({
      email: this.email,
      username: this.username,
      password: this.password,
      confirmPassword: this.confirmPassword
    });
    this.showLoader(); // Show loader on login click

    // Simulate a delay before navigating (to show the loader)
    setTimeout(() => {
      this.router.navigate(['/home']);
      this.hideLoader(); // Hide loader after navigation
    }, 2000); // Simulate a 2-second delay
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

  gotoTiktokPage() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }

}
