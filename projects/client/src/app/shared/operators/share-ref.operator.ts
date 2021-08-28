import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export function shareRef<T>(bufferSize: number = 1) {
  return (source: Observable<T>) => source.pipe(shareReplay({ refCount: true, bufferSize }));
}
