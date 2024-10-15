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
  botpressUrl = 'https://webhook.botpress.cloud/6374e7a7-b100-443f-bda2-215ec7574d57'; // Using your specific Botpress webhook

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.messages.push({ user: 'bot', text: 'Hello! How can I assist you today?' });
  }

  sendMessage() {
    if (this.userMessage.trim() === '') return;
  
    this.messages.push({ user: 'me', text: this.userMessage });
  
    const payload = {
      type: 'text',
      text: this.userMessage
    };
  
    // Make the request directly to Botpress webhook
    this.http.post(this.botpressUrl, payload).subscribe(
      (response: any) => {
        console.log("Botpress response:", response); // Log the full response to the console
  
        if (response && response.responses && response.responses.length > 0) {
          const botMessage = response.responses[0].text;
          this.messages.push({ user: 'bot', text: botMessage });
        } else {
          this.messages.push({ user: 'bot', text: "Sorry, I didn't understand that." });
        }
      },
      (error) => {
        console.error('Error in botpress response:', error);
        this.messages.push({ user: 'bot', text: "Error communicating with the bot. Please try again later." });
      }
    );
  
    this.userMessage = '';
  }
}
