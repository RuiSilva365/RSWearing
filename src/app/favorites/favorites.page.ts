import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';  // Import both ActivatedRoute and Router
import { DatabaseService } from '../../services/database.service'; 
import { AuthService } from '../../services/auth.service';
import { getAuth } from 'firebase/auth'; 
import { AlertController } from '@ionic/angular'; 

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  favoriteItems: { id: string; name: string; price: number; imageUrl: string }[] = [];
  sidebarVisible: boolean = false;
  sidebarTimeout: any; 
  isSidebarOpen: boolean = false;
  isLoggedIn: boolean = false; 
  user: any = {
    name: '',
    email: '',
    avatarUrl: '',
  };
  cartMessage: string = ''; // To display cart messages

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
      // Subscribe to user state changes
      this.authService.getUser().subscribe((user) => {
        if (user) {
          this.user.name = user.displayName || 'User';
    
          // Fetch additional user data, including avatarUrl
          this.databaseService.getUserData(user.uid).then((data) => {
            if (data) {
              this.user = { ...this.user, ...data };
    
              // Check if avatarUrl exists; if not, generate a random one
              if (!this.user.avatarUrl) {
                this.user.avatarUrl = this.generateRandomAvatarUrl();
              }
            }
          }).catch((error) => {
            console.error("Error fetching user data:", error);
          });
        } else {
          // Handle the case where the user is not logged in
          this.user.name = 'Not Logged in';
          this.user.avatarUrl = this.generateRandomAvatarUrl();
        }
      });
    // Load favorite items from storage (or service)
    this.loadFavoriteItems();
  }

  toggleSidebar() {
    // Toggle the sidebar's open/close state
    this.sidebarVisible = !this.sidebarVisible;
    if (this.sidebarVisible==true) {
      // Set a timeout to hide the sidebar after 3 seconds if it's still open
      this.sidebarTimeout = setTimeout(() => {
        this.sidebarVisible = false;
        this.isSidebarOpen = false;
        this.sidebarTimeout = null; // Ensure the timeout is cleared
      }, 3000); // 3000 milliseconds = 3 seconds
    }
  }

  generateRandomAvatarUrl() {
    const randomSeed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${randomSeed}`;
  }

  loadFavoriteItems() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid; // Get the actual user ID
      this.databaseService.getUserFavorites(userId).then((favoriteItemIds) => {
        if (favoriteItemIds.length === 0) {
          this.presentAlert('No Favorites', 'Your favorites list is empty.', [
            {
              text: 'Go to Shop',
              handler: () => {
                this.router.navigate(['/shop']); // Adjust this path as needed
              }
            },
            {
              text: 'Go Home',
              handler: () => {
                this.router.navigate(['/home']);
              }
            }
          ]);
        } else {
          this.favoriteItems = [];
          favoriteItemIds.forEach((itemId) => {
            this.databaseService.getItemData(itemId).then((itemData) => {
              if (itemData) {
                this.favoriteItems.push({
                  id: itemId,
                  name: itemData.title,
                  price: parseFloat(itemData.price.replace('€', '')), // Adjust based on your data format
                  imageUrl: itemData.imageUrl,
                });
              }
            });
          });
        }
      }).catch((error) => {
        console.error("Error loading favorite items:", error);
      });
    } else {
      this.presentAlert('Not Logged In', 'You are not logged in.', [
        {
          text: 'Login',
          handler: () => {
            this.router.navigate(['/login']);
          }
        },
        {
          text: 'Go Home',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }
      ]);
    }
  }

  // Method to present an alert
  async presentAlert(header: string, message: string, buttons: any[]) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons,
      backdropDismiss: false,

    });
    await alert.present();
  }


  removeFromFavorites(item: { id: string; name: string; price: number; imageUrl: string }) {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      const userId = user.uid;
      this.databaseService.removeFavoriteItem(userId, item.id).then(() => {
        this.favoriteItems = this.favoriteItems.filter(favItem => favItem.id !== item.id);
        console.log(`${item.name} removed from favorites.`);
      }).catch((error) => {
        console.error("Error removing favorite:", error);
      });
    } else {
      console.log("User is not logged in.");
    }
  }

  addToCart(item: { id: string; name: string; price: number; imageUrl: string }) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const cartItemData = {
        title: item.name,
        price: item.price,
        quantity: 1, // Default quantity
        imageUrl: item.imageUrl,
        description: '' // Add a description if available
      };

      this.databaseService.addToCart(userId, item.id, cartItemData).then(() => {
        this.cartMessage = `${item.name} added to cart!`;  // Set the cart message
        // Clear the message after a few seconds
        setTimeout(() => this.cartMessage = '', 3000);
      }).catch((error) => {
        console.error("Error adding item to cart:", error);
      });
    } else {
      this.presentAlert('Login Required', 'Please log in to add items to your cart.', [
        {
          text: 'Login',
          handler: () => {
            this.router.navigate(['/login']);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]);
    }
  }

  goToItemDetail(itemId: string) {
    this.router.navigate([`/item/${itemId}`]);
  }

  // Navigation functions
  gotoLogout() { this.router.navigate(['/login']); }
  gotoSettings() { this.router.navigate(['/settings']); }
  gotoProfile() { this.router.navigate(['/profile']); }
  gotoHome() { this.router.navigate(['/home']); }
  gotoCart() { this.router.navigate(['/cart']); }
  gotoSearch(searchText: string) { this.router.navigate(['/search'], { queryParams: { query: searchText } }); }
}
