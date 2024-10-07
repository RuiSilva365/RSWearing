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
  addSwipeGesture(carouselId: string) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
  
    const gesture = this.gestureCtrl.create({
      el: carousel,
      gestureName: 'swipe',
      onMove: (ev) => {
        const direction = ev.deltaX > 0 ? -1 : 1;
        this.smoothScroll(carouselId, direction);
      },
    });
    gesture.enable(true);
  }

  smoothScroll(carouselId: string, direction: number) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
  
    const items = carousel.querySelectorAll('.carousel-item');
    const itemWidth = items[0].clientWidth;
  
    // Smooth scroll by one item width in the specified direction
    carousel.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
  
    // Use a setTimeout to check for the need to loop after the scroll animation is complete
    setTimeout(() => this.checkCarouselLoop(carouselId), 300); // 300ms should match the transition time
  }
 
 // Update checkCarouselLoop for circular scrolling without clones
 checkCarouselLoop(carouselId: string) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const items = carousel.querySelectorAll('.carousel-item');
  const itemWidth = items[0].clientWidth;
  const totalItems = items.length;
  const totalWidth = itemWidth * totalItems;

  // If the user scrolls past the last item, reset to the original position at the start (skipping clones)
  if (carousel.scrollLeft >= totalWidth - itemWidth * totalItems / 3) {
    carousel.style.transition = 'none'; // Remove transition to avoid the user noticing the jump
    carousel.scrollLeft = itemWidth * totalItems / 3; // Jump back to the original first item
    setTimeout(() => {
      carousel.style.transition = ''; // Restore transition after the jump
    }, 0);
  } 
  // If the user scrolls before the first item, reset to the original position at the end (skipping clones)
  else if (carousel.scrollLeft <= 0) {
    carousel.style.transition = 'none'; // Remove transition to avoid the user noticing the jump
    carousel.scrollLeft = totalWidth - (itemWidth * totalItems / 3) * 2; // Jump to the original last item
    setTimeout(() => {
      carousel.style.transition = ''; // Restore transition after the jump
    }, 0);
  }
}


prepareClones(carouselId: string) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const items = carousel.querySelectorAll('.carousel-item');
  const firstCloneCount = 3; // Number of first items to clone at the end
  const lastCloneCount = 3; // Number of last items to clone at the beginning

  // Add clones of the first items to the end
  for (let i = 0; i < firstCloneCount; i++) {
    const clone = items[i].cloneNode(true);
    carousel.appendChild(clone);
  }

  // Add clones of the last items to the start
  for (let i = items.length - lastCloneCount; i < items.length; i++) {
    const clone = items[i].cloneNode(true);
    carousel.insertBefore(clone, items[0]);
  }

  // Adjust the scroll position to start in the "real" items section
  carousel.scrollLeft = items[0].clientWidth * lastCloneCount;
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


  addScrollEvent(carouselId: string) {
    const carousel = document.getElementById(carouselId);
    if (carousel) {
      carousel.addEventListener('scroll', () => this.onScrollUpdateMiddle(carouselId), { passive: true });
    }
  }

  

  
/*   handleCarouselBoundary(carousel: HTMLElement, carouselId: string) {
    const items = carousel.querySelectorAll('.carousel-item');
    const itemWidth = items[0].clientWidth;
    const totalWidth = carousel.scrollWidth;
    const carouselWidth = carousel.clientWidth;
  
    if (carousel.scrollLeft >= totalWidth - carouselWidth - itemWidth) {
      requestAnimationFrame(() => {
        carousel.scrollLeft = itemWidth * 2;
      });
    }
  
    if (carousel.scrollLeft <= 0) {
      requestAnimationFrame(() => {
        carousel.scrollLeft = totalWidth - carouselWidth - itemWidth * 2;
      });
    }
  }
   */
  
  scrollToFirstRealItem(carouselId: string) {
    const carousel = document.getElementById(carouselId);
    if (carousel) {
      const items = carousel.querySelectorAll('.carousel-item');
      const itemWidth = items[0].clientWidth;
  
      // Scroll to the first real item, skipping the prepended clones
      requestAnimationFrame(() => {
        carousel.scrollLeft = itemWidth * 2; // Start at the real first item
      });
    }
  }
  
  


isMiddleItem(index: number) {
  return index === this.middleIndex;
}

onScrollUpdateMiddle(carouselId: string) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const items = carousel.querySelectorAll('.carousel-item') as NodeListOf<HTMLElement>;
  const carouselCenter = carousel.clientWidth / 2;
  let closestItem: HTMLElement | null = null;
  let closestDistance = Infinity;

  items.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const itemCenter = itemRect.left + itemRect.width / 2;
    const distanceToCenter = Math.abs(itemCenter - carouselCenter);

    if (distanceToCenter < closestDistance) {
      closestDistance = distanceToCenter;
      closestItem = item;
    }
  });

  // Remove 'middle-item' class from all items
  items.forEach((item) => item.classList.remove('middle-item'));

  // Add 'middle-item' class to closest item, ensuring it is not null
  if (closestItem) {
    (closestItem as HTMLElement).classList.add('middle-item'); // Asserting closestItem as HTMLElement
  }
}






// Update middle item class for each carousel
updateMiddleItemClass(carouselId: string, middleIndex: number) {
  const carousel = document.getElementById(carouselId);
  if (carousel) {
    const items = carousel.querySelectorAll('.carousel-item');
    items.forEach((item, index) => {
      if (index === middleIndex) {
        item.classList.add('middle-item');
      } else {
        item.classList.remove('middle-item');
      }
    });
  }
}


  
prependItems(carousel: HTMLElement) {
  const items = carousel.querySelectorAll('.carousel-item');
  const lastItem = items[items.length - 1];
  const clone = lastItem.cloneNode(true);
  
  // Add a new clone of the last item at the beginning
  carousel.insertBefore(clone, items[0]);

  // Adjust scroll position to keep the view consistent
  requestAnimationFrame(() => {
    carousel.scrollLeft += lastItem.clientWidth;
  });
}


appendItems(carousel: HTMLElement) {
  const items = carousel.querySelectorAll('.carousel-item');
  const firstItem = items[0];
  const clone = firstItem.cloneNode(true);
  
  // Add a new clone of the first item at the end
  carousel.appendChild(clone);
}


  // Jump to a specific item in the carousel
// Jump to a specific item in the carousel
jumpToItem(carousel: HTMLElement, index: number) {
  const items = carousel.querySelectorAll('.carousel-item');
  const itemWidth = items[0].clientWidth;
  const scrollPosition = itemWidth * index;

  this.isProgrammaticallyScrolling = true; // Start programmatic scrolling
  clearTimeout(this.scrollTimeout);

  this.scrollTimeout = setTimeout(() => {
    carousel.scrollTo({
      left: scrollPosition,
      behavior: 'auto' // No smooth scrolling to avoid shaking
    });

    // Stop programmatic scrolling after the jump
    this.isProgrammaticallyScrolling = false;
  }, 100); // Give time for scroll to finish
}


stopScrolling() {
  this.isProgrammaticallyScrolling = false; // Stop any ongoing scroll actions
  clearTimeout(this.scrollTimeout); // Clear any pending scroll timeouts
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
