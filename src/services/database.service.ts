import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db = getDatabase();

  constructor() {}

  // Write user data
  // Write user data and return the promise
  writeUserData(userId: string, data: any): Promise<void> {
    return set(ref(this.db, 'users/' + userId), data);
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
            // Handle the missing field by setting a default value or triggering a flow
            userData.privacyAccepted = false; // Or handle as needed
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
}
