import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';  // Import both ActivatedRoute and Router


// Define an interface for the search result items
interface SearchResultItem {
  id: string;
  name: string;
  type: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searchQuery: string = '';
  filterVisible: boolean = false;
  selectedCategory: string = '';
  selectedType: string = '';
  priceRange: { lower: number; upper: number } = { lower: 0, upper: 1000 };
  sidebarVisible: boolean = false;
  user: any = {
    name: '',
    email: '',
  };

  // Explicitly define the type of searchResults using the interface
  searchResults: SearchResultItem[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Initialize the search results with some mock data
    this.searchResults = this.getInitialResults();
  }

  showLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    loaderContainer?.classList.remove('hidden');
  }
  
  // Hide the loader
  hideLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    loaderContainer?.classList.add('hidden');
  }
  // Function to handle search input
  onSearch() {
    // Filter the results based on the search query
    this.searchResults = this.getInitialResults().filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Function to toggle the filter menu
  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

 // Function to handle filter change
 onFilterChange() {
  // Apply filters for category, type, and price range
  this.searchResults = this.getInitialResults().filter(item => {
    return (
      (this.selectedCategory === '' || item.category === this.selectedCategory) &&
      (this.selectedType === '' || item.type === this.selectedType) && // Adjusted to filter by type
      item.price >= this.priceRange.lower &&
      item.price <= this.priceRange.upper
    );
  });
  }

  // Mock data for initial search results
  getInitialResults(): SearchResultItem[] {
    return [
      // Existing items
      {
        id: '9',
        name: 'T-Shirt',
        type: 't-shirt',
        category: 'men',
        price: 20,
        description: 'A cool t-shirt.',
        imageUrl: 'assets/examples/bluetshirt.png',
      },
      {
        id: '2',
        name: 'Sweatshirt',
        type: 'sweatshirt',
        category: 'kids',
        price: 40,
        description: 'A warm sweatshirt.',
        imageUrl: 'assets/examples/caramelhoodie.png',
      },
      // New items
      {
        id: '1', 
        name: 'Black Hoodie',
        type: 'sweatshirt',
        category: 'men',
        price: 50,
        description: 'A stylish black hoodie.',
        imageUrl: '../../assets/examples/blackhoodie.png',
      },
      {
        id: '2',
        name: 'Beige Hoodie',
        type: 'sweatshirt',
        category: 'men',
        price: 45,
        description: 'A comfortable beige hoodie.',
        imageUrl: '../../assets/examples/caramelhoodie.png',
      },
      {
        id: '3',
        name: 'Gray Hoodie',
        type: 'sweatshirt',
        category: 'men',
        price: 48,
        description: 'A trendy gray hoodie.',
        imageUrl: '../../assets/examples/graytshirt.png',
      },
      {
        id: '4',
        name: 'Black Jacket',
        type: 'jacket',
        category: 'men',
        price: 70,
        description: 'A sleek black jacket.',
        imageUrl: '../../assets/examples/blackjacket.png',
      },
      {
        id:'5',
        name: 'Golden Bracelet',
        type: 'bracelet',
        category: 'accessories',
        price: 100,
        description: 'A luxurious golden bracelet.',
        imageUrl: '../../assets/examples/braceletgold.png',
      },
      {
        id:'1',
        name: 'Black Hoodie',
        category: 'men',
        type: 'sweatshirt',
        price: 50,
        description: 'Another stylish black hoodie.',
        imageUrl: '../../assets/examples/blackhoodie.png',
      },
      {
        id: '7',
        name: 'White Puffer',
        type: 'jacket',
        category: 'men',
        price: 80,
        description: 'A cozy white puffer jacket.',
        imageUrl: '../../assets/examples/whitepuffer.png',
      },
      {
        id: '8',
        name: 'Red T-Shirt',
        type: 't-shirt',
        category: 'men',
        price: 25,
        description: 'A vibrant red t-shirt.',
        imageUrl: '../../assets/examples/redtshirt.png',
      },
      {
        id: '9',
        name: 'Blue T-Shirt',
        type: 't-shirt',
        category: 'men',
        price: 20,
        description: 'A cool blue t-shirt.',
        imageUrl: '../../assets/examples/bluetshirt.png',
      }
    ];
  }

  goToItemDetail(itemId: string) {
    this.router.navigate(['/item', itemId]);
  }
  toggleSidebar(visible: boolean) {
    this.sidebarVisible = visible;
  }
  gotoLogout() {
    this.router.navigate(['/login']);  // Use the injected Router
  }

  gotoSettings() {
    this.router.navigate(['/settings']);  // Use the injected Router
  }

  gotoProfile() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }

  gotoHome() {
    this.router.navigate(['/Home']);  // Use the injected Router
  }

  
  gotoFacebookPage() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }
  
  gotoInstagramPage() {
    window.location.href = 'https://www.instagram.com/rswearing_official/';
  }

  gotoTwitterPage() {
    window.location.href = 'https://x.com/RS_Wearing';  // Use the injected Router
  }

  gotoTiktokPage() {
    this.router.navigate(['/profile']);  // Use the injected Router
  }
  
}


