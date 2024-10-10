import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SocialmediasPage } from './socialmedias.page';

const routes: Routes = [
  {
    path: '',
    component: SocialmediasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialmediasPageRoutingModule {}
