import 'firebase/auth';

import { of } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';

import { createServiceFactory } from '@ngneat/spectator';

import { AuthRepository } from './auth.repository';

describe('AuthRepository', () => {
  const mockAuth = {
    user: of(null),
    setPersistence: jasmine.createSpy(),
    signInWithCredential: jasmine.createSpy().and.returnValue(Promise.resolve(void 0)),
  };

  const creator = createServiceFactory({
    service: AuthRepository,
    providers: [
      {
        provide: AngularFireAuth,
        useValue: mockAuth,
      },
    ],
  });

  let service: AuthRepository;

  beforeEach(() => (service = creator().service));

  it('should create', () => expect(service).toBeTruthy());

  it('should set persistence', () => expect(mockAuth.setPersistence).toHaveBeenCalled());

  it('should sign in with credential', async () => {
    const signIn = await service.signInWithCredential('credential', 'google.com').toPromise();

    expect(mockAuth.signInWithCredential).toHaveBeenCalled();
    expect(signIn).toEqual(void 0);
  });
});
