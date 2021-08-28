import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export function getLastValue<T>(source: Observable<T>, fallback?: T): T | undefined {
  let value: T | undefined = fallback;

  source?.pipe(take(1)).subscribe((v) => (value = v));

  return value;
}
