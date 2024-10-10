import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SocialmediasPageRoutingModule } from './socialmedias-routing.module';

import { SocialmediasPage } from './socialmedias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SocialmediasPageRoutingModule
  ],
  declarations: [SocialmediasPage]
})
export class SocialmediasPageModule {}
