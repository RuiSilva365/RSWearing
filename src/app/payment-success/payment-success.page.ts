import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface PurchasedItem {
  title: string;
  price: number;
  quantity: number;
  size: string;
}

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.page.html',
  styleUrls: ['./payment-success.page.scss'],
})
export class PaymentSuccessPage implements OnInit {
  transactionId!: string;
  amountPaid!: number;
  purchasedItems: PurchasedItem[] = [];
  paymentDate!: string;
  totalPrice!: number;


  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Recebe os dados passados ao redirecionar para esta página
    this.route.queryParams.subscribe(params => {
      this.transactionId = params['transactionId'];
      this.amountPaid = params['amountPaid'];
      this.totalPrice = this.amountPaid; 

      // Recebe os itens comprados (convertendo de string para JSON)
      const items = JSON.parse(params['items']);
      this.purchasedItems = items;

      // Captura a data do pagamento
      this.paymentDate = new Date().toLocaleDateString(); // Data atual formatada
    });
  }

  // Função para navegar de volta à página inicial
  goToHome() {
    this.router.navigate(['/home']);
  }

  // Função para baixar os detalhes do pagamento como JSON
  downloadReceipt() {
    const receiptData = {
      transactionId: this.transactionId,
      amountPaid: this.amountPaid,
      paymentDate: this.paymentDate,
      purchasedItems: this.purchasedItems
    };

    const receiptJson = JSON.stringify(receiptData, null, 2);
    const blob = new Blob([receiptJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${this.transactionId}.json`; // Nome do ficheiro com ID da transação
    a.click();
    window.URL.revokeObjectURL(url); // Limpa o URL após o download
  }
}
