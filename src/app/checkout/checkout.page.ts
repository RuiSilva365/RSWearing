import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service'; // Import DatabaseService
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  StripeService  } from '../../services/stripe.service';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description: string;
  size: string;
  couponDiscount?: string;
}



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  checkoutForm!: FormGroup;
  showCreditCardForm = true;
  cartItems: CartItem[] = [];
  sidebarVisible: boolean = false;
  couponDiscount: number = 0;
  selectedPaymentMethod: string = 'card'; 
  user: any = {
    name: '',
    email: '',
  };

  
  constructor(
    private formBuilder: FormBuilder,  // Inject FormBuilder
    private databaseService: DatabaseService,
    private router: Router,
    private stripeService: StripeService
  ) {}

  ngOnInit() {
    this.loadCartItems(); // Load cart items on component initialization
     // Initialize the form with validation rules
     this.checkoutForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      postal_code: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      card_name: ['', Validators.required]
    });
    
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


 // TypeScript
  handlePayment() {
    if (this.selectedPaymentMethod === 'card') {
      this.handleStripePayment();
    } else if (this.selectedPaymentMethod === 'google-pay') {
      this.stripeService.initializeGooglePay(this.totalPrice * 100);
    } else if (this.selectedPaymentMethod === 'apple-pay') {
      // Trigger Apple Pay payment
    } else if (this.selectedPaymentMethod === 'paypal-pay') {
      this.stripeService.initializePayPalButton(this.totalPrice * 100);
    }
  }


  setPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;

    // Keep the card form visible and just trigger the right logic based on selected method
    if (method === 'apple-pay') {
        this.stripeService.initializeApplePay(this.totalPrice * 100);
    } else if (method === 'google-pay') {
        this.stripeService.initializeGooglePay(this.totalPrice * 100);
    } else if (method === 'paypal-pay') {
        this.stripeService.initializePayPalButton(this.totalPrice * 100);
    } 
}

  

  // Ensure that the form is valid before handling payment
  async handleStripePayment() {
    if (this.checkoutForm.invalid) {
        this.checkoutForm.markAllAsTouched(); // Highlight all fields if the form is invalid
        return;
    }

    const user = getAuth().currentUser;
    if (!user) {
        console.error('User is not authenticated');
        return;
    }

    const userDetails = {
        userId: user.uid,
        email: this.checkoutForm.value.email,
        phone: this.checkoutForm.value.phone,
        address: {
            line1: this.checkoutForm.value.address,
            line2: '', // Additional address line, if any
            city: this.checkoutForm.value.city,
            postal_code: this.checkoutForm.value.postal_code,
            country: 'PT' // Replace with the correct country ISO code
        }
    };

    const items = this.cartItems.map(item => ({
      itemId: item.id, // Use the unique item ID here
      title: item.title, // You can still include the title for display purposes if needed
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      imageUrl: item.imageUrl // Include image URL here if available
    }));

    const totalAmount = this.totalPrice * 100; // Convert to cents
    const currency = 'eur';

    this.stripeService.createPaymentIntent(totalAmount, currency).subscribe(
        async (response: { clientSecret: string }) => {
            const clientSecret = response.clientSecret;
            await this.stripeService.handlePayment(clientSecret, items, totalAmount, currency, userDetails);

            // Generate a unique order ID. You can replace this with your own logic.
            const orderId = this.generateUniqueOrderId(); 

            // Prepare the order data
            const orderData = {
                userId: user.uid,
                items: items,
                totalAmount: totalAmount / 100, // Convert to euros for display purposes
                status: 'active', // Initially set the status to active
                createdAt: new Date().toISOString(),
                email: userDetails.email,
                phone: userDetails.phone,
                address: userDetails.address
            };

            try {
                // Save the order data
                await this.databaseService.writeOrderData(orderId, orderData);
                console.log('Order saved successfully');

                // Navigate to the payment success page
                this.router.navigate(['/payment-success'], {
                    queryParams: {
                        transactionId: response.clientSecret,
                        amountPaid: this.totalPrice,
                        items: JSON.stringify(this.cartItems),
                    },
                });
            } catch (error) {
                console.error('Error saving order:', error);
            }
        },
        (error: any) => {
            console.error('Error creating Payment Intent:', error);
        }
    );
}

  
  // Generate a unique order ID (you can replace this with your own logic)
  generateUniqueOrderId(): string {
    return 'order_' + Math.random().toString(36).substr(2, 9);
  }
  
  get totalPrice(): number {
    const cartSubtotal = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFees = cartSubtotal >= 50 ? 0 : 4.99;
    return cartSubtotal - this.couponDiscount + shippingFees;
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
