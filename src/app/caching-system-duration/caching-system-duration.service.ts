import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { DURATION_DATA, Duration } from 'app/shared/utils/duration';
import { combineLatest } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

@Injectable()
export class CachingSystemDurationService {
  public readonly multiplier = new FormControl<number>(this.getInitialMultiplierValue());
  public readonly durationKey = new FormControl<Duration>(this.getInitialDurationKeyValue());

  // Sources
  private readonly multiplier$ = this.multiplier.valueChanges.pipe(
    startWith(this.getInitialMultiplierValue()),
    tap((multiplier) => localStorage.setItem('___multiplier___', multiplier.toString()))
  );

  private readonly durationKey$ = this.durationKey.valueChanges.pipe(
    startWith(this.getInitialDurationKeyValue()),
    tap((durationKey) => localStorage.setItem('___durationKey___', durationKey))
  );

  private selectedCachingSystemDuration$ = combineLatest([this.multiplier$, this.durationKey$]).pipe(
    map(([multiplier, durationKey]) => `${multiplier} ${durationKey}`)
  );

  // Getter
  private getInitialMultiplierValue(): number {
    // If local storage value exists then use it else use default value : 2
    return localStorage.getItem('___multiplier___') ? Number(localStorage.getItem('___multiplier___')) : 2;
  }
  private getInitialDurationKeyValue(): Duration {
    // If local storage value exists then use it else use default value : 'hour'
    return localStorage.getItem('___durationKey___') ? (localStorage.getItem('___durationKey___') as Duration) : 'hour';
  }

  // Signals

  public readonly durationMS$ = combineLatest([this.multiplier$, this.durationKey$]).pipe(
    map(([multiplier, durationKey]) => multiplier * DURATION_DATA[durationKey])
  );

  public readonly selectedCachingSystemDuration = toSignal(this.selectedCachingSystemDuration$);
  public readonly durationMS = toSignal(this.durationMS$);
}
