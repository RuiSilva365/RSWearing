import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { Observable } from 'rxjs';
import { DatabaseService } from '../services/database.service'; // Import DatabaseService
import { environment } from '../environments/environment';
import { loadScript } from '@paypal/paypal-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardNumber!: StripeCardNumberElement;
  private cardExpiry!: StripeCardExpiryElement;
  private cardCvc!: StripeCardCvcElement;
  private paypalButtonRendered = false;


  constructor(private http: HttpClient, private databaseService: DatabaseService) {
    this.initializeStripe();
  }

  async initializeStripe() {
    this.stripe = await loadStripe('pk_test_51PzoiU01Wt7ByK5ntSQg1pUPGJerlFITcYuuc3BZFxJmCRZKDbJFkMYI2qzcwS5rzYtuE1shLnJQpNJlTXPP7Mg1009aD3ir05'); // Use your public key
    if (this.stripe) {
      console.log('Stripe initialized correctly');
      this.elements = this.stripe.elements();

      this.cardNumber = this.elements.create('cardNumber', { style: { base: { color: '#32325d' } } });
      this.cardNumber.mount('#card-number-element');
      this.cardExpiry = this.elements.create('cardExpiry', { style: { base: { color: '#32325d' } } });
      this.cardExpiry.mount('#card-expiry-element');
      this.cardCvc = this.elements.create('cardCvc', { style: { base: { color: '#32325d' } } });
      this.cardCvc.mount('#card-cvc-element');

      this.cardNumber.on('change', (event) => {
        if (event.error) {
          console.error('Card number error:', event.error.message);
        }
        this.displayCardBrand(event.brand);
      });

    } else {
      console.error('Error initializing Stripe');
    }
  }

  displayCardBrand(brand: string) {
    const brandIconElement = document.getElementById('card-brand-icon') as HTMLImageElement;

    if (!brandIconElement) {
      return;
    }

    const brandIconMap: { [key: string]: string } = {
      visa: 'assets/images/visa.png',
      mastercard: 'assets/images/mastercard.png',
      amex: 'assets/images/amex.png',
      unknown: 'assets/images/default.png'
    };

    const brandImage = brandIconMap[brand] || brandIconMap['unknown'];
    brandIconElement.src = brandImage;
  }

  createPaymentIntent(amount: number, currency: string): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(`${environment.apiUrl}/create-payment-intent`, { amount, currency });
  }

  async initializePayPalButton(totalPrice: number) {
    try {
      if (this.paypalButtonRendered) {
        console.log("PayPal button is already rendered.");
        return; // Prevent rendering another button
      }
  
      const paypalScript = await loadScript({
        clientId: "BAA3KOWNYjl8LF8MvmN7h_VONNsHNzHGXf3nFSvZX79Tk9Ogu6rllc-fGkT-AHOYvigFNOjmES1aWaT-Ks",
        currency: "EUR",
      });
  
      if (!paypalScript) {
        console.error("Failed to load PayPal SDK script");
        return;
      }
  
      const paypal = (window as any).paypal;
      if (!paypal) {
        console.error('PayPal SDK is not available on the window object');
        return;
      }
  
      // Render the PayPal button only once
      paypal.Buttons({
        style: {
          layout: 'horizontal',
          tagline: 'false',
          color: 'white', // Set the background color to white
          border: 'white',
          shape: 'rect', 
          height: 25, 

        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: (totalPrice / 100).toFixed(2), // Convert cents to euros
              },
            }],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            console.log("Transaction completed by ", details.payer.name.given_name);
          });
        },
        onError: (err: any) => {
          console.error("PayPal error", err);
        }
      }).render("#paypal-button-render");
  
      this.paypalButtonRendered = true; // Set the flag to true after rendering the button
  
    } catch (error) {
      console.error("PayPal SDK failed to load or initialize:", error);
    }
  }
  
  
  initializeApplePay(totalPrice: number) {
    const paymentRequest = this.stripe!.paymentRequest({
      country: 'US', 
      currency: 'eur',
      total: {
        label: 'Total',
        amount: totalPrice,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    paymentRequest.canMakePayment().then((result) => {
      if (result) {
        const applePayButton = this.elements!.create('paymentRequestButton', {
          paymentRequest,
          style: {
            paymentRequestButton: {
              theme: 'light-outline',  // Set button theme
            }
          }
        });
        applePayButton.mount('#apple-pay-button');
      } else {
        alert('Apple Pay is not available on this device.');
      }
    });
  }

  initializeGooglePay(totalPrice: number) {
    const paymentRequest = this.stripe!.paymentRequest({
      country: 'US', 
      currency: 'eur',
      total: {
        label: 'Total',
        amount: totalPrice, 
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    paymentRequest.canMakePayment().then((result) => {
      if (result) {
        const googlePayButton = this.elements!.create('paymentRequestButton', {
          paymentRequest,
          style: {
            paymentRequestButton: {
              theme: 'light-outline',  // Set button theme
            }
          }
        });
        googlePayButton.mount('#google-pay-button');
      } else {
        alert('Google Pay is not available on this device.');
      }
    });
  }

  async handlePayment(clientSecret: string, items: any[], totalAmount: number, currency: string, userDetails: any) {
    if (!this.stripe || !this.cardNumber || !this.cardExpiry || !this.cardCvc) {
      console.error('Stripe not initialized or card elements missing');
      return;
    }

    console.log('Processing payment with clientSecret:', clientSecret);

    const cardNameInput = document.getElementById('card_name') as HTMLInputElement | null;
    const cardName = cardNameInput ? cardNameInput.value : '';

    const { email, phone, address } = userDetails;
    const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: cardName,
          email: email,
          phone: phone,
          address: {
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            postal_code: address.postal_code,
            country: address.country
          }
        }
      }
    });

    if (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed: ' + error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded:', paymentIntent);

      const order = {
        orderId: paymentIntent.id,
        userId: userDetails.userId,
        email: email,
        phone: phone,
        address: {
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          postal_code: address.postal_code,
          country: address.country
        },
        items,
        totalAmount,
        currency,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      try {
        alert('Payment succeeded! The order was saved successfully.');
      } catch (firebaseError) {
        console.error('Error saving order to Firebase:', firebaseError);
        alert('Payment succeeded, but there was an error saving the order.');
      }
    }
  }
}
