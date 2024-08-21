import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';  // Import both ActivatedRoute and Router

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  item: any;
  allItems: any[] = [];  // All your items should be available here
  sidebarVisible: boolean = false;
  subMenuVisible: string | null = null;  // Add this line to define the property
  currentImageUrl: string = '';
  currentImageIndex: number = 0;
  user: any = {
    name: '',
    email: '',
  };

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    // Initialize all items (this could be done through a service)
    this.allItems = [
      {
        id: '1',
        imageUrl: '../../assets/examples/blackhoodie.png',
        title: 'Black Hoodie',
        price: '€39.99',
        additionalImages: [
          '../../assets/examples/blackhoodie.png',
          '../../assets/examples/caramelhoodie.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '2',
        imageUrl: '../../assets/examples/caramelhoodie.png',
        title: 'Beige Hoodie',
        price: '€49.99',
        additionalImages: [
          '../../assets/examples/blackhoodie.png',
          '../../assets/examples/caramelhoodie.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '3',
        imageUrl: '../../assets/examples/graytshirt.png',
        title: 'Gray Hoodie',
        price: '€39.99',
        additionalImages: [
          '../../assets/examples/blackhoodie.png',
          '../../assets/examples/caramelhoodie.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '4',
        imageUrl: '../../assets/examples/blackjacket.png',
        title: 'Black Jacket',
        price: '€79.99',
        additionalImages: [
          '../../assets/examples/blackjacket.png',
          '../../assets/examples/whitepuffer.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '5',
        imageUrl: '../../assets/examples/braceletgold.png',
        title: 'Golden Bracelet',
        price: '€49.99',
        additionalImages: [
          '../../assets/examples/braceletgold.png',
          '../../assets/examples/braceletsilver.png',
          '../../assets/examples/watch.png'
        ]
      },
      {
        id: '6',
        imageUrl: '../../assets/examples/blackhoodie.png',
        title: 'Black Hoodie',
        price: '€39.99',
        additionalImages: [
          '../../assets/examples/blackhoodie.png',
          '../../assets/examples/caramelhoodie.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '7',
        imageUrl: '../../assets/examples/whitepuffer.png',
        title: 'White Puffer',
        price: '€69.99',
        additionalImages: [
          '../../assets/examples/blackjacket.png',
          '../../assets/examples/whitepuffer.png',
          '../../assets/examples/caramelhoodie.png'
        ]
      },
      {
        id: '8',
        imageUrl: '../../assets/examples/redtshirt.png',
        title: 'Red T-Shirt',
        price: '€19.99',
        additionalImages: [
          '../../assets/examples/redtshirt.png',
          '../../assets/examples/bluetshirt.png',
          '../../assets/examples/blacktshirt.png'
        ]
      },
      {
        id: '9',
        imageUrl: '../../assets/examples/bluetshirt.png',
        title: 'Blue T-Shirt',
        price: '€19.99',
        additionalImages: [
          '../../assets/examples/redtshirt.png',
          '../../assets/examples/bluetshirt.png',
          '../../assets/examples/blacktshirt.png'
        ]
      },
      {
        id: '10',
        imageUrl: '../../assets/examples/braceletsilver.png',
        title: 'Silver Bracelet',
        price: '€39.99',
        additionalImages: [
          '../../assets/examples/braceletgold.png',
          '../../assets/examples/braceletsilver.png',
          '../../assets/examples/watch.png'
        ]
      },
      {
        id: '11',
        imageUrl: '../../assets/examples/watch.png',
        title: 'Watch',
        price: '€199.99',
        additionalImages: [
          '../../assets/examples/braceletgold.png',
          '../../assets/examples/braceletsilver.png',
          '../../assets/examples/watch.png'
        ]
      },
      {
        id: '12',
        imageUrl: '../../assets/examples/whitetshirt.png',
        title: 'White Basic T-Shirt',
        price: '€14.99',
        additionalImages: [
          '../../assets/examples/blacktshirt.png',
          '../../assets/examples/whitetshirt.png',
          '../../assets/examples/bluetshirt.png'
        ]
      },
      {
        id: '13',
        imageUrl: '../../assets/examples/blackjacket.png',
        title: 'Black Jacket',
        price: '€59.99',
        additionalImages: [
          '../../assets/examples/blackjacket.png',
          '../../assets/examples/whitepuffer.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '14',
        imageUrl: '../../assets/examples/braceletgold.png',
        title: 'Golden Bracelet',
        price: '€49.99',
        additionalImages: [
          '../../assets/examples/braceletgold.png',
          '../../assets/examples/braceletsilver.png',
          '../../assets/examples/watch.png'
        ]
      },
      {
        id: '15',
        imageUrl: '../../assets/examples/blackhoodie.png',
        title: 'Black Hoodie',
        price: '€49.99',
        additionalImages: [
          '../../assets/examples/blackhoodie.png',
          '../../assets/examples/caramelhoodie.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '16',
        imageUrl: '../../assets/examples/redtshirt.png',
        title: 'Red T-Shirt',
        price: '€19.99',
        additionalImages: [
          '../../assets/examples/redtshirt.png',
          '../../assets/examples/bluetshirt.png',
          '../../assets/examples/blacktshirt.png'
        ]
      },
      {
        id: '17',
        imageUrl: '../../assets/examples/bluetshirt.png',
        title: 'Blue T-Shirt',
        price: '€19.99',
        additionalImages: [
          '../../assets/examples/redtshirt.png',
          '../../assets/examples/bluetshirt.png',
          '../../assets/examples/blacktshirt.png'
        ]
      },
      {
        id: '18',
        imageUrl: '../../assets/examples/blacktshirt.png',
        title: 'Black T-Shirt',
        price: '€19.99',
        additionalImages: [
          '../../assets/examples/whitetshirt.png',
          '../../assets/examples/blacktshirt.png',
          '../../assets/examples/bluetshirt.png'
        ]
      },
      {
        id: '19',
        imageUrl: '../../assets/examples/whitetshirt.png',
        title: 'White Basic T-Shirt',
        price: '€19.99',
        additionalImages: [
          '../../assets/examples/blacktshirt.png',
          '../../assets/examples/whitetshirt.png',
          '../../assets/examples/bluetshirt.png'
        ]
      },
      {
        id: '20',
        imageUrl: '../../assets/examples/blackhoodie.png',
        title: 'Black Hoodie',
        price: '€49.99',
        additionalImages: [
          '../../assets/examples/blackhoodie.png',
          '../../assets/examples/caramelhoodie.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '21',
        imageUrl: '../../assets/examples/caramelhoodie.png',
        title: 'Beige Hoodie',
        price: '€59.99',
        additionalImages: [
          '../../assets/examples/blackhoodie.png',
          '../../assets/examples/caramelhoodie.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '22',
        imageUrl: '../../assets/examples/graytshirt.png',
        title: 'Gray Hoodie',
        price: '€49.99',
        additionalImages: [
          '../../assets/examples/blackhoodie.png',
          '../../assets/examples/caramelhoodie.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '23',
        price: '€59.99',
        imageUrl: '../../assets/examples/blackjacket.png',
        title: 'Black Jacket',
        additionalImages: [
          '../../assets/examples/blackjacket.png',
          '../../assets/examples/whitepuffer.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '24',
        imageUrl: '../../assets/examples/braceletgold.png',
        title: 'Golden Bracelet',
        price: '€49.99',
        additionalImages: [
          '../../assets/examples/braceletgold.png',
          '../../assets/examples/braceletsilver.png',
          '../../assets/examples/watch.png'
        ]
      },
      {
        id: '25',
        imageUrl: '../../assets/examples/redtshirt.png',
        title: 'Red T-Shirt',
        price: '€19.99',
        additionalImages: [
          '../../assets/examples/redtshirt.png',
          '../../assets/examples/bluetshirt.png',
          '../../assets/examples/blacktshirt.png'
        ]
      },
      {
        id: '26',
        imageUrl: '../../assets/examples/bluetshirt.png',
        title: 'Blue T-Shirt',
        price: '€19.99',
        additionalImages: [
          '../../assets/examples/redtshirt.png',
          '../../assets/examples/bluetshirt.png',
          '../../assets/examples/blacktshirt.png'
        ]
      },
      {
        id: '27',
        imageUrl: '../../assets/examples/blacktshirt.png',
        title: 'Black T-Shirt',
        price: '€19.99',
        additionalImages: [
          '../../assets/examples/whitetshirt.png',
          '../../assets/examples/blacktshirt.png',
          '../../assets/examples/bluetshirt.png'
        ]
      },
      {
        id: '28',
        imageUrl: '../../assets/examples/blackhoodie.png',
        title: 'Black Hoodie',
        price: '€49.99',
        additionalImages: [
          '../../assets/examples/blackhoodie.png',
          '../../assets/examples/caramelhoodie.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '29',
        imageUrl: '../../assets/examples/caramelhoodie.png',
        title: 'Beige Hoodie',
        price: '€59.99',
        additionalImages: [
          '../../assets/examples/blackhoodie.png',
          '../../assets/examples/caramelhoodie.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '30',
        imageUrl: '../../assets/examples/graytshirt.png',
        title: 'Gray Hoodie',
        price: '€49.99',
        additionalImages: [
          '../../assets/examples/blackhoodie.png',
          '../../assets/examples/caramelhoodie.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '31',
        imageUrl: '../../assets/examples/blackjacket.png',
        title: 'Black Jacket',
        price: '€69.99',
        additionalImages: [
          '../../assets/examples/blackjacket.png',
          '../../assets/examples/whitepuffer.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '32',
        imageUrl: '../../assets/examples/braceletgold.png',
        title: 'Golden Bracelet',
        price: '€49.99',
        additionalImages: [
          '../../assets/examples/braceletgold.png',
          '../../assets/examples/braceletsilver.png',
          '../../assets/examples/watch.png'
        ]
      },
      {
        id: '33',
        imageUrl: '../../assets/examples/blackhoodie.png',
        title: 'Black Hoodie',
        price: '€39.99',
        additionalImages: [
          '../../assets/examples/blackhoodie.png',
          '../../assets/examples/caramelhoodie.png',
          '../../assets/examples/graytshirt.png'
        ]
      },
      {
        id: '34',
        imageUrl: '../../assets/examples/whitepuffer.png',
        title: 'White Puffer',
        price: '€69.99',
        additionalImages: [
          '../../assets/examples/blackjacket.png',
          '../../assets/examples/whitepuffer.png',
          '../../assets/examples/caramelhoodie.png'
        ]
      },
      {
        id: '35',
        imageUrl: '../../assets/examples/redtshirt.png',
        title: 'Red T-Shirt',
        price: '€19.99',
        additionalImages: [
          '../../assets/examples/redtshirt.png',
          '../../assets/examples/bluetshirt.png',
          '../../assets/examples/blacktshirt.png'
        ]
      }
    ];
  }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');  // Correctly use ActivatedRoute
    this.item = this.allItems.find(i => i.id === id);
    this.currentImageUrl = this.item?.imageUrl || '';
  }


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
  toggleSidebar(visible: boolean) {
    this.sidebarVisible = visible;
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
    this.router.navigate(['/home']);  // Use the injected Router
  }
  gotoCart() {
    this.router.navigate(['/cart']);  // Use the injected Router
  }
}
