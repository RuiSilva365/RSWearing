  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { AuthService } from '../../services/auth.service';
  import { DatabaseService } from '../../services/database.service'; // Import your DatabaseService
  import { getAuth } from 'firebase/auth'; // Import getAuth from Firebase
  import { GestureController } from '@ionic/angular'; // Import GestureController

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
    originalNewCollectionItems: any[] = [];
    originalHotDealsItems: any[] = [];
    originalTrendingItems: any[] = [];
    originalRecommendedItems: any[] = [];
    sidebarVisible: boolean = false;
    sidebarTimeout: any;
    subMenuVisible: string | null = null;
    isSidebarOpen: boolean = false;
    activeAccordion: string | null = null; // Track the currently active accordion
    isLoggedIn: boolean = false;
    activeDropdown: string | null = null;
    isMobile = false;
    middleIndex: number = 1;
    scrollTimeout: any;
    isProgrammaticallyScrolling: boolean = false; 

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
      private databaseService: DatabaseService, // Inject DatabaseService
      private gestureCtrl: GestureController
    ) {}

    ngOnDestroy() {
      if (this.sidebarTimeout) {
        clearTimeout(this.sidebarTimeout);
      }
    }

    ngOnInit() {
      // Subscribe to user state changes
      this.isMobile = window.innerWidth <= 768;
      window.addEventListener('resize', () => {
        this.isMobile = window.innerWidth <= 768;
      });

      this.authService.getUser().subscribe(async (user) => {
        if (user) {
          this.user.name = user.displayName || 'User';

          // Fetch additional user data, including avatarUrl
          try {
            const data = await this.databaseService.getUserData(user.uid);
            if (data) {
              this.user = { ...this.user, ...data };

              // Check if avatarUrl exists; if not, generate a random one
              if (!this.user.avatarUrl) {
                this.user.avatarUrl = this.generateRandomAvatarUrl();
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          // Handle the case where the user is not logged in
          this.user.name = 'Not Logged in';
          this.user.avatarUrl = this.generateRandomAvatarUrl();
        }

        // Fetch items regardless of the user's login status
        await this.fetchAllItems();
        this.setupInfiniteScroll('new-collection-carousel');
        this.setupInfiniteScroll('hot-deals-carousel');
        this.setupInfiniteScroll('trending-carousel');


                  // Add auto-scroll on hover for desktop
          this.setupHoverScroll('new-collection-carousel');
          this.setupHoverScroll('hot-deals-carousel');
          this.setupHoverScroll('trending-carousel');
      });
    }
    // Setup infinite scroll with gesture support
// Separate click and drag events to prevent accidental navigation
setupInfiniteScroll(carouselId: string) {
  const carousel = document.getElementById(carouselId);
  if (carousel) {
    // Add swipe gesture for mobile and drag for desktop
    this.addSwipeGesture(carouselId);
    this.addMouseDrag(carouselId);
  }
}

setupHoverScroll(carouselId: string) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  let scrollInterval: any;

  // Mouse move event to detect if the mouse is on the left or right side
  carousel.addEventListener('mousemove', (e) => {
    const carouselRect = carousel.getBoundingClientRect();
    const scrollArea = 100; // Define the hover-sensitive area width in pixels

    // Clear any existing interval
    clearInterval(scrollInterval);

    if (e.clientX < carouselRect.left + scrollArea) {
      // Mouse on the left side, scroll left
      scrollInterval = setInterval(() => this.scrollLeft(carouselId), 30); // Adjust the interval for speed
    } else if (e.clientX > carouselRect.right - scrollArea) {
      // Mouse on the right side, scroll right
      scrollInterval = setInterval(() => this.scrollRight(carouselId), 30); // Adjust the interval for speed
    }
  });

  // Clear interval when the mouse leaves the carousel area
  carousel.addEventListener('mouseleave', () => {
    clearInterval(scrollInterval);
  });
}





    
 // Mouse hover effects
 highlightItem(event: Event) {
  const target = event.target as HTMLElement;
  target.classList.add('highlighted');
}

resetHighlight(event: Event) {
  const target = event.target as HTMLElement;
  target.classList.remove('highlighted');
}
    
addMouseDrag(carouselId: string) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  let isDragging = false;
  let startX: number;
  let scrollLeft: number;

  // Start drag on mousedown
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.classList.add('dragging'); // Optional: add visual feedback for dragging
  });

  // Move the carousel based on mouse movement
  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust multiplier for smoothness
    carousel.scrollLeft = scrollLeft - walk;
  });

  // Stop dragging on mouseup
  carousel.addEventListener('mouseup', () => {
    isDragging = false;
    carousel.classList.remove('dragging');
  });

  // Stop dragging if the mouse leaves the carousel
  carousel.addEventListener('mouseleave', () => {
    isDragging = false;
    carousel.classList.remove('dragging');
  });
}
    
    
// Add swipe gesture to the carousel for mobile
// Add swipe gesture for mobile
addSwipeGesture(carouselId: string) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  let startX: number;
  let endX: number;
  let isSwiping = false;

  const gesture = this.gestureCtrl.create({
    el: carousel,
    gestureName: 'swipe',
    threshold: 15, // Set a small threshold to make swiping easier
    onStart: (ev) => {
      startX = ev.startX;
    },
    onMove: (ev) => {
      isSwiping = true;
    },
    onEnd: (ev) => {
      endX = ev.deltaX;

      // Detect swipe direction and scroll accordingly
      if (endX < 0) {
        this.scrollRight(carouselId); // Swipe left, scroll right
      } else if (endX > 0) {
        this.scrollLeft(carouselId); // Swipe right, scroll left
      }

      isSwiping = false;
    }
  });
  gesture.enable(true);
}

