import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  sidebarVisible: boolean = false;
  user: any = {
    name: '',
    email: '',
  };

  constructor(private authService: AuthService, private router: Router, private alertController: AlertController ) {}

  ngOnInit() {
    // Subscribe to the user's data from AuthService
    this.authService.getUser().subscribe((user) => {
      if (user) {
        // Set user data when user is logged in
        this.user.name = user.displayName || 'User';
        this.user.email = user.email || '';
      } else {
        // Show a popup asking the user to sign in or sign up
        this.presentLoginSignupAlert();
      }
    });
  }
  async presentLoginSignupAlert() {
    const alert = await this.alertController.create({
      header: 'Not Logged In',
      message: 'Would you like to log in or sign up?',
      buttons: [
        {
          text: 'Log In',
          handler: () => {
            this.router.navigate(['/login']);
          },
        },
        {
          text: 'Sign Up',
          handler: () => {
            this.router.navigate(['/register']);
          },
        },
        {
          text: 'Cancel',
          handler: () => {
            this.router.navigate(['/home']);
          },
        },
      ],
  
    });

    await alert.present();
  }

  toggleSidebar(visible: boolean) {
    this.sidebarVisible = visible;
  }

  gotoLogout() {
    this.router.navigate(['/login']); // Use the injected Router
  }

  gotoSettings() {
    this.router.navigate(['/settings']); // Use the injected Router
  }

  gotoProfile() {
    this.router.navigate(['/profile']); // Use the injected Router
  }

  gotoHome() {
    this.router.navigate(['/home']); // Use the injected Router
  }


  gotoFavorites() {
    this.router.navigate(['/favorites']); // Use the injected Router
  }

  gotoCart() {
    this.router.navigate(['/cart']); // Use the injected Router
  }

  gotoSearch(searchText: string) {
    this.router.navigate(['/search'], { queryParams: { query: searchText } });
  }
}
