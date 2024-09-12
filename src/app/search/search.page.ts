import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service'; 
import { getAuth } from 'firebase/auth'; 

interface SearchResultItem {
  title: string;
  id: string;
  name: string;
  type: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  men: boolean;
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
  isLoggedIn: boolean = false;
  user: any = {
    name: '',
    email: '',
  };

  searchResults: SearchResultItem[] = [];
  allItems: SearchResultItem[] = []; // Store all items initially fetched

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService, 
    private databaseService: DatabaseService 
  ) {}

  ngOnInit() {
    this.hideLoader();

    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.user.name = user.displayName || 'User';
        this.user.email = user.email || '';
      } else {
        this.isLoggedIn = false;
      }
    });

    this.fetchAllItems();
  }

  showLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    loaderContainer?.classList.remove('hidden');
  }

  hideLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    loaderContainer?.classList.add('hidden');
  }

  fetchAllItems() {
    this.databaseService.getAllItems()
      .then((data) => {
        if (data) {
          const itemsArray = Object.values(data) as SearchResultItem[];
          this.allItems = itemsArray; // Store original fetched items
          this.searchResults = itemsArray; // Initially set to all items
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }

  onSearch() {
    this.applyFilters();
  }

  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

  onFilterChange() {
    this.applyFilters();
  }
  applyFilters() {
    this.searchResults = this.allItems.filter(item => {
      const matchesCategory = 
        this.selectedCategory === '' || 
        (this.selectedCategory === 'men' && item.men) ||
        (this.selectedCategory === 'kids' && !item.men);
  
      const matchesType = this.selectedType === '' || item.type === this.selectedType;
      const matchesPrice = Number(item.price) >= this.priceRange.lower && Number(item.price) <= this.priceRange.upper;
      const matchesSearchQuery = this.searchQuery === '' || item.title.toLowerCase().includes(this.searchQuery.toLowerCase());
  
      return matchesCategory && matchesType && matchesPrice && matchesSearchQuery;
    });
  }
  

  goToItemDetail(itemId: string) {
    this.router.navigate(['/item', itemId]);
  }

  toggleSidebar(visible: boolean) {
    this.sidebarVisible = visible;
  }

  gotoLogout() {
    const auth = getAuth();
    if (auth.currentUser) {
      auth.signOut().then(() => {
        this.user = { name: '', email: '' };
        this.router.navigate(['/login']);
      }).catch((error) => {
        console.error("Error logging out:", error);
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  gotoSettings() {
    this.router.navigate(['/settings']);
  }

  gotoProfile() {
    this.router.navigate(['/profile']);
  }

  gotoHome() {
    this.router.navigate(['/home']);
  }

  gotoFacebookPage() {
    this.router.navigate(['/profile']);
  }

  gotoInstagramPage() {
    window.location.href = 'https://www.instagram.com/rswearing_official/';
  }

  gotoTwitterPage() {
    window.location.href = 'https://x.com/RS_Wearing';
  }

  gotoTiktokPage() {
    this.router.navigate(['/profile']);
  }
}
