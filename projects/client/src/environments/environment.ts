// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyADyyFYfjfOTNmZXt_txuReFDSQXyXh6Wc',
    authDomain: 'ligacon-kruijt.firebaseapp.com',
    projectId: 'ligacon-kruijt',
    storageBucket: 'ligacon-kruijt.appspot.com',
    messagingSenderId: '941524038673',
    appId: '1:941524038673:web:a5c77521d5392885c56db0',
    measurementId: 'G-KWHPSDRYSV',
  },
  google: {
    gsiUrl: 'https://accounts.google.com/gsi/client',
    clientId: '222597990456-mjg2du3h7ouv37a06l7r0ub5lbq7pdcq.apps.googleusercontent.com',
    autoSelect: true,
  },
};

import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
