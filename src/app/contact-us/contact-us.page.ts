import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage {
  contact = {
    email: '',
    type: 'general',
    orderId: '',
    subject: '',
    message: ''
  };

  onTypeChange() {
    if (this.contact.type !== 'orders') {
      this.contact.orderId = ''; // Clear order ID if type is not "Orders"
    }
  }

  onSubmit() {
    console.log('Form submitted:', this.contact);
    // Add further logic to handle form submission, such as sending data to a server
  }
}
