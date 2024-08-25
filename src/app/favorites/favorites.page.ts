import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';  // Import both ActivatedRoute and Router
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage {
  favoriteItems: { id: string; name: string; price: number; imageUrl: string }[] = [];
  sidebarVisible: boolean = false;
  user: any = {
    name: '',
    email: '',
  };

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Load favorite items from storage (or service)
    this.loadFavoriteItems();
  }
  toggleSidebar(visible: boolean) {
    this.sidebarVisible = visible;
  }
  loadFavoriteItems() {
    // This is where you'd load the user's saved favorites from a service or local storage
    // For now, we'll hardcode some data
    this.favoriteItems = [
      { id: '1', name: 'Black Hoodie', price: 50, imageUrl: '../../assets/examples/blackhoodie.png' },
      { id: '2', name: 'Beige Hoodie', price: 60, imageUrl: '../../assets/examples/caramelhoodie.png' },
      { id: '3', name: 'Gray T-Shirt', price: 20, imageUrl: '../../assets/examples/graytshirt.png' }
    ];
  }
  removeFromFavorites(item: any) {
    this.favoriteItems = this.favoriteItems.filter(favItem => favItem.id !== item.id);
  }

  goToItemDetail(itemId: string) {
    this.router.navigate([`/item/${itemId}`]);
  }

  addToCart(item: { id: string; name: string; price: number; imageUrl: string }) {
    console.log(`Adding ${item.name} to cart.`);
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
  gotoSearch(searchText: string) {
    this.router.navigate(['/search'], { queryParams: { query: searchText } });
  }

}
