import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer-support',
  templateUrl: './customer-support.page.html',
  styleUrls: ['./customer-support.page.scss'],
})
export class CustomerSupportPage implements OnInit {
  messages: Array<{ user: string, text: string }> = [];
  userMessage: string = '';
  apiUrl = 'https://rswearing-production.up.railway.app/send-botpress-message'; // Updated to point to new botpress endpoint

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.messages.push({ user: 'bot', text: 'Hello! How can I assist you today?' });
  }

  sendMessage() {
    if (this.userMessage.trim() === '') return;
  
    this.messages.push({ user: 'me', text: this.userMessage });
  
    const payload = { message: this.userMessage };
  
    // Make the request to the backend
    this.http.post(this.apiUrl, payload).subscribe((response: any) => {
      const botMessage = response.botResponse;
      this.messages.push({ user: 'bot', text: botMessage });
    });
  
    this.userMessage = '';
  }
}
