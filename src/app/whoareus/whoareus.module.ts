import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WhoareusPageRoutingModule } from './whoareus-routing.module';

import { WhoareusPage } from './whoareus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WhoareusPageRoutingModule
  ],
  declarations: [WhoareusPage]
})
export class WhoareusPageModule {}
