import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy-modal.component.html',
  styleUrls: ['./privacy-policy-modal.component.scss'],
})
export class PrivacyPolicyComponent {
  constructor(private modalController: ModalController) {}

  acceptPrivacyPolicy() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Pass accepted: true to modal dismiss result
    this.modalController.dismiss({ accepted: true });
  }

  rejectPrivacyPolicy() {
    // Pass accepted: false to modal dismiss result
    this.modalController.dismiss({ accepted: false });
  }

  dismiss() {
    this.modalController.dismiss({ accepted: false });
  }
}
