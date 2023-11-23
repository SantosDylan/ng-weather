import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';

@Injectable()
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private http: HttpClient, private location: LocationService) {
    this.location.add$
      .pipe(
        takeUntilDestroyed(),
        mergeMap((zip) =>
          this.getCurrentConditions$(zip).pipe(
            catchError((err: HttpErrorResponse) => {
              if (err.status === 404) {
                this.location.removeLocationByZipCode(zip);
                alert(`City not found with zipcode : ${zip}`);
                return EMPTY;
              }
            }),
            map((currentConditions) => ({ data: { ...currentConditions, tabTitle: `${currentConditions.name} (${zip})` }, zip }))
          )
        )
      )
      .subscribe(({ data, zip }) => this.currentConditions.update((currentConditions) => [...currentConditions, { data, zip }]));

    this.location.remove$
      .pipe(takeUntilDestroyed())
      .subscribe((removedZip) => this.currentConditions.update((currentConditions) => currentConditions.filter((condition) => condition.zip !== removedZip)));
  }

  private getCurrentConditions$(zip: string): Observable<CurrentConditions> {
    return this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zip},us&units=imperial&APPID=${WeatherService.APPID}`);
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232) return WeatherService.ICON_URL + 'art_storm.png';
    else if (id >= 501 && id <= 511) return WeatherService.ICON_URL + 'art_rain.png';
    else if (id === 500 || (id >= 520 && id <= 531)) return WeatherService.ICON_URL + 'art_light_rain.png';
    else if (id >= 600 && id <= 622) return WeatherService.ICON_URL + 'art_snow.png';
    else if (id >= 801 && id <= 804) return WeatherService.ICON_URL + 'art_clouds.png';
    else if (id === 741 || id === 761) return WeatherService.ICON_URL + 'art_fog.png';
    else return WeatherService.ICON_URL + 'art_clear.png';
  }
}
