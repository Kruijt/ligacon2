import { Google } from './app/shared/models/yolo/yolo.model';

import 'zone.js';

declare global {
  interface Window {
    google?: Google;
  }
}
