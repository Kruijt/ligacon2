import { Injectable } from '@angular/core';

import { Icon } from '../../shared/models/icon/icon.model';
import { BaseRepository } from './base.repository';

@Injectable({
  providedIn: 'root',
})
export class IconRepository extends BaseRepository<Icon> {
  protected path = 'icons';

  protected rootPath: { collection: string; document: string }[] = [
    { collection: 'collections', document: 'collection' },
  ];
}
