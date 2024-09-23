import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { DatabaseService } from '../../services/database.service';
import { getAuth } from 'firebase/auth';
import { AuthService } from '../../services/auth.service'; // Import your AuthService


@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
})
export class OrdersPageComponent implements OnInit {
  currentOrders: any[] = [];
  pastOrders: any[] = [];
  expandedOrders: { [key: string]: boolean } = {}; // Track expanded state
  orderType: string = '';
  sidebarVisible: boolean = false;
  sidebarTimeout: any; 
  isSidebarOpen: boolean = false;
  isLoggedIn: boolean = false; // Add this flag
  user: any = {
    name: '',
    email: '',
    avatarUrl: '',
  };

  constructor(
    private route: ActivatedRoute, 
    private databaseService: DatabaseService,
    private authService: AuthService, 
    private router: Router // Add router for navigation
  ) {}

  ngOnInit() {
    // Subscribe to user state changes
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.user.name = user.displayName || 'User';
  
        // Fetch additional user data, including avatarUrl
        this.databaseService.getUserData(user.uid).then((data) => {
          if (data) {
            this.user = { ...this.user, ...data };
  
            // Check if avatarUrl exists; if not, generate a random one
            if (!this.user.avatarUrl) {
              this.user.avatarUrl = this.generateRandomAvatarUrl();
            }
          }
        }).catch((error) => {
          console.error("Error fetching user data:", error);
        });
      } else {
        // Handle the case where the user is not logged in
        this.user.name = 'Not Logged in';
        this.user.avatarUrl = this.generateRandomAvatarUrl();
      }
    });
  // Load favorite items from storage (or service)
  this.route.queryParams.subscribe(params => {
    this.orderType = params['type'];
    this.loadOrders(this.orderType);
  });
}

generateRandomAvatarUrl() {
  const randomSeed = Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${randomSeed}`;
}


  loadOrders(type: string) {
    const userId = getAuth().currentUser?.uid;
    if (userId) {
      this.databaseService.getOrders(userId).then(orders => {
        if (Array.isArray(orders)) {
          if (type === 'current') {
            this.currentOrders = orders.filter(order => order.status === 'active');
          } else if (type === 'history') {
            this.pastOrders = orders.filter(order => order.status === 'completed');
          }
        }
      }).catch(error => {
        console.error('Error loading orders:', error);
      });
    }
  }

  markOrderAsFinished(orderId: string) {
    this.databaseService.updateOrderStatus(orderId, 'completed').then(() => {
      this.loadOrders(this.orderType); // Refresh the list
    });
  }

  toggleOrderDetails(orderId: string) {
    this.expandedOrders[orderId] = !this.expandedOrders[orderId];
  }

  toggleSidebar() {
    // Toggle the sidebar's open/close state
    this.sidebarVisible = !this.sidebarVisible;
    if (this.sidebarVisible==true) {
      // Set a timeout to hide the sidebar after 3 seconds if it's still open
      this.sidebarTimeout = setTimeout(() => {
        this.sidebarVisible = false;
        this.isSidebarOpen = false;
        this.sidebarTimeout = null; // Ensure the timeout is cleared
      }, 3000); // 3000 milliseconds = 3 seconds
    }
  }



  // Navigation functions
  gotoLogout() { this.router.navigate(['/login']); }
  gotoSettings() { this.router.navigate(['/settings']); }
  gotoProfile() { this.router.navigate(['/profile']); }
  gotoHome() { this.router.navigate(['/home']); }
  gotoFavorites() { this.router.navigate(['/favorites']); }
  gotoSearch(searchText: string) { this.router.navigate(['/search'], { queryParams: { query: searchText } }); }
}


