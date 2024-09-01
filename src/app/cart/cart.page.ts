import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';  // Import both ActivatedRoute and Router
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; // Import Firebase Auth
import { AuthService } from '../../services/auth.service'; // Import your AuthService

interface CartItem {
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

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    // Subscribe to user state changes
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.isLoggedIn = true; // User is logged in
        this.user.name = user.displayName || 'User';
        this.user.email = user.email || '';
      } else {
        this.isLoggedIn = false; // No user is logged in
      }
    });

    this.calculateTotal()
  }

  // Getter for total price
  get totalPrice(): number {
    return this.cartSubtotal - this.couponDiscount + this.shippingFees;
  }
applyCoupons(discount_value: number) {
  this.couponDiscount = discount_value;
}
  // Function to calculate subtotal
  calculateTotal() {
    this.cartSubtotal = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotal();
    }
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.calculateTotal();
  }

  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(i => i !== item);
    this.calculateTotal();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);  // Use the injected Router
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

}
