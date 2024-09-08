import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, child, update } from 'firebase/database';
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
          
          if (typeof userData.privacyAccepted === 'undefined') {
            console.log(`privacyAccepted field is missing for user: ${userId}`);
            userData.privacyAccepted = false;
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
}
