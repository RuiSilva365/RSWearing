import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service'; // Import your DatabaseService
import { getAuth } from 'firebase/auth'; // Import getAuth from Firebase

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
  sidebarTimeout: any; 
  isSidebarOpen: boolean = false;

  user: any = {
    name: '',
    email: '',
    avatarUrl: '',
  };

  searchResults: SearchResultItem[] = [];
  allItems: SearchResultItem[] = []; // Store all items initially fetched

  constructor(
    private router: Router,
    private authService: AuthService,
    private databaseService: DatabaseService // Inject DatabaseService
  ) {}


  ngOnInit() {
    this.hideLoader();
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
  
      // Fetch items regardless of the user's login status
      this.fetchAllItems();
    });
  }

    // Generates a random avatar URL if the user doesn't have one
    generateRandomAvatarUrl() {
      const randomSeed = Math.random().toString(36).substring(7);
      return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${randomSeed}`;
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
