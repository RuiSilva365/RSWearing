import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  // Define the type explicitly
  faqs: { question: string, answer: string }[] = [
    { question: 'What is the return policy?', answer: ' Our return policy lasts 30 days. If 30 days have gone by since your purchase, we can’t offer you a refund or exchange.' },
    { question: 'How long does shipping take?', answer: ' Shipping typically takes 5-7 business days.' },
    { question: 'Do you offer international shipping?', answer: ' No, at the moment we do not offer international shipping outside Portugal, yet.' },
  ];

  // Define filteredFaqs with the same type as faqs
  filteredFaqs: { question: string, answer: string }[] = [];

  searchTerm: string = '';  // For search bar

  constructor(private router: Router) { }

  ngOnInit() {
    this.filteredFaqs = this.faqs; // Initialize with all FAQs
  }

  // Filter FAQs based on search term
  filterFaqs(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm) {
      this.filteredFaqs = this.faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredFaqs = this.faqs; // Reset if no search term
    }
  }






  gotoCustomerSupport() {
    this.router.navigate(['/customer-support']);
  }








}
