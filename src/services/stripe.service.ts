import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { Observable } from 'rxjs';
import { DatabaseService } from '../services/database.service'; // Importa o DatabaseService
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardNumber!: StripeCardNumberElement;
  private cardExpiry!: StripeCardExpiryElement;
  private cardCvc!: StripeCardCvcElement;
  

  constructor(private http: HttpClient, private databaseService: DatabaseService) {
    this.initializeStripe();
  }

  async initializeStripe() {
    this.stripe = await loadStripe('pk_test_51PzoiU01Wt7ByK5ntSQg1pUPGJerlFITcYuuc3BZFxJmCRZKDbJFkMYI2qzcwS5rzYtuE1shLnJQpNJlTXPP7Mg1009aD3ir05'); // Usa a tua chave pública
    if (this.stripe) {
      console.log('Stripe inicializado corretamente'); // Log de verificação
      this.elements = this.stripe.elements();
      console.log('Stripe inicializado corretamente');

  
      this.cardNumber = this.elements.create('cardNumber', { style: { base: { color: '#32325d' } } });
      this.cardNumber.mount('#card-number-element');
      console.log('Card Number montado'); // Adiciona este log
  
      this.cardExpiry = this.elements.create('cardExpiry', { style: { base: { color: '#32325d' } } });
      this.cardExpiry.mount('#card-expiry-element');
      console.log('Card Expiry montado'); // Adiciona este log
  
      this.cardCvc = this.elements.create('cardCvc', { style: { base: { color: '#32325d' } } });
      this.cardCvc.mount('#card-cvc-element');
      console.log('Card CVC montado'); // Adiciona este log

      this.cardNumber.on('change', (event) => {
        if (event.error) {
          console.error('Card number error:', event.error.message);
        }

        this.displayCardBrand(event.brand);
      });

    } else {
      console.error('Erro ao inicializar o Stripe');
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
  
  initializeGooglePay() {
    const totalAmount = 5000; // Example total amount in cents
    const paymentRequest = this.stripe!.paymentRequest({
      country: 'US', // or your country code
      currency: 'eur',
      total: {
        label: 'Total',
        amount: totalAmount, // Total in cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });
  
    paymentRequest.canMakePayment().then((result) => {
      if (result) {
        const googlePayButton = this.elements!.create('paymentRequestButton', { paymentRequest });
        googlePayButton.mount('#google-pay-button');
      } else {
        console.log('Google Pay is not available');
      }
    });
  }
  




  async handlePayment(clientSecret: string, items: any[], totalAmount: number, currency: string, userDetails: any) {
    if (!this.stripe || !this.cardNumber || !this.cardExpiry || !this.cardCvc) {
      console.error('Stripe não foi inicializado ou o elemento de cartão está ausente');
      return;
    }

    console.log('A processar o pagamento com o clientSecret:', clientSecret);

    const cardNameInput = document.getElementById('card_name') as HTMLInputElement | null;
    const cardName = cardNameInput ? cardNameInput.value : '';

    const { email, phone, address } = userDetails;
    const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.cardNumber, // Passar diretamente o elemento do cartão
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

    const paymentRequest = this.stripe.paymentRequest({
      country: 'US', // or your country
      currency: 'eur',
      total: {
        label: 'Total',
        amount: totalAmount, // in cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    
    paymentRequest.canMakePayment().then((result) => {
      if (result) {
        const googlePayButton = this.elements!.create('paymentRequestButton', { paymentRequest }); 
        googlePayButton.mount('#google-pay-button');
      } else {
        console.log('Google Pay is not available');
      }
    });
    

    if (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('O pagamento falhou: ' + error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Pagamento bem-sucedido:', paymentIntent);

      const order = {
        orderId: paymentIntent.id,
        userId: userDetails.userId, // ID do utilizador autenticado
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
        alert('Pagamento bem-sucedido! A encomenda foi guardada com sucesso.');
      } catch (firebaseError) {
        console.error('Erro ao guardar encomenda no Firebase:', firebaseError);
        alert('Pagamento bem-sucedido, mas ocorreu um erro ao guardar a encomenda.');
      }
    }
  }
}
