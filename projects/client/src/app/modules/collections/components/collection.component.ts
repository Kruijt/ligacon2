import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';

import { Select } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import * as IconActions from '../../../core/store/icon/icon-state.actions';
import * as CollectionAction from '../../../core/store/collection/collection-state.actions';

import { Collection } from '../../../shared/models/collection/collection.model';
import { ActionsState } from '../../../core/store/actions/actions.state';
import { AccordionComponent } from '../../../shared/components/accordion/accordion.component';

@Component({
  selector: 'li-collection',
  templateUrl: 'collection.component.html',
  styleUrls: ['collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent {
  @Input()
  collection?: Collection;

  @ViewChild(AccordionComponent)
  accordion?: AccordionComponent;

  @Dispatch()
  readonly updateCollection = (id: string, update: Partial<Collection>) => new CollectionAction.Update(id, update);

  @Dispatch()
  readonly duplicateCollection = (id: string) => new CollectionAction.Duplicate(id);

  @Dispatch()
  readonly deleteCollection = (id: string) => new CollectionAction.Delete(id);

  @Dispatch()
  readonly openCollection = (id: string) => new CollectionAction.Open(id);

  @Dispatch()
  readonly loadIcons = (id: string) => new IconActions.GetAll(id);

  @Select(ActionsState.whileAction(IconActions.GetAll))
  readonly loading$!: Observable<boolean>;

  onOpenCollection(): void {
    const id = this.collection?.id;

    if (id) {
      this.loadIcons(id);

      this.loading$
        .pipe(
          filter((loading) => !loading),
          take(1),
        )
        .subscribe(() => {
          if (this.accordion) {
            this.accordion.open();
          }
        });
    }
  }
}
