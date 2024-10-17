import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-customer-support',
  templateUrl: './customer-support.page.html',
  styleUrls: ['./customer-support.page.scss'],
})
export class CustomerSupportPage implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  messages: Array<{ user: string, text: string | SafeHtml, options?: string[] }> = [];
  userMessage: string = '';
  isSending: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer,    private router: Router,
  ) {}

  ngOnInit() {
    this.messages.push({ user: 'bot', text: 'Hello! How can I assist you today?' });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges(); // Garante que as mudanças no DOM sejam detectadas
    this.scrollToBottom();
  }
  


  sendMessage() {
    if (this.userMessage.trim() === '' || this.isSending) return; // Don't send if empty or already sending

    // Add user's message to the chat
    this.messages.push({ user: 'me', text: this.userMessage });

    // Disable sending while processing the response
    this.isSending = true;

    // Generate bot response based on user message
    this.generateBotResponse(this.userMessage.toLowerCase());

    // Clear the user input fiel
    this.userMessage = '';
  }

  generateBotResponse(userMessage: string) {
    let botReply = '';
  
    // Greeting responses
    if (/hello|hi|hola|bonjour|olá|ola|boas|hey|greetings|howdy/.test(userMessage)) {
      botReply = "Hello! How can I assist you today? I'm here to help with any questions you may have.";
    }
  
    // Greeting responses
    else if (/how are you|are you good|como estas|ça va|tudo bem|como te encontras|are you fine/.test(userMessage)) {
      botReply = "I'm doing great, thanks for asking, what about you? Do you need some help?";
    }
  
    // Returns/Devolutions
    else if (/return|devolution|devolución|devolução|refund|exchange/.test(userMessage)) {
      botReply = 'Our return process is simple. You have 30 days to return your item. Go to <a href="https://www.rswearing.online/returns" target="_blank">rswearing.online/returns</a>, create a ticket, await for approval and the ID of the delivery and then follow our instructions.';
    }
  
    // Policies
    else if (/policy|policies|política|terms|privacy|legal/.test(userMessage)) {
      botReply = 'You can find our policies, including privacy and terms of service, at <a href="https://www.rswearing.online/policies" target="_blank">rswearing.online/policies</a>, available in Portuguese, English, Spanish, and French.';
    }
  
    // Site usage
    else if (/site usage|how to use|uso del sitio|uso do site|navigation|help/.test(userMessage)) {
      botReply = 'For help on using our site, visit <a href="https://www.rswearing.online/site-usage" target="_blank">rswearing.online/site-usage</a>. We provide guides and FAQs in multiple languages to assist you.';
    }
  
    // Cookies
    else if (/cookie|cookies|tracking/.test(userMessage)) {
      botReply = 'Our cookie policy can be found at <a href="https://www.rswearing.online/cookies" target="_blank">rswearing.online/cookies</a>. We use cookies to enhance your experience, and you can read more about it in Portuguese, English, Spanish, and French.';
    }
  
    // Company Info
    else if (/company|empresa|about us|sobre nosotros|sobre nós|who are you|background/.test(userMessage)) {
      botReply = 'We are RSwearing, a clothing brand committed to quality, sustainability, and customer satisfaction. Learn more about our mission and values at <a href="https://www.rswearing.online/about-us" target="_blank">rswearing.online/about-us</a>.';
    }
  
    // Shipping Info
    else if (/shipping|delivery|envío|entrega|ship/.test(userMessage)) {
      botReply = 'We offer worldwide shipping with multiple options to suit your needs. For more details, visit <a href="https://www.rswearing.online/shipping" target="_blank">rswearing.online/shipping</a>.';
    }
  
    // Payment Methods
    else if (/payment|pay|method|pago|pagamento/.test(userMessage)) {
      botReply = 'We accept various payment methods including credit cards, PayPal, and more. For a complete list, visit <a href="https://www.rswearing.online/payment-options" target="_blank">rswearing.online/payment-options</a>.';
    }
  
    // Discounts and Promotions
    else if (/discount|promotion|promo|sale|offer|descuento|oferta/.test(userMessage)) {
      botReply = 'Check out our latest discounts and promotions at <a href="https://www.rswearing.online/offers" target="_blank">rswearing.online/offers</a>. We frequently have sales and special deals for our customers.';
    }
  
    // Order Tracking
    else if (/track|tracking|order status|estado del pedido|rastrear/.test(userMessage)) {
      botReply = 'You can track your order by visiting <a href="https://www.rswearing.online/track-order" target="_blank">rswearing.online/track-order</a> and entering your tracking number.';
    }
  
    // Contact Information
    else if (/contact|support|help|customer service|atención al cliente/.test(userMessage)) {
      botReply = 'Feel free to contact us at <a href="https://www.rswearing.online/contact-us" target="_blank">rswearing.online/customer-support</a>. Our team is here to help you with any issues or questions you may have.';
    }
  
    // Product Information
    else if (/product|item|details|material|size|fit/.test(userMessage)) {
      botReply = 'You can find detailed information about our products, including materials, sizes, and care instructions, on each product page at <a href="https://www.rswearing.online" target="_blank">rswearing.online</a>.';
    }
  
    // Shipping Time
    else if (/shipping time|tempo de entrega|time for delivery|delivery time|fretes|days to arrive/.test(userMessage)) {
      botReply = "At RSWearing we know perfectly well our customers want to receive the products as fast as possible, and that's our goal. We work hard to deliver in 2-5 business days.";
    }
  
    // Unknown input
    else {
      botReply = "I'm not sure I understand. Please select one of the options above  or contact support at <a href='https://www.rswearing.online/contact-us' target='_blank'>rswearing.online/customer-support</a>.";
      this.showSuggestionButtons();
    }
  
    // Sanitize the HTML content for bot responses
    const sanitizedReply = this.sanitizer.bypassSecurityTrustHtml(botReply);
  
    // Add bot's response to the chat using the sanitized HTML
    this.messages.push({ user: 'bot', text: sanitizedReply });
    this.isSending = false; // Re-enable sending
  }
  

  showSuggestionButtons() {
    // Add buttons to the chat for further assistance
    this.messages.push({ user: 'bot', text: 'Please choose an option:', options: ['Policies', 'Returns', 'Shipping', 'Contact Us', 'Discounts', 'Payment Methods'] });
  }

  handleOptionClick(option: string) {
    let botReply = '';
    switch (option) {
      case 'Policies':
        botReply = 'You can find our policies at rswearing.online/policies.';
        break;
      case 'Returns':
        botReply = 'Our return process is simple. Please visit rswearing.online/returns for detailed information.';
        break;
      case 'Shipping':
        botReply = 'Shipping details can be found at rswearing.online/shipping.';
        break;
      case 'Contact Us':
        botReply = 'Feel free to contact us at rswearing.online/customer-support.';
        break;
      case 'Discounts':
        botReply = 'Check out our latest discounts and promotions at rswearing.online/offers.';
        break;
      case 'Payment Methods':
        botReply = 'We accept various payment methods including credit cards and PayPal. For more details, visit rswearing.online/payment-options.';
        break;
      default:
        botReply = "I'm here to assist you with anything else you need.";
    }
    this.messages.push({ user: 'bot', text: botReply });
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }, 100); // Pequeno delay para garantir que o DOM está atualizado
  }
  
  gotoHome() {
    this.router.navigate(['/home']);
  } 
}