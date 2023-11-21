import { Component, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { LocationService } from '../location.service';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  selectedIndex = 0;

  showForecast(event: Event, zipcode: string) {
    event.stopPropagation();
    this.router.navigate(['/forecast', zipcode]);
  }

  public onClose(index: number) {
    this.locationService.removeLocationByIndex(index);
  }
}
