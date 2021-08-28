import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

import { SharedModule } from '../../shared/shared.module';
import { CollectionsRoutingModule } from './collections-routing.module';

import { CollectionComponent } from './components/collection.component';
import { CollectionsComponent } from './collections.component';
import { AccordionModule } from '../../shared/components/accordion/accordion.module';

@NgModule({
  declarations: [CollectionsComponent, CollectionComponent],
  imports: [
    CommonModule,
    FormsModule,

    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,

    SharedModule,
    AccordionModule,

    CollectionsRoutingModule,
  ],
})
export class CollectionsModule {}
