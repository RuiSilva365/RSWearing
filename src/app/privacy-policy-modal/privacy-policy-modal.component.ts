// privacy-policy-modal.component.ts
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy-modal.component.html',
  styleUrls: ['./privacy-policy-modal.component.scss'],
})
export class PrivacyPolicyComponent {
  constructor(
    private modalController: ModalController,
    private databaseService: DatabaseService
  ) {}

  acceptPrivacyPolicy() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      //this.databaseService.writeUserData(currentUser.uid, { privacyAccepted: true });
      //this.modalController.dismiss({ accepted: true }); // Pass acceptance status
      this.modalController.dismiss();
    }
    else{
      this.modalController.dismiss({ accepted: true });
    }
  }

  rejectPrivacyPolicy() {
    this.modalController.dismiss({ accepted: false }); // Pass rejection status
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
