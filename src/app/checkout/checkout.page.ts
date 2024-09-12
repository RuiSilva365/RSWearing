import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service'; // Import DatabaseService
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

interface CartItem {
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description: string;
  size: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  showCreditCardForm = true;
  cartItems: CartItem[] = [];
  sidebarVisible: boolean = false;
  user: any = {
    name: '',
    email: '',
  };

  constructor(private databaseService: DatabaseService, private router: Router) { }

  ngOnInit() {
    this.loadCartItems(); // Load cart items on component initialization
  }

  // Method to load cart items for the authenticated user
  loadCartItems() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      this.databaseService.getCartItems(user.uid).then((cartItems) => {
        if (cartItems) {
          this.cartItems = Object.keys(cartItems).map((key) => {
            return {
              ...cartItems[key],
              id: key // Include item ID if needed
            };
          });
        } else {
          this.cartItems = []; // Handle the case where there are no items
        }
      }).catch((error) => {
        console.error("Error loading cart items:", error);
      });
    } else {
      console.log("User is not logged in.");
      // Optionally, redirect to login or show an error message
      this.router.navigate(['/login']);
    }
  }

  get totalPrice(): number {
    return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  // Existing methods remain unchanged...
  selectPaymentMethod(method: string) {
    if (method === 'paypal' || method === 'apple-pay' || method === 'google-pay') {
      this.showCreditCardForm = false;
    } else {
      this.showCreditCardForm = true;
    }
  }

  toggleSidebar(visible: boolean) {
    this.sidebarVisible = visible;
  }

  gotoLogout() {
    this.router.navigate(['/login']);
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

  gotoFacebookPage() {
    this.router.navigate(['/profile']);
  }

  gotoInstagramPage() {
    this.router.navigate(['/profile']);
  }

  gotoTwitterPage() {
    this.router.navigate(['/profile']);
  }

  gotoTiktokPage() {
    this.router.navigate(['/profile']);
  }
}
