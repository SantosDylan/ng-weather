import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { WeatherService } from '../weather.service';
import { Forecast } from './forecast.type';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
})
export class ForecastsListComponent {
  zipcode: string;
  data$: Observable<Forecast> | null = null;

  constructor(protected weatherService: WeatherService, route: ActivatedRoute) {
    this.data$ = route.params.pipe(
      tap((params) => (this.zipcode = params['zipcode'])),
      mergeMap((params) => this.weatherService.getForecast(params['zipcode']))
    );
  }
}
