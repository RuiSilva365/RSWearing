import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';  // Import both ActivatedRoute and Router
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import { AuthService } from '../../services/auth.service'; // Import your AuthService
import { DatabaseService } from '../../services/database.service'; 
import { AlertController } from '@ionic/angular';

interface CartItem {
  id: string;  // Ensure the id is included
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss']
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  cartSubtotal: number = 0;
  couponDiscount: number = 0;
  shippingFees: number = 4.99;
  sidebarVisible: boolean = false;
  isLoggedIn: boolean = false; // Add this flag
  user: any = {
    name: '',
    email: '',
  };
  couponInput: string = '';
  couponMessage: string = '';
  couponMessageColor: string = ''; // For styling the message

  // Valid coupons for testing
  validCoupons: { [key: string]: number } = {
    'ruisilva': 5, // This coupon applies a 5 currency unit discount
    'diogosilva': 20,
    'alvasilva': -20
  };

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private alertController: AlertController,
    private databaseService: DatabaseService 
  ) {}

  ngOnInit() {
    // Subscribe to user state changes
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.user.name = user.displayName || 'User';
        this.user.email = user.email || '';
        this.loadCartItems(user.uid); // Load cart items for logged-in user
      } else {
        this.isLoggedIn = false;
        this.presentAlert('Not Logged In', 'Please log in to access your cart.', [
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
    });
  }

  loadCartItems(userId: string) {
    this.databaseService.getCartItems(userId).then((cartItems) => {
      if (cartItems) {
        this.cartItems = Object.keys(cartItems).map((key) => {
          return {
            ...cartItems[key],
            id: key // Include item ID
          };
        });
        this.calculateTotal();
      } else {
        this.cartItems = [];
        this.calculateTotal();
      }
    }).catch((error) => {
      console.error("Error loading cart items:", error);
    });
  }

  updateCartItemQuantity(item: CartItem) {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      // Update the item quantity in the backend
      this.databaseService.updateCartItem(userId, item.id, { quantity: item.quantity }).then(() => {
        console.log(`Updated quantity for ${item.title} to ${item.quantity}.`);
      }).catch((error) => {
        console.error("Error updating item quantity in cart:", error);
      });
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCartItemQuantity(item); // Update backend with new quantity
      this.calculateTotal();
    } else {
      this.presentDeleteAlert(item);
    }
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.updateCartItemQuantity(item); // Update backend with new quantity
    this.calculateTotal();
  }

  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(i => i !== item);
    this.calculateTotal();
    // Correctly update the backend by using the item ID
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.databaseService.removeFromCart(userId, item.id).then(() => {
        console.log(`${item.title} removed from cart.`);
      }).catch((error) => {
        console.error("Error removing item from cart:", error);
      });
    }
  }
  
  // Function to calculate subtotal
  calculateTotal() {
    this.cartSubtotal = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  // Getter for total price
  get totalPrice(): number {
    const total = this.cartSubtotal - this.couponDiscount + this.shippingFees;
    return parseFloat(total.toFixed(2));
  }
  
  applyCoupons() {
    if (this.couponInput in this.validCoupons) {
      this.couponDiscount = this.validCoupons[this.couponInput];
      this.couponMessage = 'Coupon applied!';
      this.couponMessageColor = 'green'; // Set message color to green for success
    } else {
      this.couponDiscount = 0;
      this.couponMessage = 'Coupon not valid';
      this.couponMessageColor = 'red'; // Set message color to red for error
    }
    setTimeout(() => this.couponMessage = '', 3000); // Clear message after 3 seconds
    this.calculateTotal();
  }

  async presentDeleteAlert(item: CartItem) {
    const alert = await this.alertController.create({
      header: 'Delete Item',
      message: `Are you sure you want to remove ${item.title} from the cart?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.removeItem(item);
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlert(header: string, message: string, buttons: any[]) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons
    });
    await alert.present();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout'], { state: { cartItems: this.cartItems } });
  }

  toggleSidebar(visible: boolean) {
    this.sidebarVisible = visible;
  }

  gotoLogout() {
    this.router.navigate(['/login']);  // Use the injected Router
  }

  gotoSettings() {
    this.router.navigate(['/settings']);  // Use the injected Router
  }

  gotoProfile() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }

  gotoHome() {
    this.router.navigate(['/home']);  // Use the injected Router
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

  gotoFavorites() {
    this.router.navigate(['/favorites']);  // Use the injected Router
  }
}
