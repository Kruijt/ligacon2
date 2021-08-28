import { Injectable } from '@angular/core';

import { BaseRepository } from './base.repository';
import { Collection } from '../../shared/models/collection/collection.model';

@Injectable({
  providedIn: 'root',
})
export class CollectionRepository extends BaseRepository<Collection> {
  protected path = 'collections';
}
