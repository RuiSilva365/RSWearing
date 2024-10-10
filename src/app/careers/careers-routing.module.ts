import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CareersPage } from './careers.page';

const routes: Routes = [
  {
    path: '',
    component: CareersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CareersPageRoutingModule {}
