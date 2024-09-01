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
          return snapshot.val();
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
