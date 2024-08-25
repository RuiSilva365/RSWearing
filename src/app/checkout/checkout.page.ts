import { Component, contentChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';  // Import both ActivatedRoute and Router


interface CartItem {
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description: string;
}
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  // Property to track if the credit card form should be shown
  showCreditCardForm = true;
  cartItems: CartItem[] = [];
  sidebarVisible: boolean = false;
  user: any = {
    name: '',
    email: '',
  };



  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {}

  // Method to handle payment option selection
  selectPaymentMethod(method: string) {
    // Check if the selected method is not a credit card method
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

  gotoFavorites() {
    this.router.navigate(['/favorites']);  // Use the injected Router
  }
  gotoCart() {
    this.router.navigate(['/cart']);  // Use the injected Router
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

