import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service'; // Import your DatabaseService
import { getAuth } from 'firebase/auth'; // Import getAuth from Firebase

interface Item {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
}

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
  sidebarTimeout: any; 
  subMenuVisible: string | null = null;
  isSidebarOpen: boolean = false;
  activeAccordion: string | null = null; // Track the currently active accordion
  isLoggedIn: boolean = false; 
  activeDropdown: string | null = null;

  user: any = {
    name: '',
    email: '',
    avatarUrl: '',
  };
  searchQuery: string = '';

  isHovering: { [key: string]: boolean } = {
    'new-collection': false,
    'trending': false,
    'recommended': false
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private databaseService: DatabaseService // Inject DatabaseService
  ) {}

  ngOnDestroy() {
    if (this.sidebarTimeout) {
      clearTimeout(this.sidebarTimeout);
    }
  }

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
  
      // Fetch items regardless of the user's login status
      this.fetchAllItems();
    });
  }
  // Function to scroll with looping effect
scrollLeftWithLoop(container: HTMLElement, speed: number) {
  container.scrollLeft += speed;

  // Check if scroll has reached the end
  if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
    container.scrollLeft = 0; // Loop back to the start
  }
}
  // Generates a random avatar URL if the user doesn't have one
  generateRandomAvatarUrl() {
    const randomSeed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${randomSeed}`;
  }

  fetchAllItems() {
    this.databaseService.getAllItems()
      .then((data) => {
        if (data) {
          const itemsArray = Object.values(data) as Item[]; // Explicitly cast to Item[]
  
          // Filter items into categories as needed
          this.newCollectionItems = itemsArray.filter(item => item.category === 'new-collection');
          this.hotDealsItems = itemsArray.filter(item => item.category === 'hot-deals');
          this.trendingItems = itemsArray.filter(item => item.category === 'trending');
          this.recommendedItems = itemsArray.filter(item => item.category === 'recommended');
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }

  fetchNewCollectionItems() {
    this.databaseService.getItemData('new-collection') // Assuming 'new-collection' is your collection ID
      .then((data) => {
        this.newCollectionItems = data ? Object.values(data) : []; // Convert the object to an array
      })
      .catch((error) => console.error("Error fetching new collection items:", error));
  }

  fetchHotDealsItems() {
    this.databaseService.getItemData('hot-deals') // Assuming 'hot-deals' is your collection ID
      .then((data) => {
        this.hotDealsItems = data ? Object.values(data) : []; // Convert the object to an array
      })
      .catch((error) => console.error("Error fetching hot deals items:", error));
  }

  fetchTrendingItems() {
    this.databaseService.getItemData('trending') // Assuming 'trending' is your collection ID
      .then((data) => {
        this.trendingItems = data ? Object.values(data) : []; // Convert the object to an array
      })
      .catch((error) => console.error("Error fetching trending items:", error));
  }

  fetchRecommendedItems() {
    this.databaseService.getItemData('recommended') // Assuming 'recommended' is your collection ID
      .then((data) => {
        this.recommendedItems = data ? Object.values(data) : []; // Convert the object to an array
      })
      .catch((error) => console.error("Error fetching recommended items:", error));
  }

  gotoProfile() {
    this.router.navigate(['/profile']); 
  }

  gotoSearch(searchText: string) {
    this.router.navigate(['/search'], { queryParams: { query: searchText } });
  }
  focusInput() {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }
  
  gotoLogout() {
    const auth = getAuth();
    if (auth.currentUser) {
      auth.signOut().then(() => {
        this.user = { name: '', email: '' };
        this.router.navigate(['/login']);
      }).catch((error) => console.error("Error logging out:", error));
    } else {
      this.router.navigate(['/login']);
    }
  }

  gotoSettings() {
    this.router.navigate(['/settings']);
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

  toggleAccordion(event: CustomEvent) {
    const accordionValue = event.detail.value;
    this.activeAccordion = this.activeAccordion === accordionValue ? null : accordionValue;
  
    document.querySelectorAll('ion-accordion .ion-padding').forEach((dropdown) => {
      dropdown.classList.remove('expanded');
    });
  
    const activeDropdown = document.querySelector(`ion-accordion[value="${this.activeAccordion}"] .ion-padding`);
    if (activeDropdown) {
      activeDropdown.classList.add('expanded');
    }
  }
  
  toggleSidebar() {
    // Toggle the sidebar's open/close state
    this.sidebarVisible = !this.sidebarVisible;
    if (this.sidebarVisible) {
      // Set a timeout to hide the sidebar after 3 seconds if it's still open
      this.sidebarTimeout = setTimeout(() => {
        this.sidebarVisible = false;
        this.isSidebarOpen = false;
        this.sidebarTimeout = null; // Ensure the timeout is cleared
      }, 3000); // 3000 milliseconds = 3 seconds
    }
  }

  toggleDropdown(menu: string) {
    // Close the sidebar if a dropdown is being opened
    if (this.activeDropdown !== menu) {
      this.isSidebarOpen = false; // Close the sidebar
      this.sidebarVisible = false; // Ensure the sidebar visibility state is reset
    }
  
    // Toggle the dropdown menu
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  toggleHover(section: string, state: boolean) {
    this.isHovering[section] = state;
  }

  navigateToSearch() {
    const searchInput = document.querySelector('.input-wrapper .input') as HTMLInputElement;
    if (searchInput && searchInput.value.trim().length > 0) {
      this.showLoader();
      setTimeout(() => {
        this.router.navigate(['/search'], { queryParams: { q: searchInput.value } });
        this.hideLoader(); 
      }, 2000);
    }
  }

  scrollCarousel(section: string, direction: 'prev' | 'next') {
    const container = document.querySelector(`.${section}-items`) as HTMLElement;
    if (!container) return;
  
    const scrollAmount = container.offsetWidth; // Scroll by the width of the container
    if (direction === 'next') {
      container.scrollLeft += scrollAmount;
    } else {
      container.scrollLeft -= scrollAmount;
    }
  }
  
  showLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    loaderContainer?.classList.add('visible'); // Add 'visible' class to show the loader
  }

  hideLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    loaderContainer?.classList.remove('visible'); // Remove 'visible' class to hide the loader
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

  gotoFavorites() {
    this.router.navigate(['/favorites']);  // Use the injected Router
  }

  gotoItem(id: string) {
    this.router.navigate(['/item', id]); 
  }




















}
