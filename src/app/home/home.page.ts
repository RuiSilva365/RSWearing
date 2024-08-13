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
  isHovering: { [key: string]: boolean } = {
    'new-collection': false,
    'trending': false,
    'recommended': false
  };

  constructor(private http: HttpClient, private router: Router) {
    this.newCollectionItems = [
      { imageUrl: '../../assets/examples/blackhoodie.png', title: 'Black Hoodie' },
      { imageUrl: '../../assets/examples/caramelhoodie.png', title: 'Beige Hoodie' },
      { imageUrl: '../../assets/examples/graytshirt.png', title: 'Gray Hoodie' },
      { imageUrl: '../../assets/examples/blackjacket.png', title: 'Black jacket' },
      { imageUrl: '../../assets/examples/braceletgold.png', title: 'Golden bracelet' },
      { imageUrl: '../../assets/examples/blackhoodie.png', title: 'Black Hoodie' },
      { imageUrl: '../../assets/examples/whitepuffer.png', title: 'White puffer' },
      { imageUrl: '../../assets/examples/redtshirt.png', title: 'Red T-Shirt' },
      { imageUrl: '../../assets/examples/bluetshirt.png', title: 'Blue T-shirt' },
    ];

    this.hotDealsItems = [
      { imageUrl: '../../assets/examples/braceletsilver.png', title: 'Silver bracelet' },
      { imageUrl: '../../assets/examples/watch.png', title: 'Watch' },
      { imageUrl: '../../assets/examples/whitetshirt.png', title: 'White basic T-hirt' },
      { imageUrl: '../../assets/examples/blackjacket.png', title: 'Black jacket' },
      { imageUrl: '../../assets/examples/braceletgold.png', title: 'Golden bracelet' },
      { imageUrl: '../../assets/examples/blackhoodie.png', title: 'Black Hoodie' },
      { imageUrl: '../../assets/examples/redtshirt.png', title: 'Red T-Shirt' },
      { imageUrl: '../../assets/examples/bluetshirt.png', title: 'Blue T-shirt' },
      { imageUrl: '../../assets/examples/blacktshirt.png', title: 'Black T-shirt' }


    ];

    this.trendingItems = [
      { imageUrl: '../../assets/examples/whitetshirt.png', title: 'White basic T-shirt' },
      { imageUrl: '../../assets/examples/blacktshirt.png', title: 'Black T-shirt' },
      { imageUrl: '../../assets/examples/graytshirt.png', title: 'Gray Hoodie' },
      { imageUrl: '../../assets/examples/blackhoodie.png', title: 'Black Hoodie' },
      { imageUrl: '../../assets/examples/caramelhoodie.png', title: 'Beige Hoodie' },
      { imageUrl: '../../assets/examples/graytshirt.png', title: 'Gray Hoodie' },
      { imageUrl: '../../assets/examples/blackjacket.png', title: 'Black jacket' },
      { imageUrl: '../../assets/examples/braceletgold.png', title: 'Golden bracelet' }
    ];

    this.recommendedItems = [
      { imageUrl: '../../assets/examples/redtshirt.png', title: 'Red T-Shirt' },
      { imageUrl: '../../assets/examples/bluetshirt.png', title: 'Blue T-shirt' },
      { imageUrl: '../../assets/examples/blacktshirt.png', title: 'Black T-shirt' },
      { imageUrl: '../../assets/examples/blackhoodie.png', title: 'Black Hoodie' },
      { imageUrl: '../../assets/examples/caramelhoodie.png', title: 'Beige Hoodie' },
      { imageUrl: '../../assets/examples/graytshirt.png', title: 'Gray Hoodie' },
      { imageUrl: '../../assets/examples/blackjacket.png', title: 'Black jacket' },
      { imageUrl: '../../assets/examples/braceletgold.png', title: 'Golden bracelet' },
      { imageUrl: '../../assets/examples/blackhoodie.png', title: 'Black Hoodie' },
      { imageUrl: '../../assets/examples/whitepuffer.png', title: 'White puffer' },
      { imageUrl: '../../assets/examples/redtshirt.png', title: 'Red T-Shirt' },
      { imageUrl: '../../assets/examples/bluetshirt.png', title: 'Blue T-shirt' }
    ];
  }

  ngOnInit() {
    // Initialization logic here
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

  
  gotoHotDeals() {
  //pass
    }

  gotoTrending() {
  //pass
    }

  gotoNewCollection() {
      //pass
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
}
