import { mapTo } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { OAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  readonly user$ = this.aa.user;

  constructor(private aa: AngularFireAuth) {
    this.aa.setPersistence('local');
  }

  signInWithCredential(credential: string, provider: 'google.com'): Observable<void> {
    const providerCredential = new OAuthProvider(provider).credential({ idToken: credential });

    return from(this.aa.signInWithCredential(providerCredential)).pipe(mapTo(void 0));
  }
}
