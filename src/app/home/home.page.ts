import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  items: any[] = [];
  trendingItems: any[] = [];
  newCollectionItems: any[] = [];
  hotDealsItems: any[] = [];
  recommendedItems: any[] = [];
  sidebarVisible: boolean = false;
  subMenuVisible: string | null = null;  // Add this line to define the property
  user: any = {
    name: '',
    email: '',
  };
  searchQuery: string = '';

  isHovering: { [key: string]: boolean } = {
    'new-collection': false,
    'trending': false,
    'recommended': false
  };

  constructor(private http: HttpClient, private router: Router) {

    this.newCollectionItems = [
      { id: '1', imageUrl: '../../assets/examples/blackhoodie.png', title: 'Black Hoodie' },
      { id: '2',imageUrl: '../../assets/examples/caramelhoodie.png', title: 'Beige Hoodie' },
      { id: '3', imageUrl: '../../assets/examples/graytshirt.png', title: 'Gray Hoodie' },
      { id: '4',imageUrl: '../../assets/examples/blackjacket.png', title: 'Black jacket' },
      { id: '5',imageUrl: '../../assets/examples/braceletgold.png', title: 'Golden bracelet' },
      { id: '6',imageUrl: '../../assets/examples/blackhoodie.png', title: 'Black Hoodie' },
      { id: '7',imageUrl: '../../assets/examples/whitepuffer.png', title: 'White puffer' },
      { id: '8',imageUrl: '../../assets/examples/redtshirt.png', title: 'Red T-Shirt' },
      { id: '9', imageUrl: '../../assets/examples/bluetshirt.png', title: 'Blue T-shirt' }
    ];

    this.hotDealsItems = [
      { id: '8', imageUrl: '../../assets/examples/braceletsilver.png', title: 'Silver bracelet' },
      { id: '7', imageUrl: '../../assets/examples/watch.png', title: 'Watch' },
      { id: '9', imageUrl: '../../assets/examples/whitetshirt.png', title: 'White basic T-hirt' },
      { id: '10', imageUrl: '../../assets/examples/blackjacket.png', title: 'Black jacket' },
      { id: '11', imageUrl: '../../assets/examples/braceletgold.png', title: 'Golden bracelet' },
      { id: '12', imageUrl: '../../assets/examples/blackhoodie.png', title: 'Black Hoodie' },
      { id: '13', imageUrl: '../../assets/examples/redtshirt.png', title: 'Red T-Shirt' },
      { id: '14', imageUrl: '../../assets/examples/bluetshirt.png', title: 'Blue T-shirt' },
      { id: '15', imageUrl: '../../assets/examples/blacktshirt.png', title: 'Black T-shirt' }


    ];

    this.trendingItems = [
      { id: '16', imageUrl: '../../assets/examples/whitetshirt.png', title: 'White basic T-shirt' },
      { id: '17', imageUrl: '../../assets/examples/blacktshirt.png', title: 'Black T-shirt' },
      { id: '18', imageUrl: '../../assets/examples/graytshirt.png', title: 'Gray Hoodie' },
      { id: '19', imageUrl: '../../assets/examples/blackhoodie.png', title: 'Black Hoodie' },
      { id: '20', imageUrl: '../../assets/examples/caramelhoodie.png', title: 'Beige Hoodie' },
      { id: '21', imageUrl: '../../assets/examples/graytshirt.png', title: 'Gray Hoodie' },
      { id: '22', imageUrl: '../../assets/examples/blackjacket.png', title: 'Black jacket' },
      { id: '23', imageUrl: '../../assets/examples/braceletgold.png', title: 'Golden bracelet' }
    ];

    this.recommendedItems = [
      { id: '24', imageUrl: '../../assets/examples/redtshirt.png', title: 'Red T-Shirt' },
      { id: '25', imageUrl: '../../assets/examples/bluetshirt.png', title: 'Blue T-shirt' },
      { id: '26', imageUrl: '../../assets/examples/blacktshirt.png', title: 'Black T-shirt' },
      { id: '27', imageUrl: '../../assets/examples/blackhoodie.png', title: 'Black Hoodie' },
      { id: '28', imageUrl: '../../assets/examples/caramelhoodie.png', title: 'Beige Hoodie' },
      { id: '29', imageUrl: '../../assets/examples/graytshirt.png', title: 'Gray Hoodie' },
      { id: '30', imageUrl: '../../assets/examples/blackjacket.png', title: 'Black jacket' },
      { id: '31', imageUrl: '../../assets/examples/braceletgold.png', title: 'Golden bracelet' },
      { id: '32', imageUrl: '../../assets/examples/blackhoodie.png', title: 'Black Hoodie' },
      { id: '33', imageUrl: '../../assets/examples/whitepuffer.png', title: 'White puffer' },
      { id: '34', imageUrl: '../../assets/examples/redtshirt.png', title: 'Red T-Shirt' },
      { id: '35', imageUrl: '../../assets/examples/bluetshirt.png', title: 'Blue T-shirt' }
    ];
  }
// Show the loader
showLoader() {
  const loaderContainer = document.querySelector('.loader-container');
  loaderContainer?.classList.remove('hidden');
}

// Hide the loader
hideLoader() {
  const loaderContainer = document.querySelector('.loader-container');
  loaderContainer?.classList.add('hidden');
}
  ngOnInit() {
    this.hideLoader();

  }

  gotoProfile() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }

  gotoSearch(searchText: string) {
    this.router.navigate(['/search'], { queryParams: { query: searchText } });
  }

  gotoLogout() {
    this.router.navigate(['/login']);  // Use the injected Router
  }

  gotoSettings() {
    this.router.navigate(['/settings']);  // Use the injected Router
  }
  gotoCart() {
    this.router.navigate(['/cart']);
    }

  
  gotoHotDeals() {
    this.router.navigate(['/settings']);
    }

  gotoTrending() {
    this.router.navigate(['/settings']);
    }

  gotoNewCollection() {
    this.router.navigate(['/settings']);
    }

    
  toggleSidebar(visible: boolean) {
    this.sidebarVisible = visible;
  }

  toggleHover(section: string, state: boolean) {
    this.isHovering[section] = state;
  }

  showSubMenu(menu: string) {
    this.subMenuVisible = menu;  // Set the visible submenu based on the passed menu identifier
  }

  hideSubMenu() {
    this.subMenuVisible = null;  // Hide the submenu
  }

  gotoFacebookPage() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }
  
  gotoInstagramPage() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }

  gotoTwitterPage() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }

  gotoTiktokPage() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }
  
  gotoItem(id: string) {
    this.showLoader(); // Show loader on login click

    // Simulate a delay before navigating (to show the loader)
    setTimeout(() => {
      this.router.navigate(['/item', id]); 
      this.hideLoader(); // Hide loader after navigation
    }, 2000); // Simulate a 2-second delay
     // Navigates to the item detail page with the item's id
  }

  navigateToSearch() {
    if (this.searchQuery.trim().length > 0) {
      this.showLoader();
      setTimeout(() => {
        this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
         this.hideLoader(); // Hide loader after navigation
      }, 2000);
      // Navigate to the search page and pass the search query as a parameter
      
    }
  }

}
