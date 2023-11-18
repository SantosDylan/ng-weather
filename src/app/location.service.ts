import { Injectable, effect, signal } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export const LOCATIONS: string = 'locations';

@Injectable()
export class LocationService {
  public readonly locations = signal<string[]>([]);

  private readonly _add = new ReplaySubject<string>();
  private readonly _remove = new ReplaySubject<string>();

  public readonly add$ = this._add.asObservable();
  public readonly remove$ = this._remove.asObservable();

  constructor() {
    this.initLocation();
    effect(() => localStorage.setItem(LOCATIONS, JSON.stringify(this.locations())));
  }

  private initLocation() {
    let locationLS = localStorage.getItem(LOCATIONS);
    if (locationLS) {
      const locations: string[] = JSON.parse(locationLS);
      locations.forEach((zip) => this.addLocation(zip));
    }
  }

  public addLocation(newLocation: string) {
    this.locations.update((locations) => [...locations, newLocation]);
    this._add.next(newLocation);
  }

  public removeLocation(zipcode: string) {
    this.locations.update((locations) => locations.filter((location) => location !== zipcode));
    this._remove.next(zipcode);
  }
}
