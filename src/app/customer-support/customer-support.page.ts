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
  botpressUrl = 'https://webhook.botpress.cloud/6374e7a7-b100-443f-bda2-215ec7574d57'; // Replace with your Botpress URL

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.messages.push({ user: 'bot', text: 'Hello! How can I assist you today?' });
  }

  sendMessage() {
    if (this.userMessage.trim() === '') return;

    this.messages.push({ user: 'me', text: this.userMessage });

    const payload = {
      message: this.userMessage
    };

    // Alterei aqui para chamar o endpoint /send-message do backend
    this.http.post('https://rswearing-production.up.railway.app/send-message', payload).subscribe((response: any) => {
      const botMessage = response.botResponse; // Corrigido para 'botResponse'
      this.messages.push({ user: 'bot', text: botMessage });
    });

    this.userMessage = '';
  }
  
}
