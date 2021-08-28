import { Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Select } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { Collection } from '../../shared/models/collection/collection.model';
import { CollectionState } from '../../core/store/collection/collection.state';
import * as CollectionAction from '../../core/store/collection/collection-state.actions';

@Component({
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsComponent {
  @Dispatch()
  readonly createCollection = () => new CollectionAction.Create();

  @Dispatch()
  readonly getAllCollections = () => new CollectionAction.GetAll();

  @Select(CollectionState)
  readonly collections$!: Observable<Collection[]>;

  constructor() {
    this.getAllCollections();
  }
}
