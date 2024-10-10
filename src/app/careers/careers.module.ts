import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CareersPageRoutingModule } from './careers-routing.module';

import { CareersPage } from './careers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CareersPageRoutingModule
  ],
  declarations: [CareersPage]
})
export class CareersPageModule {}
