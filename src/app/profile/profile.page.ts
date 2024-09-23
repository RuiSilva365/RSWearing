import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service'; 
import { getAuth } from 'firebase/auth'; 

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  sidebarVisible: boolean = false;
  isEditFrameVisible: boolean = false;
  isEditAvatarVisible = false;
  user: any = {
    name: '',
    email: '',
    phone_num: '',
    country: '',
    address: '',
    postal_code: '',
    birthdate: '',
    age: '',
    preferredSize: '',
    avatarUrl: '' // Ensure the user object has an avatarUrl field
  };
  editableUser: any = { ...this.user }; // Make sure this is updated properly on init

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private alertController: AlertController,
    private databaseService: DatabaseService 
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.user.name = user.displayName || 'User';
        this.user.email = user.email || '';

        this.databaseService.getUserData(user.uid).then((data) => {
          if (data) {
            this.user = { ...this.user, ...data };

            // Check if avatarUrl exists; if not, generate a random one
            if (!this.user.avatarUrl) {
              this.user.avatarUrl = this.generateRandomAvatarUrl();
            }

            this.editableUser = { ...this.user };
          }
        }).catch((error) => {
          console.error("Error fetching user data:", error);
        });
      } else {
        if (!this.authService.getCurrentUser() && !this.authService.logoutFlag) {
          this.presentLoginSignupAlert();
        }
      }
    });
  }

  generateRandomAvatarUrl() {
    //const randomSeed = Math.random().toString(36).substring(7); // Generate a random string as the seed
    //return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${randomSeed}`;
    return   `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=agm2dg`;

  
  }
  openEditFrame() {
    this.isEditFrameVisible = true;
    this.editableUser = { ...this.user }; // Ensure it's a fresh copy
  }
  
  closeEditFrame() {
    this.isEditFrameVisible = false;
  }

  submitEditForm() {
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (currentUser) {
      // Ensure birthdate is formatted correctly
      if (this.editableUser.birthdate) {
        this.editableUser.birthdate = this.editableUser.birthdate.split('T')[0];
      }
  
      // Update address structure
      const address = {
        line1: this.editableUser.address.line1 || '',
        line2: this.editableUser.address.line2 || '',
        city: this.editableUser.address.city || '',
        postal_code: this.editableUser.postal_code || '',
        country: this.editableUser.country || ''
      };
      this.editableUser.address = address;
  
      this.databaseService.updateUserData(currentUser.uid, this.editableUser)
        .then(() => {
          this.user = { ...this.editableUser }; // Update user info
          this.closeEditFrame(); // Close the edit frame
        })
        .catch((error) => {
          console.error("Error updating user data:", error);
        });
    }
  }
  
  updateAvatar(newAvatarUrl: string) {
    this.isEditAvatarVisible = false;
    this.user.avatarUrl = newAvatarUrl; // Update local user data

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Use updateUserData to update only the avatarUrl
      this.databaseService.updateUserData(currentUser.uid, { avatarUrl: newAvatarUrl })
        .then(() => {
          console.log('Avatar URL successfully updated in the database.');
        })
        .catch((error) => {
          console.error("Error updating avatar:", error);
        });
    }
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

  formatPostalCode(event: any) {
    const input = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (input.length > 4) {
      this.editableUser.postal_code = input.substring(0, 4) + ' ' + input.substring(4, 7);
    } else {
      this.editableUser.postal_code = input;
    }
  }

  
  toggleSidebar(visible: boolean) {
    this.sidebarVisible = visible;
  }

  gotoLogout() {
    const auth = getAuth();

    if (auth.currentUser) {
      this.authService.logoutFlag = true; // Use the setter method
      auth.signOut().then(() => {
        this.user = {
          name: '',
          email: '',
          phone_num: '',
          country: '',
          address: '',
          postal_code: '',
          birthdate: '',
          age: '',
          preferredSize: ''
        };
        this.router.navigate(['/login']);
      }).catch((error) => {
        console.error("Error logging out:", error);
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  openEditAvatar() {
    this.isEditAvatarVisible = true;
  }

  gotoSettings() {
    this.router.navigate(['/settings']);
  }

  gotoProfile() {
    this.router.navigate(['/profile']);
  }

  gotoHome() {
    this.router.navigate(['/home']);
  }

  gotoFavorites() {
    this.router.navigate(['/favorites']);
  }

  gotoCart() {
    this.router.navigate(['/cart']);
  }

  gotoSearch(searchText: string) {
    this.router.navigate(['/search'], { queryParams: { query: searchText } });
  }
}
