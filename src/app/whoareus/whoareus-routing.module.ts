import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WhoareusPage } from './whoareus.page';

const routes: Routes = [
  {
    path: '',
    component: WhoareusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhoareusPageRoutingModule {}
