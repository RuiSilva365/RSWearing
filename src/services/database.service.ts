import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, child, update,query, orderByChild, equalTo  } from 'firebase/database';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db = getDatabase();

  constructor() {}

  // Write user data and return the promise
  writeUserData(userId: string, data: any): Promise<void> {
    return set(ref(this.db, 'users/' + userId), data);
  }

  // Update user data without overwriting other fields
  updateUserData(userId: string, data: any): Promise<void> {
    const userRef = ref(this.db, 'users/' + userId);
    return update(userRef, data); // Use update to merge fields instead of set
  }

  // Read user data
  getUserData(userId: string) {
    const dbRef = ref(this.db);
    return get(child(dbRef, `users/${userId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
  
          // If address is not an object, transform it to the correct structure
          if (typeof userData.address === 'string') {
            const addressParts = userData.address.split(', ');
            userData.address = {
              line1: addressParts[0] || '',
              line2: addressParts[1] || '',
              city: addressParts[2] || '',
              postal_code: addressParts[3] || '',
              country: userData.country || ''
            };
          }
  
          return userData;
        } else {
          console.log("No data available");
          return null;
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }
  
  //_____________________________________________________________
  // _____________________________________________________
  //________________ITEMS PART_______________________

  // Write item data
  writeItemData(itemId: string, data: any): Promise<void> {
    return set(ref(this.db, 'items/' + itemId), data);
  }

  // Update item data without overwriting other fields
  updateItemData(itemId: string, data: any): Promise<void> {
    const itemRef = ref(this.db, 'items/' + itemId);
    return update(itemRef, data); // Use update to merge fields instead of set
  }
  
  addItemData(itemId: string, data: any): Promise<void> {
    return set(ref(this.db, 'items/' + itemId), data);
  }

  // Read item data
  getItemData(itemId: string) {
    const dbRef = ref(this.db);
    return get(child(dbRef, `items/${itemId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          console.log("No data available for item");
          return null;
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  getAllItems() {
    const dbRef = ref(this.db);
    return get(child(dbRef, 'items'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          console.log("No items available");
          return null;
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        return null;
      });
  }

  //_____________________________________________________________
  // _____________________________________________________
  //________________FAVORITES PART_______________________

// Add favorite item for a user
addFavoriteItem(userId: string, itemId: string, favoriteItemData: any): Promise<void> {
  const favoriteRef = ref(this.db, `users/${userId}/favorites/${itemId}`);
  return set(favoriteRef, favoriteItemData); // Store the complete item data
}

// Remove favorite item for a user
removeFavoriteItem(userId: string, itemId: string): Promise<void> {
  const favoriteRef = ref(this.db, `users/${userId}/favorites/${itemId}`);
  return set(favoriteRef, null);
}

// Get all favorite items for a user
getUserFavorites(userId: string) {
  const favoritesRef = ref(this.db, `users/${userId}/favorites`);
  return get(favoritesRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object.keys(snapshot.val()); // Returns an array of favorite item IDs
      } else {
        console.log("No favorites found for user");
        return [];
      }
    })
    .catch((error) => {
      console.error("Error fetching favorites:", error);
      return [];
    });
}



  //_____________________________________________________________
  // _____________________________________________________
  //________________CART PART_______________________



 // Add item to cart
 addToCart(userId: string, itemId: string, data: any): Promise<void> {
  const cartRef = ref(this.db, `users/${userId}/cart/${itemId}`);
  return set(cartRef, data);
}

// Update item in cart
updateCartItem(userId: string, itemId: string, data: any): Promise<void> {
  const cartItemRef = ref(this.db, `users/${userId}/cart/${itemId}`);
  return update(cartItemRef, data);
}

// Remove item from cart
removeFromCart(userId: string, itemId: string): Promise<void> {
  const cartItemRef = ref(this.db, `users/${userId}/cart/${itemId}`);
  return set(cartItemRef, null);
}

// Get all cart items
getCartItems(userId: string) {
  const cartRef = ref(this.db, `users/${userId}/cart`);
  return get(cartRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No items in cart");
        return {};
      }
    })
    .catch((error) => {
      console.error("Error fetching cart items:", error);
      return {};
    });
}

//ORDERS PART
// Write order data
writeOrderData(orderId: string, orderData: any): Promise<void> {
  return set(ref(this.db, 'orders/' + orderId), orderData);
}

getOrders(userId: string): Promise<any[]> {
  const ordersRef = query(ref(this.db, 'orders'), orderByChild('userId'), equalTo(userId));
  return get(ordersRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
      } else {
        return [];
      }
    })
    .catch((error) => {
      throw error;
    });
}



// Update order status
updateOrderStatus(orderId: string, status: string): Promise<void> {
  const orderRef = ref(this.db, `orders/${orderId}`);
  return update(orderRef, { status })
    .then(() => console.log(`Order ${orderId} status updated to ${status}`))
    .catch((error) => {
      console.error("Error updating order status:", error.message);
      throw error;
    });
}














}
