import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage {
  favoriteItems: { id: string; name: string; price: number; imageUrl: string }[] = [];


  constructor(private router: Router) {}

  ngOnInit() {
    // Load favorite items from storage (or service)
    this.loadFavoriteItems();
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

  goToItemDetail(itemId: string) {
    this.router.navigate([`/item/${itemId}`]);
  }

  addToCart(item: { id: string; name: string; price: number; imageUrl: string }) {
    console.log(`Adding ${item.name} to cart.`);
  }
}
