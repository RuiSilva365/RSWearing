import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AlertController } from '@ionic/angular'; // Import AlertController

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  @ViewChild('threeCanvas', { static: false }) threeCanvas!: ElementRef<HTMLCanvasElement>;
  item: any;
  allItems: any[] = [];
  gifUrl: string | null = null;
  showGifModal: boolean = false;
  sidebarVisible: boolean = false;
  subMenuVisible: string | null = null;
  currentImageUrl: string = '';
  currentImageIndex: number = 0;
  isLoggedIn: boolean = false;
  message: string = ''; // For general messages
  cartMessage: string = '';
  favoriteMessage: string = ''; // For favorite-specific messages
  selectedSize: string = 'S'; 
  user: any = {
    name: '',
    email: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.showLoader();
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.user.name = user.displayName || 'User';
        this.user.email = user.email || '';
      } else {
        this.isLoggedIn = false;
      }

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.databaseService.getItemData(id).then((itemData) => {
          if (itemData) {
            this.item = itemData;
            this.currentImageUrl = this.item.imageUrl || '';
            this.initThreeJS();
          } else {
            this.hideLoader(); // Hide loader if item not found
            console.error('Item not found!');
          }
        }).catch((error) => {
          this.hideLoader(); // Hide loader if item not found
          console.error('Error fetching item:', error);
        });
      } else {
        this.hideLoader(); // Hide loader if item not found
      }
    });
  }


  initThreeJS() {
    if (!this.item || !this.item['3d_image']) {
      console.error('3D image data is missing or item not loaded.');
      this.hideLoader(); // Hide loader if item not found
      return;
    }
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5; // Use the camera position from the first script
  
    if (this.threeCanvas && this.threeCanvas.nativeElement) {
      const renderer = new THREE.WebGLRenderer({ 
        canvas: this.threeCanvas.nativeElement, 
        alpha: true // Enable transparency
      });

      // Set a higher pixel ratio for better quality on high-density screens
      renderer.setPixelRatio(window.devicePixelRatio || 2);
      renderer.setClearColor(0x000000, 0);

      const parentElement = this.threeCanvas.nativeElement.parentElement;
      if (parentElement) {
        const containerWidth = parentElement.offsetWidth;
        const containerHeight = parentElement.offsetHeight;
        renderer.setSize(containerWidth, containerWidth); // Ensure a square canvas
      } else {
        console.warn('Parent element of the canvas is not found.');
        renderer.setSize(500, 500); // Set a default size for fallback
      }
      
      const loader = new GLTFLoader();
      loader.load(this.item['3d_image'], (gltf) => {
        const object = gltf.scene;
        object.position.set(0, -0.5, 0); // Position as in the first script
        object.scale.set(1, 0.8, 1); // Scale as in the first script

        scene.add(object);
        this.hideLoader();
      }, undefined, (error) => {
        this.hideLoader(); // Hide loader if item not found
        console.error('Error loading 3D model:', error);
      });

      // Add stronger ambient light
      const ambientLight = new THREE.AmbientLight(0x404040, 3); // Increase intensity
      scene.add(ambientLight);

      // Add stronger directional lights for front and back
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
      directionalLight1.position.set(0, 1, 1).normalize();
      scene.add(directionalLight1);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight2.position.set(-1, 1, -1).normalize(); // Light from the opposite side
      scene.add(directionalLight2);

      const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight3.position.set(1, -1, 0).normalize(); // Light from below
      scene.add(directionalLight3);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.2;
      controls.screenSpacePanning = false;
      controls.minDistance = 2;
      controls.maxDistance = 100;
      controls.maxPolarAngle = Math.PI / 2;
  
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    } else {
      console.error('ThreeJS canvas element not found');
      this.hideLoader();
    }
  }

  // Image manipulation methods
  setImage(index: number) {
    this.currentImageIndex = index;
    this.currentImageUrl = this.item?.additionalImages[index] || this.item?.imageUrl;
  }


  

  showGif(event: Event) {
    event.preventDefault(); // Prevent default link behavior
    
    // Show the existing loader when the GIF link is clicked
    this.showLoader();
  
    // Check if the item has a GIF URL and set it
    if (this.item?.imageGif) {
      this.gifUrl = this.item.imageGif;
      this.showGifModal = true; // Show the modal
    } else {
      this.hideLoader(); // Hide loader if GIF URL is not found
      console.error("GIF URL not found in the item data.");
    }
  }
  
  // Method to close the GIF modal
  closeGifModal() {
    this.showGifModal = false;
    this.hideLoader(); // Hide loader when the modal is closed
  }
  
  // Add the (load) and (error) event listeners directly in the HTML
  
  showLoader() {
    const loaderContainer = document.querySelector('.loader-container-wait');
    if (loaderContainer) {
      loaderContainer.classList.add('visible');
      loaderContainer.classList.remove('hidden');
      console.log('Loader shown', loaderContainer);
    } else {
      console.warn('Loader container not found');
    }
  }
  
  hideLoader() {
    const loaderContainer = document.querySelector('.loader-container-wait');
    if (loaderContainer) {
      loaderContainer.classList.remove('visible');
      loaderContainer.classList.add('hidden');
      console.log('Loader hidden', loaderContainer);
    } else {
      console.warn('Loader container not found');
    }
  }
  

