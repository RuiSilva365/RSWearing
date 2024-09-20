import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
})
export class OrdersPageComponent implements OnInit {
  currentOrders: any[] = [];
  pastOrders: any[] = [];
  orderType: string = '';

  constructor(private route: ActivatedRoute, private databaseService: DatabaseService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.orderType = params['type'];
      this.loadOrders(this.orderType);
    });
  }

  loadOrders(type: string) {
    const userId = getAuth().currentUser?.uid;
    if (userId) {
      this.databaseService.getOrders(userId).then(orders => {
        if (Array.isArray(orders)) {
          if (type === 'current') {
            this.currentOrders = orders.filter(order => order.status === 'active');
          } else if (type === 'history') {
            this.pastOrders = orders.filter(order => order.status === 'finished');
          }
        } else {
          console.log('No orders found or error fetching orders.');
        }
      }).catch(error => {
        console.error('Error loading orders:', error);
      });
    }
  }
  

  markOrderAsFinished(orderId: string) {
    this.databaseService.updateOrderStatus(orderId, 'finished').then(() => {
      console.log('Order status updated to finished');
      this.loadOrders(this.orderType); // Refresh the list
    });
  }
}
