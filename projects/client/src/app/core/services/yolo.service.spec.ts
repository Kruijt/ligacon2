import { race, timer } from 'rxjs';
import { mapTo, shareReplay, take } from 'rxjs/operators';

import { fakeAsync, tick } from '@angular/core/testing';

import { createServiceFactory } from '@ngneat/spectator';

import { YoloService } from './yolo.service';
import { AuthRepository } from '../repositories/auth.repository';
import { GoogleIdConfiguration, GoogleIdResponse } from '../../shared/models/yolo/yolo.model';

describe('YoloService', () => {
  const mockAuth = {
    signInWithCredential: jasmine.createSpy(),
  };

  const creator = createServiceFactory({
    service: YoloService,
    providers: [
      {
        provide: AuthRepository,
        useValue: mockAuth,
      },
    ],
  });

  let service: YoloService;
  let ar: AuthRepository;

  beforeEach(() => {
    const spec = creator();
    service = spec.service;
    ar = spec.inject(AuthRepository);

    delete window.google;
  });

  it('should create', () => expect(service).toBeTruthy());

  it('should load google on prompt', async () => {
    service.prompt();

    const google = await (service as any).google$.toPromise();

    expect(google).toBeTruthy();
  });

  it('should sign in when prompted', async () => {
    let credential: string;

    let initConfig = {
      callback: (response: GoogleIdResponse): void => void 0,
    };

    window.google = {
      accounts: {
        id: {
          prompt: jasmine.createSpy().and.callFake((response) => initConfig.callback({ credential })),
          initialize: ({ callback }: GoogleIdConfiguration) => (initConfig.callback = callback),
        },
      },
    } as any;

    credential = 'credential';

    (service as any).prompt();

    await (service as any).google$.toPromise();

    expect(window.google?.accounts.id.prompt).toHaveBeenCalled();
    expect(ar.signInWithCredential).toHaveBeenCalledWith(credential, 'google.com');

    (window.google?.accounts.id.prompt as any).calls.reset();
    (ar.signInWithCredential as any).calls.reset();
    credential = '';

    (service as any).prompt();

    expect(window.google?.accounts.id.prompt).toHaveBeenCalled();
    expect(ar.signInWithCredential).not.toHaveBeenCalled();
  });

  it('should sign in with credential when prompted', () => {});

  it('should not resolve when there is no browser', fakeAsync(async () => {
    (service as any).isBrowser = false;
    service.prompt();

    const obs = race((service as any).google$, timer(10000).pipe(mapTo('timer'))).pipe(shareReplay(1));

    obs.subscribe();

    tick(10000);

    const response = await obs.pipe(take(1)).toPromise();

    expect(response).toEqual('timer');
  }));

  it('should throw error when script loading fails', (done) => {
    const element = {
      onerror: () => {},
      set src(src: string) {
        element.onerror();
      },
    };

    (service as any).doc = {
      createElement: () => element,
    };

    (service as any).google$.toPromise().then(
      () => done.fail('resolved'),
      () => done(),
    );
  });
});
