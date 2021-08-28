import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeaturesComponent } from './features.component';

const routes: Routes = [
  {
    path: '',
    component: FeaturesComponent,
    children: [
      {
        path: 'collections',
        data: { title: 'Collections' },
        loadChildren: () => import('./collections/collections.module').then((m) => m.CollectionsModule),
      },
      { path: '**', redirectTo: 'collections' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturesRoutingModule {}