// In item.page.ts
addToFavorites() {
  if (this.isLoggedIn) {
    const userId = this.authService.getCurrentUserId(); // Assuming this method returns the user ID as a string
    if (userId && this.item && this.item.id) {
      const favoriteItemData = {
        ...this.item,  // Include all item data
        size: this.selectedSize,  // Include selected size
      };

      // Pass the additional data to the service
      this.databaseService.addFavoriteItem(userId, this.item.id, favoriteItemData).then(() => {
        this.favoriteMessage = `${this.item.title} (Size: ${this.selectedSize}) added to favorites.`;
        setTimeout(() => {
          this.favoriteMessage = ''; // Clear message after a few seconds
        }, 3000); // 3 seconds delay
      }).catch((error) => {
        console.error("Error adding favorite:", error);
      });
    } else {
      console.error('User ID or item ID is missing.');
    }
  } else {
    this.showLoginAlert(); // Show alert if not logged in
  }
}



// Method to add item to cart
addToCart() {
  const userId = this.authService.getCurrentUserId(); // Get the current user ID

  if (userId) {
    if (this.item && this.item.id) {
      const cartItemData = {
        title: this.item.title,
        price: this.item.price,
        quantity: 1, // Default quantity
        imageUrl: this.item.imageUrl,
        description: this.item.description,
        size: this.selectedSize, // Add selected size
      };

      this.databaseService.addToCart(userId, this.item.id, cartItemData).then(() => {
        this.cartMessage = `${this.item.title} (Size: ${this.selectedSize}) added to cart!`;  // Set the cart message
        // Clear the message after a few seconds
        setTimeout(() => this.cartMessage = '', 3000);
      }).catch((error) => {
        console.error("Error adding item to cart:", error);
      });
    } else {
      console.error('Item or item ID is missing.');
    }
  } else {
    this.presentAlert('Login Required', 'Please log in to add items to your cart.', [
      {
        text: 'Login',
        handler: () => {
          this.router.navigate(['/login']);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
    ]);
  }
}


async presentAlert(header: string, message: string, buttons: any[]) {
  const alert = await this.alertController.create({
    header: header,
    message: message,
    buttons: buttons
  });
  await alert.present();
}
  async showLoginAlert() {
    const alert = await this.alertController.create({
      header: 'Login Required',
      message: 'Please log in to add items to your favorites.',
      buttons: ['OK']
    });
    await alert.present();
  }

    // Toggle the sidebar
  toggleSidebar(visible: boolean) { this.sidebarVisible = visible; }
  // Navigation functions
  gotoFacebookPage() { this.router.navigate(['/profile']); }
  gotoInstagramPage() { this.router.navigate(['/profile']); }
  gotoTwitterPage() { this.router.navigate(['/profile']); }
  gotoTiktokPage() { this.router.navigate(['/profile']); }
  gotoLogout() { this.router.navigate(['/login']); }
  gotoSettings() { this.router.navigate(['/settings']); }
  gotoProfile() { this.router.navigate(['/profile']); }
  gotoHome() { this.router.navigate(['/home']); }
  gotoCart() { this.router.navigate(['/cart']); }
  gotoFavorites() { this.router.navigate(['/favorites']); }
}
