import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  @ViewChild('threeCanvas', { static: false }) threeCanvas!: ElementRef<HTMLCanvasElement>;
  item: any;
  allItems: any[] = [];
  sidebarVisible: boolean = false;
  subMenuVisible: string | null = null;
  currentImageUrl: string = '';
  currentImageIndex: number = 0;
  isLoggedIn: boolean = false;
  user: any = {
    name: '',
    email: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private databaseService: DatabaseService
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
  
    if (this.threeCanvas && this.threeCanvas.nativeElement) {
      const renderer = new THREE.WebGLRenderer({ canvas: this.threeCanvas.nativeElement });
  
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
        object.position.set(0, -0.5, 0); // Adjust the position to lower the model slightly
        object.scale.set(1, 0.8, 1); // Scale down the height (Y-axis) of the model
        scene.add(object);
        this.hideLoader();
      }, undefined, (error) => {
        this.hideLoader(); // Hide loader if item not found
        console.error('Error loading 3D model:', error);
      });
  
      const light = new THREE.AmbientLight(0x404040);
      scene.add(light);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(0, 1, 1).normalize();
      scene.add(directionalLight);
  
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.2;
      controls.screenSpacePanning = false;
      controls.minDistance = 2;
      controls.maxDistance = 100;
      controls.maxPolarAngle = Math.PI / 2;
  
      camera.position.z = 5;
  
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

  prevImage() {
    if (this.item?.additionalImages) {
      this.currentImageIndex = (this.currentImageIndex > 0) ? this.currentImageIndex - 1 : this.item.additionalImages.length - 1;
      this.currentImageUrl = this.item.additionalImages[this.currentImageIndex];
    }
  }

  nextImage() {
    if (this.item?.additionalImages) {
      this.currentImageIndex = (this.currentImageIndex < this.item.additionalImages.length - 1) ? this.currentImageIndex + 1 : 0;
      this.currentImageUrl = this.item.additionalImages[this.currentImageIndex];
    }
  }


  showLoader() {
    const loaderContainer = document.querySelector('.loader-container-wait');
    if (loaderContainer) {
      loaderContainer.classList.add('visible');
      loaderContainer.classList.remove('hidden');
      console.log('Loader shown', loaderContainer);
    }
  }
  
  hideLoader() {
    const loaderContainer = document.querySelector('.loader-container-wait');
    if (loaderContainer) {
      loaderContainer.classList.remove('visible');
      loaderContainer.classList.add('hidden');
      console.log('Loader hidden', loaderContainer);
    }
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
}