smoothScroll(carouselId: string, direction: number) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const items = carousel.querySelectorAll('.carousel-item');
  const itemWidth = items[0].clientWidth;

  // Scroll by one item width in the specified direction
  carousel.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });

  // Check for the need to loop
  setTimeout(() => this.checkCarouselLoop(carouselId), 300);
}


checkCarouselLoop(carouselId: string) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const items = carousel.querySelectorAll('.carousel-item');
  if (!items || items.length === 0) return;  // Verificação de segurança

  const itemWidth = items[0]?.clientWidth || 0;
  const totalItems = items.length;

  // Posição atual de rolagem
  const scrollPosition = carousel.scrollLeft;

  // Largura total que pode ser rolada
  const totalScrollWidth = itemWidth * totalItems;

  // Evita a rolagem para áreas em branco
  if (scrollPosition >= totalScrollWidth - itemWidth) {
    carousel.scrollLeft = totalScrollWidth - itemWidth;  // Limita no final
  } else if (scrollPosition <= 0) {
    carousel.scrollLeft = 0;  // Limita no início
  }
}





scrollRight(carouselId: string) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const items = carousel.querySelectorAll('.carousel-item');
  const itemWidth = items[0].clientWidth;

  // Scroll by the width of one item
  carousel.scrollBy({ left: itemWidth, behavior: 'smooth' });

  // Check for looping
  setTimeout(() => this.checkCarouselLoop(carouselId), 300);
}

scrollLeft(carouselId: string) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const items = carousel.querySelectorAll('.carousel-item');
  const itemWidth = items[0].clientWidth;

  // Scroll left by the width of one item
  carousel.scrollBy({ left: -itemWidth, behavior: 'smooth' });

  // Check for looping
  setTimeout(() => this.checkCarouselLoop(carouselId), 300);
}






isMiddleItem(index: number) {
  return index === this.middleIndex;
}





    // Generates a random avatar URL if the user doesn't have one
    generateRandomAvatarUrl() {
      const randomSeed = Math.random().toString(36).substring(7);
      return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${randomSeed}`;
    }

    async fetchAllItems(): Promise<void> {
      try {
        const data = await this.databaseService.getAllItems();
        if (data) {
          const itemsArray = Object.values(data) as Item[];

          // Preload images
          itemsArray.forEach(item => {
            const img = new Image();
            img.src = item.imageUrl;
          });

          // Filter items into categories as needed and add wrap-around items for infinite scroll
          this.originalNewCollectionItems = itemsArray.filter(item => item.category === 'new-collection');
          this.newCollectionItems = [...this.originalNewCollectionItems];

          this.originalHotDealsItems = itemsArray.filter(item => item.category === 'hot-deals');
          this.hotDealsItems = [...this.originalHotDealsItems];

          this.originalTrendingItems = itemsArray.filter(item => item.category === 'trending');
          this.trendingItems = [...this.originalTrendingItems];

          this.originalRecommendedItems = itemsArray.filter(item => item.category === 'recommended');
          this.recommendedItems = [...this.originalRecommendedItems];

        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
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

    showLoader() {
      const loaderContainer = document.querySelector('.loader-container');
      loaderContainer?.classList.add('visible'); // Add 'visible' class to show the loader
    }

    hideLoader() {
      const loaderContainer = document.querySelector('.loader-container');
      loaderContainer?.classList.remove('visible'); // Remove 'visible' class to hide the loader
    }

    gotoFacebookPage() {
      this.router.navigate(['/profile']);
    }

    gotoInstagramPage() {
      this.router.navigate(['/profile']);
    }

    gotoTwitterPage() {
      this.router.navigate(['/profile']);
    }

    gotoTiktokPage() {
      this.router.navigate(['/profile']);
    }

    gotoFavorites() {
      this.router.navigate(['/favorites']);
    }

    gotoItem(id: string) {
      this.router.navigate(['/item', id]);
    }
  }
