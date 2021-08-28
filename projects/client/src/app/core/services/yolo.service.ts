import { environment } from '../../../environments/environment';

import { defer } from 'rxjs';
import { filter, shareReplay, tap } from 'rxjs/operators';

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { AuthRepository } from '../repositories/auth.repository';
import { Google, GoogleIdResponse } from '../../shared/models/yolo/yolo.model';

@Injectable({
  providedIn: 'root',
})
export class YoloService {
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private google$ = defer(
    () =>
      new Promise((resolve, reject) => {
        if (window.google) {
          resolve(window.google);
        } else if (this.isBrowser) {
          const script = this.doc.createElement('script');
          script.onload = () => resolve(window.google);
          script.onerror = () => reject();
          script.src = environment.google.gsiUrl;
          document.head.appendChild(script);
        }
      }),
  ).pipe(
    filter((google): google is Google => !!google),
    tap((google) => this.initialize(google)),
    shareReplay(1),
  );

  private promptCallback = ({ credential }: GoogleIdResponse) => {
    if (credential) {
      this.ar.signInWithCredential(credential, 'google.com');
    }
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private doc: Document,
    private ar: AuthRepository,
  ) {}

  prompt(): void {
    this.google$.subscribe((google) => google.accounts.id.prompt());
  }

  private initialize(google: Google): void {
    google.accounts.id.initialize({
      client_id: environment.google.clientId,
      auto_select: environment.google.autoSelect,
      cancel_on_tap_outside: false,
      callback: this.promptCallback,
    });
  }
}
