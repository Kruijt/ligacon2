import { from, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, switchMap, take, tap } from 'rxjs/operators';

import {
  AngularFirestore,
  AngularFirestoreDocument,
  CollectionReference,
  DocumentReference,
  Query,
  QueryDocumentSnapshot,
  SetOptions,
} from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';

import { FirestoreDataConverter } from 'firebase/firestore';

import { Select, Store } from '@ngxs/store';

import { BaseModel } from '../../shared/models/base.model';
import { AccountState } from '../store/account/account.state';
import { RouterNavState } from '../store/router-nav/router-nav.state';
import { shareRef } from '../../shared/operators/share-ref.operator';
import { isRepositoryOffline } from '../modules/repository/repository.utilities';
import { Params } from '@angular/router';

@Injectable()
export abstract class BaseRepository<T extends BaseModel> {
  @Select(AccountState.userId)
  readonly userId$!: Observable<string | undefined>;

  @Select(RouterNavState.params)
  readonly params$!: Observable<Params>;

  protected abstract path: string;

  protected rootPath: { collection: string; document: string }[] = [];

  idField: T['id'] = 'id';

  protected path$: Observable<string> = this.params$.pipe(
    map((params) => this.rootPath.map(({ collection, document }) => `${collection}/${params[document]}`).join('/')),
    map((rootPath) => `${rootPath}/${this.path}`),
    distinctUntilChanged(),
    shareRef(),
  );

  constructor(protected fs: AngularFirestore, protected store: Store) {}

  createId(): string {
    return this.fs.createId();
  }

  create$(value?: Partial<T>): Observable<string> {
    return this.userId$.pipe(
      filter((userId) => !!userId),
      take(1),
      switchMap((userId) => this.upsert$({ ...value, owner: userId } as T)),
    );
  }

  collection$(): Observable<T[]> {
    return this.userId$.pipe(
      filter((userId) => !!userId),
      distinctUntilChanged(),
      switchMap((userId) =>
        this.path$.pipe(
          switchMap((path) =>
            this.fs
              .collection<T>(
                path,
                // @ts-ignore
                (ref: CollectionReference): Query => ref.where('owner', '==', userId).withConverter(this.converter),
              )
              .snapshotChanges(),
          ),
        ),
      ),
      map((docSnapshots) => docSnapshots.map((docSnapshot) => this.getDataWithId(docSnapshot.payload.doc))),
    );
  }

  doc$(id: string): Observable<T | undefined> {
    return this.path$.pipe(
      switchMap((path) => this.fs.doc<T>(this.docRef(path, id)).snapshotChanges()),
      map((docSnapshot) => {
        if (docSnapshot.payload.exists) {
          return this.getDataWithId(docSnapshot.payload);
        }
      }),
    );
  }

  update$(id: string, value: Partial<T>, setOptions?: SetOptions) {
    return this.docSet(id, value, setOptions);
  }

  delete$(id: string): Observable<void> {
    return this.doc(id).pipe(
      take(1),
      switchMap((doc) => doc.delete()),
    );
  }

  upsert$(value: Partial<T>, setOptions?: SetOptions): Observable<string> {
    const id = value?.[this.idField as keyof T] || this.createId();

    return this.docSet(id as string, value, setOptions);
  }

  protected converter: FirestoreDataConverter<T> = {
    toFirestore: (value: T) => {
      return {
        ...value,
        id: null,
      };
    },
    fromFirestore: (snapshot, options) => ({
      ...(<T>snapshot.data(options)),
      id: snapshot.id,
    }),
  };

  private getDataWithId<TData>(doc: QueryDocumentSnapshot<TData>) {
    const data: any = doc.data();
    const id = data?.[this.idField] || doc.id;
    return { ...data, [this.idField]: id };
  }

  private doc(id: string): Observable<AngularFirestoreDocument<T>> {
    return this.path$.pipe(map((path) => this.fs.doc(this.docRef(path, id))));
  }

  private docSet(id: string, value: any, setOptions?: SetOptions): Observable<string> {
    setOptions = setOptions || { merge: true };

    return this.doc(id).pipe(
      take(1),
      switchMap((doc) => {
        const set = doc.set(value, setOptions);

        return isRepositoryOffline() ? of(void 0) : set;
      }),
      mapTo(id),
    );
  }

  private docRef(path: string, id: string): DocumentReference {
    // @ts-ignore
    return this.fs.doc(`${path}/${id}`).ref.withConverter(this.converter);
  }
}
